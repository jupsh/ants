"""Collect public catalogue metadata only; never fetch papers or data files.

Descriptions, abstracts, methods, usage notes, figures, and file contents are
excluded from the output. Titles can disclose outcomes and need exposure review.
Run from the repository root. Filtered catalogue snapshots stay inside B016.
"""
import argparse
import datetime
import json
from pathlib import Path
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
FIELDS = (
    "doi", "titles", "creators", "publisher", "publicationYear", "subjects",
    "types", "url", "rightsList", "sizes", "formats", "relatedIdentifiers",
)


def get_json(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in {
        "api.datacite.org", "datadryad.org", "api.mendeley.com",
        "data.mendeley.com", "api.figshare.com", "zenodo.org", "api.osf.io", "api.crossref.org",
    }:
        raise ValueError("Not an allowed catalogue host")
    if any(piece in parsed.path for piece in ("/download", "/content", "/files/")):
        raise ValueError("File-content endpoints are forbidden")
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=25) as response:
        return json.load(response)


def datacite(args):
    params = {"fields[dois]": ",".join(FIELDS)}
    if args.doi:
        url = "https://api.datacite.org/dois/" + args.doi
    else:
        params.update({"query": args.query, "page[size]": str(args.size),
                       "page[number]": str(args.page)})
        url = "https://api.datacite.org/dois"
    url += "?" + urllib.parse.urlencode(params)
    payload = get_json(url)
    records = payload.get("data", [])
    if isinstance(records, dict):
        records = [records]
    filtered = [{key: entry.get("attributes", {}).get(key) for key in FIELDS}
                for entry in records]
    return {"url": url, "total": payload.get("meta", {}).get("total"),
            "records": filtered}


def dryad(args):
    identifier = "doi:" + args.doi
    url = "https://datadryad.org/api/v2/datasets/" + urllib.parse.quote(identifier, safe="")
    payload = get_json(url)
    keys = ("identifier", "id", "title", "authors", "keywords", "publicationDate",
            "versionNumber", "license", "relatedWorks", "storageSize", "links", "_links")
    result = {"url": url, "record": {key: payload[key] for key in keys if key in payload}}
    links = payload.get("_links", payload.get("links", {}))
    for key, value in links.items():
        if key not in ("stash:version", "stash:download", "stash:files"):
            continue
        href = value.get("href", "") if isinstance(value, dict) else ""
        if key == "stash:version" and href:
            version_url = urllib.parse.urljoin("https://datadryad.org", href)
            version = get_json(version_url)
            version_links = version.get("_links", version.get("links", {}))
            file_link = version_links.get("stash:files", {})
            file_href = file_link.get("href", "") if isinstance(file_link, dict) else ""
            if file_href:
                files_url = urllib.parse.urljoin("https://datadryad.org", file_href)
                files = get_json(files_url)
                entries = files.get("_embedded", {}).get("stash:files", [])
                result["files_url"] = files_url
                result["file_metadata"] = []
                pages = 0
                while True:
                    result["file_metadata"].extend([
                        {field: entry[field] for field in
                         ("id", "path", "size", "mimeType", "status") if field in entry}
                        for entry in entries
                    ])
                    pages += 1
                    next_link = files.get("_links", {}).get("next", {})
                    next_href = next_link.get("href") if isinstance(next_link, dict) else None
                    if not next_href or pages >= 10:
                        break
                    files = get_json(urllib.parse.urljoin("https://datadryad.org", next_href))
                    entries = files.get("_embedded", {}).get("stash:files", [])
                result["file_catalogue_pages_read"] = pages
                result["file_catalogue_keys"] = list(files)
                result["file_catalogue_links"] = files.get("_links", {})
    return result


def zenodo(args):
    record_id = args.doi.rsplit(".", 1)[-1]
    if not record_id.isdigit():
        raise ValueError("Expected a Zenodo record DOI")
    url = "https://zenodo.org/api/records/" + record_id
    payload = get_json(url)
    allowed = ("title", "creators", "publication_date", "doi", "version",
               "keywords", "license", "access_right", "related_identifiers", "resource_type")
    return {"url": url, "record": {key: payload.get("metadata", {}).get(key)
                                    for key in allowed},
            "file_metadata": [{key: entry.get(key) for key in
                               ("key", "size", "type", "checksum")}
                              for entry in payload.get("files", [])]}


def mendeley(args):
    record_id, version = args.doi.removeprefix("10.17632/").split(".")
    url = "https://data.mendeley.com/public-api/datasets/" + record_id + "/versions/" + version
    payload = get_json(url)
    allowed = ("id", "name", "title", "doi", "version", "publish_date", "published_date",
               "contributors", "institutions", "categories", "licence", "license")
    files = payload.get("files", [])
    return {"url": url, "metadata_keys": list(payload),
            "record": {key: payload[key] for key in allowed if key in payload},
            "file_metadata": [{key: entry.get(key) for key in
                               ("id", "filename", "name", "size", "content_type")}
                              for entry in files]}


def crossref(args):
    url = "https://api.crossref.org/works/" + args.doi
    payload = get_json(url).get("message", {})
    allowed = ("DOI", "title", "author", "publisher", "published", "container-title",
               "URL", "license", "relation", "type")
    return {"url": url, "record": {key: payload[key] for key in allowed if key in payload}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("provider", choices=("datacite", "dryad", "zenodo", "mendeley", "crossref"))
    parser.add_argument("label")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--query")
    group.add_argument("--doi")
    parser.add_argument("--size", type=int, default=50)
    parser.add_argument("--page", type=int, default=1)
    args = parser.parse_args()
    if not args.label.replace("-", "").replace("_", "").isalnum():
        raise ValueError("Snapshot label must be a basename")
    result = {"datacite": datacite, "dryad": dryad, "zenodo": zenodo,
              "mendeley": mendeley, "crossref": crossref}[args.provider](args)
    result["retrieved_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    folder = ROOT / "metadata"
    folder.mkdir(exist_ok=True)
    (folder / (args.label + ".json")).write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    # Search display stays bounded; full allowed metadata remains in the snapshot.
    display = result
    if args.query:
        display = {"total": result.get("total"), "snapshot": args.label,
                   "records": [{"doi": row.get("doi"), "titles": row.get("titles")}
                               for row in result.get("records", [])]}
    print(json.dumps(display, ensure_ascii=False))


if __name__ == "__main__":
    main()
