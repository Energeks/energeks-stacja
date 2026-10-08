# energeks.stacja: open code and data format for MV/LV transformer substations

Polski: [README.md](README.md).

One short code, e.g. `ENG-B630-15S-LPT-06-K`, describes a complete MV/LV transformer substation: line (prefabricated concrete, e-mobility, pole-mounted), power, voltage, MV switchgear panels, LV outgoing ways, options and the grid operator standard (Poland, 15 and 20 kV networks). The same code works in a web address, in an offer, in a tender, in documents and in programs. The configuration data in JSON (`energeks.stacja/0.1`) carries input parameters, calculated values, equipment, standards and documents.

Release 0.1.2 (8 October 2026), reference engine 0.8.2. History: [CHANGELOG.md](CHANGELOG.md) (English summary in each entry).

## Contents

| File | What it is |
|---|---|
| `specyfikacja_pl.md` | specification in Polish (binding version) |
| `specification_en.md` | specification in English |
| `schemat/energeks.stacja-0.1.schema.json` | JSON schema of the configuration data (`$id` is the file address in the API: https://energeks-stacje-api.energeks.workers.dev/schemat/) |
| `schemat/energeks.stacja.wejscie-0.1.schema.json` | JSON schema of the input parameters |
| `schemat/kod.regex.txt` | regular expression of the canonical code |
| `przyklady/kody.json` | 20 codes with name, link and input parameters |
| `przyklady/kody_bledne.json` | syntactically wrong and rule-inconsistent codes (for testing readers) |
| `przyklady/dane_*.json` | examples of configuration data |
| `test/test.js` | tests without dependencies (`node test/test.js`) |
| `test/test_schemat.py` | schema validation (`python3 test/test_schemat.py`, package `jsonschema` 4) |
| `CHANGELOG.md` | change history |

Field names in the JSON data are Polish; they are part of the format. The English specification explains every field.

## How to use

- **Syntax check of a code**: the expression in `schemat/kod.regex.txt`.
- **Full validation and configuration from a code**: the [Energeks substation configurator](https://energeks.shop/stacje-transformatorowe/kreator-stacji.html?utm_source=github&utm_medium=referral&utm_campaign=standard_ai_2026q4&utm_content=repo_readme_en#ENG-B630-15S-LPT-06-K) (a code after `#` in the address opens the configuration; technical design, datasheet, tender specification and ZIP package are free, no registration; documents are in Polish) or the Energeks API: https://energeks-stacje-api.energeks.workers.dev (OpenAPI description at `/openapi.yaml`, MCP server for AI assistants at `/mcp`, no key).
- **Reading data**: data from the configurator (button "Pobierz dane JSON", attachment in the PDF datasheet) and from the API conform to the `energeks.stacja-0.1` schema.
- **Tests**: `node test/test.js` and `python3 test/test_schemat.py` (also run automatically in this repository, see Actions).

## Rules

- A code once issued stays valid within the major version of the format; new options are added only at the end of the order; programs ignore data fields they do not know (specification, section 6).
- Errors and proposals: Issues in this repository or info@energeks.com.

## Licence

Specification, schemas, examples and tests: CC BY 4.0 (file `LICENSE`). The Energeks name and logo and the configurator engine are not covered by the licence.
