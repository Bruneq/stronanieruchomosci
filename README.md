# Pracownia Pięknej Przestrzeni — lokalna strona demo

To statyczna strona HTML/CSS/JS gotowa do uruchomienia lokalnie.

## Jak uruchomić

### Opcja 1 — najprościej
Otwórz plik `index.html` w przeglądarce.

### Opcja 2 — localhost
W folderze projektu uruchom:

```bash
python3 -m http.server 8000
```

Następnie wejdź w przeglądarce na:

```text
http://localhost:8000
```

## Struktura

- `index.html` — treść strony
- `styles.css` — wygląd i wersja responsywna
- `script.js` — menu mobilne, aktywna nawigacja i animacje
- `assets/` — zdjęcia i favicon

Formularz kontaktowy jest demonstracyjny i otwiera program pocztowy przez `mailto:`. Do prawdziwej strony trzeba podłączyć backend albo usługę formularzy.
