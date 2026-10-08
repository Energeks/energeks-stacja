"""Walidacja przykładów danych schematem JSON (draft 2020-12). Użycie: python3 test/test_schemat.py (pakiet jsonschema 4)."""
import json, pathlib, sys
from jsonschema import Draft202012Validator
from referencing import Registry, Resource
D = pathlib.Path(__file__).resolve().parent.parent
sch = {p.name: json.loads(p.read_text(encoding='utf-8')) for p in (D / 'schemat').glob('*.schema.json')}
reg = Registry().with_resources([(s['$id'], Resource.from_contents(s)) for s in sch.values()] + [(n, Resource.from_contents(s)) for n, s in sch.items()])
for s in sch.values():
    Draft202012Validator.check_schema(s)
v = Draft202012Validator(sch['energeks.stacja-0.1.schema.json'], registry=reg)
vw = Draft202012Validator(sch['energeks.stacja.wejscie-0.1.schema.json'], registry=reg)
bledy = 0
for p in sorted((D / 'przyklady').glob('dane_*.json')):
    for e in v.iter_errors(json.loads(p.read_text(encoding='utf-8'))):
        bledy += 1; print('BŁĄD', p.name, list(e.path), e.message[:200])
for p in json.loads((D / 'przyklady' / 'kody.json').read_text(encoding='utf-8'))['przyklady']:
    for e in vw.iter_errors(p['wejscie']):
        bledy += 1; print('BŁĄD wejście', p['kod'], list(e.path), e.message[:200])
print('błędów:', bledy)
sys.exit(1 if bledy else 0)
