"""Fetch the Stroeymeyt et al. 2018 fit-colony files from Zenodo.

The archive (data.zip, 24.7 GB, mostly arena photos) is read in place by
HTTP range requests, so only the members we use are downloaded:
main-experiment metadata and its 22 PreTreatment tracks. Age-experiment
(held-out) and survival-experiment files are never fetched; see
docs/STATUS.md (colony split). Tracks are stored as <member>.csv.gz.

    python3 -I scripts/fetchStroeymeyt.py [--list] [--jobs 6] [--out data/stroeymeyt2018]

Zenodo throttles each connection (~10 MB/min), so members are fetched in
parallel, one connection each. Existing files are skipped.
Data: CC BY 4.0, Zenodo 10.5281/zenodo.1480665.
"""
import argparse, gzip, io, os, re, shutil, sys, time, urllib.request, zipfile
from concurrent.futures import ProcessPoolExecutor

URL = "https://zenodo.org/api/records/1480665/files/data.zip/content"
SIZE = 24689295619

META = re.compile(
    r"^main_experiment/original_data/("
    r"info\.txt|info_dat\.txt|info_plume\.txt|task_groups\.txt|treated_worker_list\.txt"
    r"|tag_files/.+|retagged_ants/.+|plume_files/.+|time_aggregation_info/.+PreTreatment.*)$")
TRACK = re.compile(r"^main_experiment/original_data/tracking/.+_PreTreatment\.csv$")


class RangeFile(io.RawIOBase):
    """Seekable read-only view of a remote file; one block cached."""

    def __init__(self, url, size, block=1 << 20):
        self.url, self.size, self.pos, self.block = url, size, 0, block
        self.cache = {}

    def seekable(self): return True
    def readable(self): return True
    def tell(self): return self.pos

    def seek(self, off, whence=0):
        self.pos = off if whence == 0 else self.pos + off if whence == 1 else self.size + off
        return self.pos

    def _get(self, start, end):
        req = urllib.request.Request(self.url, headers={"Range": f"bytes={start}-{end - 1}"})
        err = None
        for attempt in range(6):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = r.read()
                if len(data) == end - start:
                    return data
                err = f"short read {len(data)}"
            except Exception as e:  # network hiccup: back off and retry
                err = e
            time.sleep(2 ** attempt)
        raise IOError(f"range {start}-{end}: {err}")

    def read(self, n=-1):
        if n is None or n < 0:
            n = self.size - self.pos
        n = min(n, self.size - self.pos)
        if n <= 0:
            return b""
        if n >= self.block:
            data = self._get(self.pos, self.pos + n)
        else:
            b0 = self.pos // self.block
            if b0 not in self.cache:
                self.cache = {b0: self._get(b0 * self.block, min(self.size, (b0 + 1) * self.block))}
            o = self.pos - b0 * self.block
            data = self.cache[b0][o:o + n]
        self.pos += len(data)
        return data

    def readinto(self, b):
        d = self.read(len(b))
        b[:len(d)] = d
        return len(d)


def open_zip():
    return zipfile.ZipFile(io.BufferedReader(RangeFile(URL, SIZE), buffer_size=1 << 20))


def fetch(out, name):
    gz = TRACK.match(name) is not None
    dst = os.path.join(out, name + (".gz" if gz else ""))
    if os.path.exists(dst):
        return f"skip {name}"
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    t = time.time()
    with open_zip().open(name) as src:
        with (gzip.open(dst + ".tmp", "wb", compresslevel=6) if gz else open(dst + ".tmp", "wb")) as f:
            shutil.copyfileobj(src, f, 1 << 22)
    os.replace(dst + ".tmp", dst)
    return f"got {name} {time.time() - t:.0f}s"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data/stroeymeyt2018")
    ap.add_argument("--jobs", type=int, default=6)
    ap.add_argument("--list", action="store_true", help="print size, compressed size, name of every member")
    a = ap.parse_args()
    infos = open_zip().infolist()
    if a.list:
        for i in infos:
            print(f"{i.file_size}\t{i.compress_size}\t{i.filename}")
        return
    meta = [i.filename for i in infos if META.match(i.filename)]
    tracks = [i.filename for i in infos if TRACK.match(i.filename)]
    print(f"{len(meta)} metadata files, {len(tracks)} tracks", flush=True)
    for name in meta:
        print(fetch(a.out, name), flush=True)
    with ProcessPoolExecutor(a.jobs) as ex:
        for msg in ex.map(fetch, [a.out] * len(tracks), tracks):
            print(msg, flush=True)


if __name__ == "__main__":
    sys.exit(main())
