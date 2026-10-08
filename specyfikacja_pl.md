# Kod i dane stacji SN/nN, format energeks.stacja/0.1

Wersja specyfikacji 0.1 (wydanie 0.1.2), 8.10.2026. Silnik referencyjny: kreator stacji Energeks, silnik 0.8.2.

## 1. Cel i zakres

Specyfikacja opisuje dwie rzeczy, które pozwalają jednoznacznie przekazać konfigurację kompaktowej lub słupowej stacji transformatorowej SN/nN (sieć 15 i 20 kV, transformatory 63 do 2500 kVA oraz 2 x 400 do 2 x 1000 kVA) między ludźmi, programami i asystentami AI:

1. **kod stacji**: krótki napis, np. `ENG-B630-15S-LPT-06-K`, z którego da się odtworzyć całą konfigurację,
2. **dane konfiguracji** w formacie JSON `energeks.stacja/0.1`: parametry wejściowe, parametry wyliczone, wyposażenie, normy i dokumenty.

Ten sam kod działa w adresie strony (`https://energeks.shop/stacje-transformatorowe/kreator-stacji.html#KOD`), w ofercie, w zapytaniu, w dokumentach i w API. Dane JSON są osadzane w karcie katalogowej PDF (załącznik `dane_<kod>.json`) i pobierane z kreatora.

Specyfikacja nie opisuje reguł doboru aparatury (to robi silnik) ani cen.

## 2. Pojęcia

| Pojęcie | Znaczenie |
|---|---|
| linia | rodzaj stacji: `B` stacja odbiorcza kontenerowa, `E` stacja dla e-mobilności (kontenerowa), `F` stacja słupowa |
| silnik | program, który z parametrów wejściowych liczy konfigurację i kod (referencyjny: `konfigurator.js`, wersja na każdym dokumencie) |
| kod kanoniczny | kod, który silnik zwraca dla danej konfiguracji; dokładnie jeden dla każdej konfiguracji |
| OSD | operator systemu dystrybucyjnego; stacja przekazywana OSD ma w kodzie dopisek operatora |
| pole rezerwowe | rozłącznik bezpiecznikowy nN przyłączony do szyn, bez wkładek, do rozbudowy sieci |

## 3. Kod stacji

### 3.1 Budowa

```
ENG-{linia}{2x}{moc}{Z}-{kV}{izolacja}{20}-{pola SN}-{odpływy}[+{rezerwa}][-{opcje}][-{OSD}]
```

| Segment | Wartości | Znaczenie |
|---|---|---|
| `ENG` | stały | przedrostek formatu |
| linia | `B`, `E`, `F` | rodzaj stacji |
| `2x` | opcjonalnie | dwa transformatory (linia B: 400 do 1000 kVA, linia E: 630 do 1000 kVA) |
| moc | liczba | moc jednego transformatora w kVA (B: 100 do 1600, E: 630 do 2500, F: 63 do 400) |
| `Z` | opcjonalnie | transformator suchy (żywiczny); bez litery olejowy |
| kV | `15`, `20` | napięcie sieci SN; aparatura 24 kV |
| izolacja | `S`, `G`, `P` | izolacja rozdzielnicy SN bez F-gazów: S stało-powietrzna, G gazowa bez fluorowanych gazów cieplarnianych, P powietrzna; w stacji słupowej brak |
| `20` | opcjonalnie | prąd zwarciowy SN 20 kA/1 s (sieć, w której wymaga tego operator); bez dopisku 16 kA/1 s |
| pola SN | `L`, `W`, `P`, `T`, `V` albo `PB` | pola rozdzielnicy SN od lewej: L liniowe z rozłącznikiem, W liniowe z wyłącznikiem, P pomiarowe, T transformatorowe z bezpiecznikami, V transformatorowe z wyłącznikiem; `PB` stacja słupowa |
| odpływy | 2 cyfry | liczba odpływów nN (na sekcję przy dwóch transformatorach) |
| `+rezerwa` | 2 cyfry | liczba pól rezerwowych nN; razem z odpływami maks. 24 (stacja słupowa 6) |
| opcje | w ustalonej kolejności, patrz 3.2 | wyposażenie i wykonanie |
| OSD | `TAURON`, `ENEA`, `ENERGA`, `PGE`, `STOEN`, `OSD` | stacja przekazywana operatorowi (wykonanie według jego standardu); `OSD` gdy operator nie jest jednym z wymienionych |

### 3.2 Opcje (kolejność obowiązkowa)

| Znak | Znaczenie |
|---|---|
| `K` | obsługa wewnętrzna (korytarz obsługi); bez `K` obsługa zewnętrzna |
| `S` | obudowa z korytarzem o szerokości 2,96 m przy mocy do 630 kVA (domyślnie 2,55 m) |
| `R` | wykonanie o klasie odporności ogniowej REI 120 |
| `A` | pole do przyłączenia agregatu w rozdzielnicy nN |
| `P` | przycisk przeciwpożarowy wyzwalający łącznik pola transformatorowego |
| `M` | analizator parametrów sieci w rozdzielnicy nN |
| `Q` | kompensacja mocy biernej biegu jałowego (gdy nie wynika ze standardu operatora) |
| `C2` | zaciski nN transformatora w wykonaniu kompaktowym (TOC-2) zamiast domyślnych (TOC-1) |
| `C0` | bez zacisków nN dostawcy stacji (zaciski według zamawiającego) |
| `D` i moc | stacja przygotowana na transformator o większej mocy, np. `D1000` |
| `N00`, `N1`, `N2`, `N3` | wielkość rozłączników odpływów inna niż domyślna dla linii |
| `T1`, `T2`, `T3` | telemechanika: przygotowanie, wskaźniki zwarć, zdalne sterowanie |

### 3.3 Wyrażenie regularne (składnia)

Kod kanoniczny spełnia wyrażenie:

```
^ENG-(?:[BE](?:2x)?\d{3,4}Z?-(?:15|20)[SGP](?:20)?-[LWPTV]+|F\d{2,3}-(?:15|20)-PB)-\d{2}(?:\+\d{2})?(?:-(?=[KSRAPMQCDNT])K?S?R?A?P?M?Q?(?:C[02])?(?:D\d{3,4})?(?:N(?:00|1|2|3))?(?:T[123])?)?(?:-(?:TAURON|ENEA|ENERGA|PGE|STOEN|OSD))?$
```

Sprawdzone testami automatycznymi na pełnej próbce kodów z silnika referencyjnego (wszystkie zgodne); kody spoza wyrażenia nie są kodami kanonicznymi. Wyrażenie sprawdza tylko składnię: kod poprawny składniowo może być sprzeczny z regułami doboru (np. opcja `C2` przy mocy docelowej od 800 kVA). O poprawności rozstrzyga silnik (punkt 3.5).

### 3.4 Zapis w adresie i wielkość liter

- Na wejściu wielkość liter nie ma znaczenia (`eng-b630-15s-lpt-06-k` = `ENG-B630-15S-LPT-06-K`). Kod kanoniczny ma wielkie litery, z wyjątkiem `x` w `2x`.
- Znak `+` w adresie URL bywa czytany jako spacja, dlatego w adresie pola rezerwowe zapisuje się literą `R`: `ENG-B630-15S-LPT-06R04-K` = `ENG-B630-15S-LPT-06+04-K`. Czytniki kodu przyjmują `+`, `R`, spację i `%2B`.

### 3.5 Kod kanoniczny i walidacja

Walidacja ma dwa kroki:

1. składnia (wyrażenie z punktu 3.3),
2. reguły: czytnik zamienia kod na parametry wejściowe, silnik liczy konfigurację i zwraca kod; kod jest poprawny, gdy wynik jest identyczny z kodem wejściowym. Gdy nie jest, czytnik zgłasza kod jako niespójny i podaje kod, który daje silnik (np. „wczytano najbliższą konfigurację”).

Kod nie zawiera kontekstu, który nie zmienia wyposażenia (np. operator przy stacji nieprzekazywanej). Taki kontekst przekazuje się osobno (parametr `osd`).

### 3.6 Przykłady

| Kod | Opis |
|---|---|
| `ENG-B630-15S-LPT-06-K` | 630 kVA 15/0,4 kV, pole liniowe, pomiarowe i transformatorowe, 6 odpływów, korytarz obsługi |
| `ENG-B630-15S-LPT-06` | jak wyżej, obsługa zewnętrzna |
| `ENG-B630-15S-LPT-06+04-K` | 6 odpływów i 4 pola rezerwowe |
| `ENG-B630-15S-LPT-06-KPMD1000` | przycisk ppoż., analizator, przygotowanie na 1000 kVA |
| `ENG-B2x630-15S-LPTT-06-KPM` | dwa transformatory 630 kVA, dwie sekcje nN |
| `ENG-B400-15S-LLT-06+04-KA-TAURON` | stacja przekazywana operatorowi TAURON, pole agregatu |
| `ENG-B630Z-20G-LPT-06-KRPM` | transformator suchy, sieć 20 kV, izolacja gazowa, REI 120 |
| `ENG-E1000-15S-LPV-10-KT1` | e-mobilność 1000 kVA, wyłącznik w polu transformatorowym, przygotowanie pod telemechanikę |
| `ENG-F160-15-PB-04` | stacja słupowa 160 kVA, 4 odpływy |

Więcej w `przyklady/kody.json`.

## 4. Parametry wejściowe

Parametry wejściowe (obiekt `wejscie` w danych, ciało zapytania `POST /konfiguracja` w API) opisuje schemat `schemat/energeks.stacja.wejscie-0.1.schema.json`. Pole bez podania przyjmuje wartość domyślną silnika.

| Pole | Typ | Wartości | Kod |
|---|---|---|---|
| `linia` | tekst | `B`, `E`, `F` | linia |
| `moc` | liczba (kVA) | moce linii | moc |
| `liczbaTrafo` | liczba | 1, 2 | `2x` |
| `kV` | liczba | 15, 20 | kV |
| `trafoTyp` | tekst | `olejowy`, `suchy` | `Z` |
| `izolacja` | tekst | `s`, `g`, `p` | S, G, P |
| `polaL` | liczba | 1 do 3 | liczba L lub W |
| `poleL` | tekst | `L`, `W` | L albo W |
| `pomiar` | tekst | `SN`, `nN` | P w polach SN |
| `poleT` | tekst | `R`, `W` | T albo V |
| `odplywy` | liczba | odpływy linii | odpływy |
| `rezerwaOdp` | liczba | od 0 | `+rezerwa` |
| `odplywWlk` | tekst | `NH00`, `NH1`, `NH2`, `NH3` | `N..` |
| `obsluga` | tekst | `wewnetrzna`, `zewnetrzna` | `K` |
| `obudowaSzer` | liczba (mm) | 2550, 2960 | `S` |
| `rei120`, `agregat`, `ppoz`, `analizator`, `kompJalowy` | logiczne | | `R`, `A`, `P`, `M`, `Q` |
| `zaciski` | tekst | `TOC-1`, `TOC-2`, `brak` | `C2`, `C0` |
| `mocDocelowa` | liczba (kVA) | moc linii większa od `moc` | `D..` |
| `telemechanika` | tekst | `brak`, `przygotowanie`, `FPI`, `sterowanie` | `T1` do `T3` |
| `osd` | tekst | `brak`, `PGE`, `Tauron`, `Enea`, `Energa`, `Stoen` | (z `przejecieOSD`) |
| `przejecieOSD` | logiczne | stacja przekazywana operatorowi | OSD na końcu kodu |

Pełna lista wartości dla każdej linii i operatora: plik opcji (`opcje.json`, w API `GET /opcje`).

## 5. Dane konfiguracji energeks.stacja/0.1

Obiekt JSON opisany schematem `schemat/energeks.stacja-0.1.schema.json`. Najważniejsze pola:

| Pole | Typ | Znaczenie |
|---|---|---|
| `schemat_danych` | tekst | zawsze `energeks.stacja/0.1` |
| `wygenerowano` | data `RRRR-MM-DD` | data utworzenia danych |
| `silnik`, `generator` | tekst | wersje silnika i generatora dokumentów |
| `producent` | obiekt | dane producenta stacji |
| `kod`, `nazwa`, `linia` | tekst | kod kanoniczny, nazwa stacji, nazwa linii |
| `wejscie` | obiekt | parametry wejściowe (punkt 4) |
| `parametry_wejsciowe` | obiekt | parametry po normalizacji przez silnik (wartości domyślne, blokady reguł w `blokady`, pola wybrane automatycznie w `auto`) |
| `dane` | lista `{parametr, wartosc}` | najważniejsze dane techniczne (tekst) |
| `parametry` | lista grup `{grupa, wiersze}` | parametry jak w karcie katalogowej |
| `wyposazenie` | lista sekcji `{sekcja, pozycje}` | lista materiałowa; `dobierane_do_mocy` przy pozycjach zależnych od mocy |
| `zalezne_od_mocy` | lista `{parametr, wartosc}` | skrót pozycji zależnych od mocy |
| `liczby` | obiekt | wartości liczbowe obliczeń (prądy w A, prądy zwarciowe w kA, przekroje w mm2, misa w l) |
| `obudowa` | obiekt albo null | obudowa: typ, wymiary w mm, rozmieszczenie aparatury, masy w t; null w stacji słupowej |
| `uwagi` | lista `{poziom, tekst}` | uwagi silnika; `poziom`: `info`, `uwaga`, `blad` |
| `normy` | lista `{norma, zakres}` | normy i przepisy wynikające z konfiguracji |
| `dokumenty` | obiekt | pliki w pakiecie i dokumenty producentów |
| `braki` | lista tekstów | czego brakuje do kompletu dokumentów |
| `zastrzezenie` | tekst | zastrzeżenie o charakterze poglądowym |

Jednostki: moce w kVA, napięcia w kV, prądy w A, prądy zwarciowe w kA, wymiary obudowy w mm, masy w t, objętości w l. Teksty w `dane`, `parametry` i `wyposazenie` są po polsku i służą ludziom; programy powinny czytać `parametry_wejsciowe`, `liczby` i `obudowa`.

## 6. Wersje i zgodność wstecz

- Każdy dokument i każdy plik danych podaje wersję silnika (`silnik`) i wersję formatu (`schemat_danych`).
- **Kod raz wydany pozostaje ważny**: w obrębie głównej wersji formatu (0.x, potem 1.x) ten sam kod oznacza tę samą konfigurację funkcjonalną. Silnik może zmienić dobór aparatów (np. tabelę wkładek), ale wtedy zmienia swoją wersję, a dokumenty podają, z której wersji pochodzą.
- Nowe opcje dopisuje się na końcu kolejności z punktu 3.2. Istniejących znaków nie zmienia się i nie używa ponownie w innym znaczeniu.
- Nowe pola danych JSON mogą dojść w wersji 0.x bez zmiany nazwy formatu; programy muszą ignorować pola, których nie znają. Usunięcie lub zmiana znaczenia pola wymaga nowej wersji formatu (`energeks.stacja/0.2` albo `/1.0`) i wpisu w `CHANGELOG.md`.
- Kod niespójny w nowej wersji silnika (reguła się zmieniła) czytnik wczytuje jako najbliższą konfigurację i mówi o tym wprost.

## 7. Adresy

- Kreator z konfiguracją: `https://energeks.shop/stacje-transformatorowe/kreator-stacji.html#{kod}` (pola rezerwowe literą `R`).
- API (w przygotowaniu): `GET /opcje`, `GET /konfiguracja/{kod}`, `POST /konfiguracja`, `GET /opz/{kod}`; opis w `openapi.yaml`.

## 8. Zgłaszanie błędów i propozycji

Błąd w specyfikacji, w schemacie albo kod, który czytnik ocenia inaczej niż silnik: zgłoszenie w repozytorium (Issues) albo e-mailem na info@energeks.com, z kodem stacji i opisem oczekiwanego wyniku. Propozycje nowych opcji z uzasadnieniem (np. wymaganie operatora albo zamawiającego).

## 9. Licencja

Specyfikacja, schematy, przykłady i testy: CC BY 4.0 (plik `LICENSE`). Nazwa i logo Energeks oraz silnik konfiguratora nie są objęte licencją.
