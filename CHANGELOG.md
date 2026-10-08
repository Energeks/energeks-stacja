# Zmiany (changelog)

English summary at the end of each entry.

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
