# Zmiany (changelog)

English summary at the end of each entry.

## 0.2.1 (14.10.2026)

- Pole `cena` w danych konfiguracji (opcjonalne, schemat `energeks.stacja-0.2.schema.json`): cena netto w PLN z transportem w Polsce, potwierdzana w ofercie; tryb `cena`, `widelki` albo `zapytanie`. Silnik referencyjny 0.10.1 (reguły doboru bez zmian). Przykłady danych z ceną z cennika Energeks 0.4.1 (przed wydaniem przeliczone z 0.4.0); arkusze E-01 do E-0n w opisie pakietu.
- EN: optional `cena` field in the configuration data (net PLN price including transport within Poland, confirmed in the offer; mode `cena`, `widelki` or `zapytanie`); reference engine 0.10.1 (selection rules unchanged).

## 0.2.0 (14.10.2026)

- Format `energeks.stacja/0.2`, silnik referencyjny 0.10.0. Każdy kod 0.1 pozostaje ważny i oznacza tę samą stację (sprawdzone na 940 455 kodach); schematy 0.1 zostają w repozytorium dla danych 0.1.
- Kod: linia `P` (stacja dla fotowoltaiki), sieć 6 i 10 kV (aparatura 12 kV), prąd zwarciowy SN zapisany liczbą po izolacji (`20` albo `25`; przy 6 i 10 kV do wyboru), moce 2000 i 2500 kVA w linii B, 500 i 630 kVA w linii F, opcje `W` (wyłącznik jako aparat główny nN do 630 kVA), `X` (bez układu pomiarowego w stacji) i `U8` (strona nN 0,8 kV, układ IT). Nowe wyrażenie regularne w `schemat/kod.regex.txt`, poprzednie w `schemat/kod-0.1.regex.txt`.
- Parametry wejściowe: `ikSN`, `unn`, `aparatNN`, wartość `brak` w polu `pomiar`.
- Przykłady: 32 kody (było 20), dane czterech stacji wygenerowane silnikiem 0.10.0. Dane konfiguracji nie podają terminu realizacji stacji.
- EN: format `energeks.stacja/0.2`, reference engine 0.10.0; every 0.1 code stays valid with the same meaning. Code: line `P` (photovoltaics), 6 and 10 kV networks (12 kV equipment), MV short-circuit current as a number after the insulation letter (`20` or `25`), 2000 and 2500 kVA in line B, 500 and 630 kVA in line F, options `W` (LV main circuit breaker up to 630 kVA), `X` (no metering in the substation) and `U8` (LV 0.8 kV, IT system). New input fields `ikSN`, `unn`, `aparatNN`; `pomiar` may be `brak`. 32 example codes; data no longer states a substation lead time.

## 0.1.2 (8.10.2026)

- Silnik referencyjny 0.8.2 (tylko tekst): etykieta izolacji `G` to „gazowa bez fluorowanych gazów cieplarnianych” zamiast wcześniejszego brzmienia z progiem współczynnika ocieplenia. Rozporządzenie (UE) 2024/573, art. 13 ust. 9, dla rozdzielnic SN do 52 kV zakazuje fluorowanych gazów cieplarnianych jako medium izolacyjnego lub łączeniowego bez żadnego progu (próg dotyczy tylko rozdzielnic WN). Opisy w schematach poprawione; kody i reguły bez zmian.
- EN: reference engine 0.8.2 (text only): the `G` insulation label now reads "gas without fluorinated greenhouse gases" (Regulation (EU) 2024/573, Article 13(9)); schema descriptions updated; codes and rules unchanged.

## 0.1.1 (8.10.2026)

- Silnik referencyjny 0.8.1: próg automatycznego doboru pomiaru po stronie nN dla stacji odbiorcy w sieci PGE Dystrybucja to 250 kVA (odpowiednik 200 kW mocy przyłączeniowej z wytycznych WBSE tom 7 PGE, pkt 6.2.2 i 7.3.1), wcześniej 160 kVA. Format kodu i danych bez zmian (`energeks.stacja/0.1`): pomiar jest zapisany w kodzie (pole `P`), więc istniejące kody dają ten sam wynik; zmienia się tylko dobór automatyczny przy 250 kVA bez podanego pomiaru i treść uwag. Przykłady z polem `silnik` 0.8.1.
- EN: reference engine 0.8.1: automatic LV metering threshold for customer substations in the PGE Dystrybucja network is 250 kVA (200 kW connection power per PGE guidelines); format unchanged, existing codes give the same result.

## 0.1 (8.10.2026)

- Pierwsza publiczna wersja: kod stacji (składnia, opcje, zapis w adresie, kod kanoniczny), parametry wejściowe, dane konfiguracji `energeks.stacja/0.1`, schematy JSON (draft 2020-12), wyrażenie regularne kodu, 20 przykładowych kodów i 3 przykłady danych, testy.
- Silnik referencyjny: 0.8.
- EN: first public release: substation code (syntax, options, URL form, canonical code), input parameters, configuration data `energeks.stacja/0.1`, JSON schemas (draft 2020-12), code regular expression, 20 example codes, 3 data examples, tests. Reference engine 0.8.
