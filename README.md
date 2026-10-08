# energeks.stacja: otwarty format kodu i danych stacji transformatorowych SN/nN

English: [README_EN.md](README_EN.md).

Jeden krótki kod, np. `ENG-B630-15S-LPT-06-K`, opisuje całą stację transformatorową SN/nN: linię (kontenerowa, dla e-mobilności, słupowa), moc, napięcie, pola rozdzielnicy SN, odpływy nN, opcje i standard operatora sieci. Ten sam kod działa w adresie strony, w ofercie, w przetargu, w dokumentach i w programach. Dane konfiguracji w JSON (`energeks.stacja/0.1`) niosą parametry, obliczenia, wyposażenie, normy i dokumenty.

Wydanie 0.1.2 (8.10.2026), silnik referencyjny 0.8.2. Historia: [CHANGELOG.md](CHANGELOG.md).

## Zawartość

| Plik | Co to |
|---|---|
| `specyfikacja_pl.md` | specyfikacja (wersja wiążąca) |
| `specification_en.md` | specification in English |
| `schemat/energeks.stacja-0.1.schema.json` | schemat JSON danych konfiguracji (`$id` to adres pliku w API: https://energeks-stacje-api.energeks.workers.dev/schemat/) |
| `schemat/energeks.stacja.wejscie-0.1.schema.json` | schemat JSON parametrów wejściowych |
| `schemat/kod.regex.txt` | wyrażenie regularne kodu kanonicznego |
| `przyklady/kody.json` | 20 kodów z nazwą, linkiem i parametrami wejściowymi |
| `przyklady/kody_bledne.json` | kody błędne składniowo i niespójne z regułami (do testów czytników) |
| `przyklady/dane_*.json` | przykłady danych konfiguracji |
| `test/test.js` | testy bez zależności (`node test/test.js`) |
| `test/test_schemat.py` | walidacja schematem (`python3 test/test_schemat.py`, pakiet `jsonschema` 4) |
| `CHANGELOG.md` | historia zmian |

## Jak użyć

- **Sprawdzenie składni kodu**: wyrażenie z `schemat/kod.regex.txt`.
- **Pełna walidacja i konfiguracja z kodu**: [kreator stacji Energeks](https://energeks.shop/stacje-transformatorowe/kreator-stacji.html?utm_source=github&utm_medium=referral&utm_campaign=standard_ai_2026q4&utm_content=repo_readme#ENG-B630-15S-LPT-06-K) (kod po znaku `#` w adresie otwiera konfigurację; projekt techniczny, karta katalogowa, OPZ i pakiet ZIP do pobrania bezpłatnie, bez rejestracji) albo API Energeks: https://energeks-stacje-api.energeks.workers.dev (opis OpenAPI pod `/openapi.yaml`, serwer MCP dla asystentów AI pod `/mcp`, bez klucza).
- **Czytanie danych**: dane z kreatora (przycisk „Pobierz dane JSON”, załącznik w karcie katalogowej PDF) i z API spełniają schemat `energeks.stacja-0.1`.
- **Testy**: `node test/test.js` i `python3 test/test_schemat.py` (uruchamiane też automatycznie w tym repozytorium, zakładka Actions).

## Zasady

- Kod raz wydany pozostaje ważny w obrębie głównej wersji formatu; nowe opcje tylko na końcu kolejności; nowe pola danych programy ignorują, jeśli ich nie znają (specyfikacja, punkt 6).
- Błędy i propozycje: Issues w tym repozytorium albo info@energeks.com.

## Licencja

Specyfikacja, schematy, przykłady i testy: CC BY 4.0 (plik `LICENSE`). Nazwa i logo Energeks oraz silnik konfiguratora nie są objęte licencją.
