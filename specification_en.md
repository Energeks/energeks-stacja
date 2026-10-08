# MV/LV substation code and data, format energeks.stacja/0.1

Specification version 0.1 (release 0.1.2), 8 October 2026. Reference engine: Energeks substation configurator, engine 0.8.2. The Polish text (`specyfikacja_pl.md`) prevails in case of doubt.

## 1. Purpose and scope

This specification defines two things that let people, programs and AI assistants exchange the configuration of a prefabricated or pole-mounted MV/LV transformer substation (15 and 20 kV networks, transformers 63 to 2500 kVA and 2 x 400 to 2 x 1000 kVA) without ambiguity:

1. the **substation code**, a short string such as `ENG-B630-15S-LPT-06-K` from which the full configuration can be rebuilt,
2. the **configuration data** as JSON, format `energeks.stacja/0.1`: input parameters, calculated values, equipment, standards and documents.

The same code works in a web address (`https://energeks.shop/stacje-transformatorowe/kreator-stacji.html#CODE`), in an offer, in an enquiry, in documents and in the API. The JSON data is embedded in the PDF datasheet (attachment `dane_<code>.json`) and can be downloaded from the configurator. Selection rules (done by the engine) and prices are out of scope.

## 2. Terms

| Term | Meaning |
|---|---|
| line | substation type: `B` customer substation in a concrete enclosure, `E` substation for e-mobility (concrete enclosure), `F` pole-mounted substation |
| engine | program that computes the configuration and code from input parameters (reference: `konfigurator.js`; its version is printed on every document) |
| canonical code | the code the engine returns for a configuration; exactly one per configuration |
| DSO | distribution system operator; a substation handed over to a DSO carries the operator suffix |
| spare way | LV fuse switch-disconnector connected to the busbars without fuse links, for future extension |

## 3. Substation code

### 3.1 Structure

```
ENG-{line}{2x}{power}{Z}-{kV}{insulation}{20}-{MV panels}-{outgoing}[+{spare}][-{options}][-{DSO}]
```

| Segment | Values | Meaning |
|---|---|---|
| `ENG` | fixed | format prefix |
| line | `B`, `E`, `F` | substation type |
| `2x` | optional | two transformers (line B: 400 to 1000 kVA, line E: 630 to 1000 kVA) |
| power | number | rated power of one transformer in kVA (B: 100 to 1600, E: 630 to 2500, F: 63 to 400) |
| `Z` | optional | dry-type (cast resin) transformer; otherwise oil-immersed |
| kV | `15`, `20` | MV network voltage; equipment rated 24 kV |
| insulation | `S`, `G`, `P` | MV switchgear insulation without F-gases: S solid and air, G gas without fluorinated greenhouse gases, P air; none for pole-mounted |
| `20` | optional | MV short-time current 20 kA/1 s (where the operator requires it); otherwise 16 kA/1 s |
| MV panels | `L`, `W`, `P`, `T`, `V` or `PB` | MV panels from the left: L line with switch-disconnector, W line with circuit breaker, P metering, T transformer with fuses, V transformer with circuit breaker; `PB` pole-mounted |
| outgoing | 2 digits | number of LV outgoing feeders (per section with two transformers) |
| `+spare` | 2 digits | number of LV spare ways; together with feeders max. 24 (pole-mounted 6) |
| options | fixed order, see 3.2 | equipment and design |
| DSO | `TAURON`, `ENEA`, `ENERGA`, `PGE`, `STOEN`, `OSD` | substation handed over to the operator (built to its standard); `OSD` for another operator |

### 3.2 Options (mandatory order)

| Code | Meaning |
|---|---|
| `K` | internal operation (service corridor); without `K` external operation |
| `S` | 2.96 m wide enclosure with corridor for up to 630 kVA (default 2.55 m) |
| `R` | REI 120 fire resistance |
| `A` | generator connection panel in the LV switchboard |
| `P` | fire-brigade button tripping the transformer panel |
| `M` | network analyser in the LV switchboard |
| `Q` | no-load reactive power compensation (when not required by the DSO standard) |
| `C2` | compact LV transformer terminals (TOC-2) instead of default ones (TOC-1) |
| `C0` | no LV terminals from the substation supplier (terminals by the purchaser) |
| `D` and power | substation prepared for a larger transformer, e.g. `D1000` |
| `N00`, `N1`, `N2`, `N3` | outgoing fuse switch size other than the line default |
| `T1`, `T2`, `T3` | remote control: preparation, fault passage indicators, full remote control |

### 3.3 Regular expression (syntax)

A canonical code matches:

```
^ENG-(?:[BE](?:2x)?\d{3,4}Z?-(?:15|20)[SGP](?:20)?-[LWPTV]+|F\d{2,3}-(?:15|20)-PB)-\d{2}(?:\+\d{2})?(?:-(?=[KSRAPMQCDNT])K?S?R?A?P?M?Q?(?:C[02])?(?:D\d{3,4})?(?:N(?:00|1|2|3))?(?:T[123])?)?(?:-(?:TAURON|ENEA|ENERGA|PGE|STOEN|OSD))?$
```

Checked by automated tests against the full sample of codes from the reference engine (all match). The expression checks syntax only: a syntactically valid code may contradict the selection rules (e.g. `C2` with a target power of 800 kVA or more). The engine decides (3.5).

### 3.4 Web addresses and letter case

- Input is case-insensitive. The canonical code is upper case except `x` in `2x`.
- `+` in a URL may be read as a space, so in addresses spare ways are written with `R`: `ENG-B630-15S-LPT-06R04-K` equals `ENG-B630-15S-LPT-06+04-K`. Readers accept `+`, `R`, a space and `%2B`.

### 3.5 Canonical code and validation

Two steps: (1) syntax (3.3); (2) rules: the reader converts the code to input parameters, the engine computes the configuration and returns a code; the code is valid when the result is identical. Otherwise the reader reports the code as inconsistent and returns the engine's code (the "nearest configuration"). Context that does not change the equipment (e.g. the DSO of a substation that is not handed over) is passed separately (parameter `osd`).

### 3.6 Examples

See the table in the Polish text and `przyklady/kody.json` (20 codes with names, links and decoded input parameters).

## 4. Input parameters

Schema `schemat/energeks.stacja.wejscie-0.1.schema.json`; fields: `linia`, `moc`, `liczbaTrafo`, `kV`, `trafoTyp`, `izolacja`, `polaL`, `poleL`, `pomiar`, `poleT`, `odplywy`, `rezerwaOdp`, `odplywWlk`, `obsluga`, `obudowaSzer`, `rei120`, `agregat`, `ppoz`, `analizator`, `kompJalowy`, `zaciski`, `mocDocelowa`, `telemechanika`, `osd`, `przejecieOSD`. Field names and values are Polish (they are part of the format). A missing field takes the engine default. Allowed values per line and operator: options file (`opcje.json`, API `GET /opcje`).

## 5. Configuration data energeks.stacja/0.1

Schema `schemat/energeks.stacja-0.1.schema.json`. Main fields: `schemat_danych` (always `energeks.stacja/0.1`), `wygenerowano`, `silnik`, `generator`, `producent`, `kod`, `nazwa`, `linia`, `wejscie`, `parametry_wejsciowe` (normalised parameters with `auto` and `blokady`), `dane`, `parametry`, `wyposazenie`, `zalezne_od_mocy`, `liczby`, `obudowa` (null for pole-mounted), `uwagi` (levels `info`, `uwaga`, `blad`), `normy`, `dokumenty`, `braki`, `zastrzezenie`.

Units: power kVA, voltage kV, current A, short-circuit current kA, enclosure dimensions mm, masses t, volumes l. Texts in `dane`, `parametry` and `wyposazenie` are Polish and meant for people; programs should read `parametry_wejsciowe`, `liczby` and `obudowa`.

## 6. Versions and backward compatibility

- Every document and data file states the engine version (`silnik`) and the format version (`schemat_danych`).
- **A code once issued stays valid**: within a major format version the same code means the same functional configuration. The engine may change equipment selection (e.g. fuse table) but then changes its version, and documents state which version produced them.
- New options are appended at the end of the order in 3.2. Existing letters are never changed or reused.
- New JSON fields may appear within 0.x without renaming the format; programs must ignore unknown fields. Removing a field or changing its meaning requires a new format version and a `CHANGELOG.md` entry.

## 7. Addresses

- Configurator: `https://energeks.shop/stacje-transformatorowe/kreator-stacji.html#{code}` (spare ways with `R`).
- API (in preparation): `GET /opcje`, `GET /konfiguracja/{code}`, `POST /konfiguracja`, `GET /opz/{code}`; described in `openapi.yaml`.

## 8. Reporting issues

Errors in the specification or schema, or a code that a reader judges differently from the engine: open an issue in the repository or write to info@energeks.com with the code and the expected result.

## 9. Licence

Specification, schemas, examples and tests: CC BY 4.0 (see `LICENSE`). The Energeks name and logo and the configurator engine are not covered by the licence.
