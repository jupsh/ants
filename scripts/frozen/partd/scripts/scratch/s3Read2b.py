# Scratch (not committed): Part D Stage 2b, the S3 descriptive rows through the frozen Stage 0 reader (s3AuditRead.py,
# D129) unchanged, with its set list extended to the Stage 2b arms (data 0, base 1, Eu 2, El20 3 as frozen; members
# from 4 in the order given, which fixes their bootstrap streams). Its gate G is reported as descriptive (P43: S3's
# failed gate stays on record).
#   python3 -I s3Read2b.py <dir> <out.json> <member,member,...> [--md5 <text>]
import importlib.util, os, sys

spec = importlib.util.spec_from_file_location('s3AuditRead', os.path.join(os.path.dirname(os.path.abspath(__file__)), 's3AuditRead.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
m.SETS = ['data', 'base', 'Eu', 'El20'] + [x for x in sys.argv[3].split(',') if x]
md5 = sys.argv[sys.argv.index('--md5') + 1] if '--md5' in sys.argv else None
m.main(sys.argv[1], sys.argv[2], md5)
