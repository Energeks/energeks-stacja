# Kod i dane stacji SN/nN, format energeks.stacja/0.3

Wersja specyfikacji 0.3 (wydanie 0.3.0), 14.10.2026. Silnik referencyjny: kreator stacji Energeks, silnik 0.11.0. Kody i dane w wersjach 0.1 i 0.2 pozostają ważne (punkt 6).

## 1. Cel i zakres

Specyfikacja opisuje dwie rzeczy, które pozwalają jednoznacznie przekazać konfigurację kompaktowej lub słupowej stacji transformatorowej SN/nN (sieć 6, 10, 15 i 20 kV, transformatory 63 do 2500 kVA oraz 2 x 400 do 2 x 1000 kVA, strona nN 0,4 kV albo 0,8 kV w stacji dla fotowoltaiki) między ludźmi, programami i asystentami AI:

1. **kod stacji**: krótki napis, np. `ENG-B630-15S-LPT-06-K`, z którego da się odtworzyć całą konfigurację,
2. **dane konfiguracji** w formacie JSON `energeks.stacja/0.3`: parametry wejściowe, parametry wyliczone, wyposażenie, normy i dokumenty.

Ten sam kod działa w adresie strony (`https://energeks.shop/stacje-transformatorowe/kreator-stacji.html#KOD`), w ofercie, w zapytaniu, w dokumentach i w API. Dane JSON są osadzane w karcie katalogowej PDF (załącznik `dane_<kod>.json`) i pobierane z kreatora.

Specyfikacja nie opisuje reguł doboru aparatury (to robi silnik) ani sposobu wyceny; od wydania 0.2.1 dane mogą nieść cenę stacji (pole `cena`, punkt 5).

## 2. Pojęcia

| Pojęcie | Znaczenie |
|---|---|
| linia | rodzaj stacji: `B` stacja odbiorcza kontenerowa, `E` stacja dla e-mobilności (kontenerowa), `F` stacja słupowa, `P` stacja dla fotowoltaiki (kontenerowa) |
| silnik | program, który z parametrów wejściowych liczy konfigurację i kod (referencyjny: `konfigurator.js`, wersja na każdym dokumencie) |
| kod kanoniczny | kod, który silnik zwraca dla danej konfiguracji; dokładnie jeden dla każdej konfiguracji |
| OSD | operator systemu dystrybucyjnego; stacja przekazywana OSD ma w kodzie dopisek operatora |
| pole rezerwowe | rozłącznik bezpiecznikowy nN przyłączony do szyn, bez wkładek, do rozbudowy sieci |

## 3. Kod stacji

### 3.1 Budowa

```
ENG-{linia}{2x}{moc}{Z}-{kV}{izolacja}{Ik}-{pola SN}-{odpływy}[+{rezerwa}][-{opcje}][-{OSD}]
```

| Segment | Wartości | Znaczenie |
|---|---|---|
| `ENG` | stały | przedrostek formatu |
| linia | `B`, `E`, `F`, `P` | rodzaj stacji |
| `2x` | opcjonalnie | dwa transformatory (linia B: 400 do 1000 kVA, linia E: 630 do 1000 kVA) |
| moc | liczba | moc jednego transformatora w kVA, liczba całkowita (od 0.3: B i P 25 do 2500, E 630 do 2500, F 25 do 630; przy `2x` moce z typoszeregu); poza typoszeregiem transformator na zamówienie |
| `Z` | opcjonalnie | transformator suchy (żywiczny); bez litery olejowy |
| kV | `6`, `10`, `15`, `20` | napięcie sieci SN; aparatura 12 kV przy 6 i 10 kV, 24 kV przy 15 i 20 kV |
| izolacja | `S`, `G`, `P` | izolacja rozdzielnicy SN bez F-gazów: S stało-powietrzna, G gazowa bez fluorowanych gazów cieplarnianych, P powietrzna; w stacji słupowej brak |
| Ik | opcjonalnie `20` albo `25` | prąd zwarciowy sieci SN w kA/1 s, gdy inny niż 16 (sieć Stoen 20 kA; przy sieci 6 i 10 kV do wyboru 16, 20 albo 25 kA, domyślnie 20 kA); bez dopisku 16 kA/1 s |
| pola SN | `L`, `W`, `P`, `T`, `V` albo `PB` | pola rozdzielnicy SN od lewej: L liniowe z rozłącznikiem, W liniowe z wyłącznikiem, P pomiarowe, T transformatorowe z bezpiecznikami, V transformatorowe z wyłącznikiem; `PB` stacja słupowa |
| odpływy | 2 cyfry | liczba odpływów nN, od `01` do `24` (stacja słupowa do `06`; na sekcję przy dwóch transformatorach) |
| `+rezerwa` | 2 cyfry | liczba pól rezerwowych nN; razem z odpływami maks. 24 (stacja słupowa 6) |
| opcje | w ustalonej kolejności, patrz 3.2 | wyposażenie i wykonanie |
| OSD | `TAURON`, `ENEA`, `ENERGA`, `PGE`, `STOEN`, `OSD` | stacja przekazywana operatorowi (wykonanie według jego standardu); `OSD` gdy operator nie jest jednym z wymienionych |

### 3.2 Opcje (kolejność obowiązkowa)

| Znak | Znaczenie |
|---|---|
| `I` | stacja wnętrzowa bez obudowy, do montażu w pomieszczeniu zamawiającego; zamiast `K`, `S` i `R`, bez przyrostka OSD (od 0.3); bez `Z` w mocy transformator olejowy |
| `K` | obsługa wewnętrzna (korytarz obsługi); bez `K` obsługa zewnętrzna |
| `S` | obudowa z korytarzem o szerokości 2,96 m przy mocy do 630 kVA (domyślnie 2,55 m) |
| `R` | wykonanie o klasie odporności ogniowej REI 120 |
| `A` | pole do przyłączenia agregatu w rozdzielnicy nN |
| `P` | przycisk przeciwpożarowy wyzwalający łącznik pola transformatorowego |
| `M` | analizator parametrów sieci w rozdzielnicy nN |
| `Q` | kompensacja mocy biernej biegu jałowego (gdy nie wynika ze standardu operatora) |
| `W` | wyłącznik z wyzwalaczem nadprądowym jako aparat główny nN przy mocy do 630 kVA (od 0.2; powyżej 630 kVA wyłącznik jest zawsze, bez litery) |
| `X` | bez układu pomiarowego w stacji: pomiar rozliczeniowy poza stacją, stacja prywatna albo za istniejącym pomiarem (od 0.2) |
| `Y` | UPS 230 V AC w rozdzielnicy potrzeb własnych (od 0.3) |
| `C2` | zaciski nN transformatora w wykonaniu kompaktowym (TOC-2) zamiast domyślnych (TOC-1) |
| `C0` | bez zacisków nN dostawcy stacji (zaciski według zamawiającego) |
| `D` i moc | stacja przygotowana na transformator o większej mocy, np. `D1000` |
| `N00`, `N1`, `N2`, `N3` | wielkość rozłączników odpływów inna niż domyślna dla linii |
| `T1`, `T2`, `T3` | telemechanika: przygotowanie, wskaźniki zwarć, zdalne sterowanie |
| `Z1`, `Z2`, `Z3` | samoczynne załączanie rezerwy: Z1 po stronie nN transformator i agregat (wymaga `A`), Z2 po stronie nN dwie sekcje (wymaga `2x`), Z3 po stronie SN dwie linie (co najmniej dwa pola liniowe); od 0.3 |
| `U5`, `U69`, `U8`, `U10` | strona nN 0,5, 0,69, 0,8 albo 1,0 kV, układ IT z kontrolą stanu izolacji, pomiar SN (`U8` od 0.2 w linii P; od 0.3 wszystkie w liniach B, E i P) |

### 3.3 Wyrażenie regularne (składnia)

Kod kanoniczny spełnia wyrażenie:

```
^ENG-(?:[BEP](?:2x)?\d{2,4}Z?-(?:6|10|15|20)[SGP](?:20|25)?-[LWPTV]+|F\d{2,3}-(?:6|10|15|20)-PB)-\d{2}(?:\+\d{2})?(?:-(?=[IKSRAPMQWXYCDNTZU])I?K?S?R?A?P?M?Q?W?X?Y?(?:C[02])?(?:D\d{3,4})?(?:N(?:00|1|2|3))?(?:T[123])?(?:Z[123])?(?:U(?:5|69|8|10))?)?(?:-(?:TAURON|ENEA|ENERGA|PGE|STOEN|OSD))?$
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
| `ENG-B630-15S-LT-06-KX` | bez układu pomiarowego w stacji |
| `ENG-B2000-15S-LLPV-08-K` | stacja odbiorcza 2000 kVA, dwa pola liniowe |
| `ENG-B630-10S20-LLPT-08-K` | sieć 10 kV, aparatura 12 kV, prąd zwarciowy 20 kA |
| `ENG-B400-15S-LLPT-08-KW` | wyłącznik jako aparat główny nN |
| `ENG-F630-20-PB-04` | stacja słupowa 630 kVA, konstrukcja wzmocniona |
| `ENG-P1000-15S-WPV-06-KT1U8` | stacja dla fotowoltaiki 1000 kVA, nN 0,8 kV |
| `ENG-B315-15S-LPT-06-K` | moc spoza typoszeregu 315 kVA (od 0.3) |
| `ENG-F25-15-PB-02-N00` | stacja słupowa 25 kVA, 2 odpływy (od 0.3) |
| `ENG-B630-15S-LLPT-05-K` | 5 odpływów (od 0.3) |
| `ENG-B630-15S-LPT-06-KAWYZ1` | pole agregatu, wyłącznik nN, UPS, SZR po stronie nN z agregatem (od 0.3) |
| `ENG-B2x630-15S-LLPTT-08-KWZ2` | dwa transformatory, SZR po stronie nN między sekcjami (od 0.3) |
| `ENG-B1000-15S-LLPV-08-KT3Z3` | SZR po stronie SN między dwiema liniami (od 0.3) |
| `ENG-B1000Z-15S-LPV-08-I` | stacja wnętrzowa bez obudowy, transformator żywiczny (od 0.3) |
| `ENG-B1000-15S-LPV-08-KU69` | strona nN 0,69 kV (od 0.3) |

Więcej w `przyklady/kody.json`.

## 4. Parametry wejściowe

Parametry wejściowe (obiekt `wejscie` w danych, ciało zapytania `POST /konfiguracja` w API) opisuje schemat `schemat/energeks.stacja.wejscie-0.3.schema.json`. Pole bez podania przyjmuje wartość domyślną silnika.

| Pole | Typ | Wartości | Kod |
|---|---|---|---|
| `linia` | tekst | `B`, `E`, `F`, `P` | linia |
| `moc` | liczba (kVA) | liczba całkowita w zakresie linii (od 0.3) | moc |
| `liczbaTrafo` | liczba | 1, 2 | `2x` |
| `kV` | liczba | 6, 10, 15, 20 | kV |
| `ikSN` | liczba (kA) | 16, 20, 25 | Ik po izolacji |
| `unn` | liczba (kV) | 0.4, 0.5, 0.69, 0.8, 1 (bez stacji słupowej) | `U5`, `U69`, `U8`, `U10` |
| `aparatNN` | tekst | `R`, `W` | `W` |
| `trafoTyp` | tekst | `olejowy`, `suchy` | `Z` |
| `izolacja` | tekst | `s`, `g`, `p` | S, G, P |
| `polaL` | liczba | 1 do 3 | liczba L lub W |
| `poleL` | tekst | `L`, `W` | L albo W |
| `pomiar` | tekst | `SN`, `nN`, `brak` | P w polach SN; `brak`: `X` |
| `poleT` | tekst | `R`, `W` | T albo V |
| `odplywy` | liczba | 1 do 24 (stacja słupowa do 6) | odpływy |
| `rezerwaOdp` | liczba | od 0 | `+rezerwa` |
| `odplywWlk` | tekst | `NH00`, `NH1`, `NH2`, `NH3` | `N..` |
| `obsluga` | tekst | `wewnetrzna`, `zewnetrzna` | `K` |
| `obudowaSzer` | liczba (mm) | 2550, 2960 | `S` |
| `rei120`, `agregat`, `ppoz`, `analizator`, `kompJalowy` | logiczne | | `R`, `A`, `P`, `M`, `Q` |
| `ups` | logiczne | (od 0.3) | `Y` |
| `szr` | tekst | `brak`, `nN-agregat`, `nN-sprzeglo`, `SN` (od 0.3) | `Z1` do `Z3` |
| `obudowa` | tekst | `brak`: stacja wnętrzowa (od 0.3) | `I` |
| `zaciski` | tekst | `TOC-1`, `TOC-2`, `brak` | `C2`, `C0` |
| `mocDocelowa` | liczba (kVA) | moc linii większa od `moc` | `D..` |
| `telemechanika` | tekst | `brak`, `przygotowanie`, `FPI`, `sterowanie` | `T1` do `T3` |
| `osd` | tekst | `brak`, `PGE`, `Tauron`, `Enea`, `Energa`, `Stoen` | (z `przejecieOSD`) |
| `przejecieOSD` | logiczne | stacja przekazywana operatorowi | OSD na końcu kodu |

Pełna lista wartości dla każdej linii i operatora: plik opcji (`opcje.json`, w API `GET /opcje`).

## 5. Dane konfiguracji energeks.stacja/0.3

Obiekt JSON opisany schematem `schemat/energeks.stacja-0.3.schema.json` (dane wersji 0.2 i 0.1 opisują nadal `schemat/energeks.stacja-0.2.schema.json` i `schemat/energeks.stacja-0.1.schema.json`). Najważniejsze pola:

| Pole | Typ | Znaczenie |
|---|---|---|
| `schemat_danych` | tekst | `energeks.stacja/0.3` (dane starsze: `energeks.stacja/0.2` albo `/0.1`) |
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
| `cena` | obiekt albo null (od 0.2.1, opcjonalne) | cena netto w PLN z transportem w Polsce, potwierdzana w ofercie: `tryb` `cena` (`cena_pln`), `widelki` (`od_pln`, `do_pln`, stacja nietypowa albo pozycje szacowane) albo `zapytanie`; `cennik` i `cennik_data` to wersja cennika, `opis` to zdanie do pokazania |
| `zastrzezenie` | tekst | zastrzeżenie o charakterze poglądowym |

Jednostki: moce w kVA, napięcia w kV, prądy w A, prądy zwarciowe w kA, wymiary obudowy w mm, masy w t, objętości w l. Teksty w `dane`, `parametry` i `wyposazenie` są po polsku i służą ludziom; programy powinny czytać `parametry_wejsciowe`, `liczby` i `obudowa`.

## 6. Wersje i zgodność wstecz

- Każdy dokument i każdy plik danych podaje wersję silnika (`silnik`) i wersję formatu (`schemat_danych`).
- **Kod raz wydany pozostaje ważny**: w obrębie głównej wersji formatu (0.x, potem 1.x) ten sam kod oznacza tę samą konfigurację funkcjonalną. Silnik może zmienić dobór aparatów (np. tabelę wkładek), ale wtedy zmienia swoją wersję, a dokumenty podają, z której wersji pochodzą.
- Nowa opcja dostaje nowy znak i stałe miejsce w kolejności z punktu 3.2; kod wydany wcześniej (bez nowego znaku) pozostaje kanoniczny. Istniejących znaków nie zmienia się i nie używa ponownie w innym znaczeniu. W wersji 0.2 doszły `W` i `X` (po `Q`) oraz `U8` (na końcu).
- Wersja 0.3 rozszerza zakres wartości: moc dowolna od 25 kVA, odpływy 1 do 24, nN 0,5 do 1,0 kV poza linią P, opcje `I` (na początku), `Y` (po `X`), `Z1` do `Z3` (po telemechanice) oraz `U5`, `U69`, `U10`; każdy kod 0.2 jest kodem 0.3 o tym samym zapisie. Silnik 0.11.0 przyjmuje wymiary aparatury z kart katalogowych (pola z wyłącznikiem 750 mm, rozdzielnica nN do 630 kVA co najmniej 1100 mm), więc dla części kodów z polami `W` albo `V` i przy mocy do 630 kVA zmienia się dobrana obudowa albo jej opis; kod i aparatura zostają te same.
- Wersja 0.2 rozszerza zakres wartości (linia `P`, sieć 6 i 10 kV, prąd zwarciowy 25 kA, moce 500 i 2000 do 2500 kVA w kolejnych liniach); każdy kod 0.1 jest kodem 0.2 o tym samym znaczeniu (sprawdzone na 940 455 kodach silnika 0.9.0). Domyślne wartości kreatora dla nowej stacji (np. liczba pól liniowych i odpływów) mogą się zmieniać; kod zawsze zapisuje wartości wprost.
- Nowe pola danych JSON mogą dojść w wersji 0.x bez zmiany nazwy formatu; programy muszą ignorować pola, których nie znają. Usunięcie lub zmiana znaczenia pola wymaga nowej wersji formatu (`energeks.stacja/0.2` albo `/1.0`) i wpisu w `CHANGELOG.md`.
- Kod niespójny w nowej wersji silnika (reguła się zmieniła) czytnik wczytuje jako najbliższą konfigurację i mówi o tym wprost.

## 7. Adresy

- Kreator z konfiguracją: `https://energeks.shop/stacje-transformatorowe/kreator-stacji.html#{kod}` (pola rezerwowe literą `R`).
- API (w przygotowaniu): `GET /opcje`, `GET /konfiguracja/{kod}`, `POST /konfiguracja`, `GET /opz/{kod}`; opis w `openapi.yaml`.

## 8. Zgłaszanie błędów i propozycji

Błąd w specyfikacji, w schemacie albo kod, który czytnik ocenia inaczej niż silnik: zgłoszenie w repozytorium (Issues) albo e-mailem na info@energeks.com, z kodem stacji i opisem oczekiwanego wyniku. Propozycje nowych opcji z uzasadnieniem (np. wymaganie operatora albo zamawiającego).

## 9. Licencja

Specyfikacja, schematy, przykłady i testy: CC BY 4.0 (plik `LICENSE`). Nazwa i logo Energeks oraz silnik konfiguratora nie są objęte licencją.
