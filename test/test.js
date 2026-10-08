// Testy specyfikacji energeks.stacja/0.1 bez zależności: składnia kodu, przykłady, wymagane pola danych.
// Użycie: node test/test.js   (pełna walidacja schematem JSON: python3 test/test_schemat.py)
'use strict';
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..');
const re = new RegExp(fs.readFileSync(path.join(D, 'schemat/kod.regex.txt'), 'utf8').trim());
const schema = JSON.parse(fs.readFileSync(path.join(D, 'schemat/energeks.stacja-0.1.schema.json'), 'utf8'));
let ok = 0, zle = 0;
function sprawdz(war, opis) { if (war) ok++; else { zle++; console.log('BŁĄD:', opis); } }
const P = JSON.parse(fs.readFileSync(path.join(D, 'przyklady/kody.json'), 'utf8'));
P.przyklady.forEach((p) => {
  sprawdz(re.test(p.kod), 'składnia ' + p.kod);
  sprawdz(p.link.endsWith('#' + p.kod.replace(/-(\d{2})\+(\d{2})(?=-|$)/, '-$1R$2')), 'link ' + p.kod);
  sprawdz(p.wejscie && ['B', 'E', 'F'].includes(p.wejscie.linia), 'wejście ' + p.kod);
});
const B = JSON.parse(fs.readFileSync(path.join(D, 'przyklady/kody_bledne.json'), 'utf8'));
B.skladnia.forEach((k) => sprawdz(!re.test(k), 'kod błędny przyjęty: ' + k));
B.niespojne.forEach((k) => sprawdz(re.test(k), 'kod niespójny powinien być poprawny składniowo: ' + k));
fs.readdirSync(path.join(D, 'przyklady')).filter((f) => /^dane_.*\.json$/.test(f)).forEach((f) => {
  const d = JSON.parse(fs.readFileSync(path.join(D, 'przyklady', f), 'utf8'));
  schema.required.forEach((k) => sprawdz(k in d, f + ': brak pola ' + k));
  sprawdz(d.schemat_danych === 'energeks.stacja/0.1', f + ': schemat_danych');
  sprawdz(re.test(d.kod), f + ': kod');
  sprawdz(f === 'dane_' + d.kod.replace('+', 'R') + '.json', f + ': nazwa pliku a kod');
});
console.log('kontroli:', ok + zle, 'błędów:', zle);
process.exitCode = zle ? 1 : 0;
