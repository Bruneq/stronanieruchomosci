# Pracownia Pięknej Przestrzeni

Responsywna, wielostronicowa strona internetowa pracowni projektowania wnętrz Magdaleny Miszczyszyn.

**Wersja produkcyjna:** https://ppp-miszczyszyn.pl

![Podgląd strony Pracowni Pięknej Przestrzeni](https://ppp-miszczyszyn.pl/assets/og-cover.jpg)

## O projekcie

Strona prezentuje ofertę, proces współpracy, portfolio realizacji oraz dane kontaktowe Pracowni Pięknej Przestrzeni. Projekt został przygotowany jako lekka strona statyczna, bez frameworków i bez procesu budowania.

Najważniejsze założenia:

- szybkie ładowanie i dobra wydajność na telefonach oraz komputerach,
- spokojna, elegancka identyfikacja wizualna,
- czytelna prezentacja usług i realizacji,
- pełna responsywność,
- dostępność i poprawna semantyka HTML,
- przygotowanie pod SEO lokalne dla Szczecina i współpracy online.

## Funkcje

- responsywna nawigacja z mobilnym menu,
- ukrywanie i pokazywanie nagłówka podczas przewijania,
- subtelne animacje wejścia elementów,
- przycisk „Wróć na górę” omijający stopkę,
- galeria realizacji z podglądem zdjęć,
- obsługa gestów przesuwania zdjęć na urządzeniach dotykowych,
- formularz kontaktowy obsługiwany przez Formspree,
- FAQ,
- polityka prywatności,
- Open Graph i Twitter Cards,
- dane strukturalne JSON-LD,
- `sitemap.xml` i `robots.txt`,
- własna domena i HTTPS,
- automatyczne wdrażanie przez GitHub Actions.

## Technologie

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- GitHub Actions
- Formspree

Projekt nie wymaga Node.js, bundlera ani frameworka do działania.

## Podstrony

| Plik                        | Zawartość                                 |
| --------------------------- | ----------------------------------------- |
| `index.html`                | Strona główna                             |
| `o-mnie.html`               | Informacje o projektantce i pracowni      |
| `oferta.html`               | Usługi i zakresy współpracy               |
| `realizacje.html`           | Portfolio i galeria projektów             |
| `proces.html`               | Etapy współpracy                          |
| `kontakt.html`              | Dane kontaktowe i formularz               |
| `faq.html`                  | Najczęściej zadawane pytania              |
| `polityka-prywatnosci.html` | Informacje dotyczące przetwarzania danych |

## Struktura repozytorium

```text
.
├── .github/
│   └── workflows/
│       └── static.yml
├── assets/
│   ├── realizacje/
│   ├── favicon.svg
│   └── og-cover.jpg
├── index.html
├── o-mnie.html
├── oferta.html
├── realizacje.html
├── proces.html
├── kontakt.html
├── faq.html
├── polityka-prywatnosci.html
├── styles.css
├── script.js
├── robots.txt
├── sitemap.xml
├── CNAME
└── README.md
```

Pliki HTML pozostają w katalogu głównym celowo. Dzięki temu adresy podstron są krótkie i nie trzeba zmieniać istniejących linków, adresów kanonicznych ani mapy witryny.

## Uruchomienie lokalne

W katalogu projektu uruchom prosty serwer:

```bash
python3 -m http.server 8000
```

Następnie otwórz:

```text
http://localhost:8000
```

Zatrzymanie serwera:

```text
Ctrl + C
```

## Formatowanie kodu

Repozytorium zawiera konfigurację Prettier. Aby sformatować pliki:

```bash
npx --yes prettier@3.9.5 --write "*.html" "styles.css" "script.js" ".github/workflows/*.yml" "*.json" "*.md"
```

Kontrola bez zapisywania zmian:

```bash
npx --yes prettier@3.9.5 --check "*.html" "styles.css" "script.js" ".github/workflows/*.yml" "*.json" "*.md"
```

Po formatowaniu zawsze sprawdź stronę lokalnie oraz przejrzyj zmiany:

```bash
git diff
```

## Publikacja

Zmiany wysłane do gałęzi `main` uruchamiają workflow GitHub Actions i publikują stronę w GitHub Pages.

```bash
git add .
git commit -m "Opis zmian"
git push origin main
```

Status wdrożenia można sprawdzić w zakładce **Actions** repozytorium.

## Formularz kontaktowy

Formularz na stronie `kontakt.html` korzysta z Formspree. Przy zmianie formularza należy zachować:

- poprawny adres endpointu,
- wymagane pola,
- zabezpieczenie typu honeypot,
- informację o polityce prywatności.

## SEO i utrzymanie

Przy dodawaniu lub usuwaniu podstron należy zaktualizować:

1. nawigację i stopkę,
2. `sitemap.xml`,
3. adres kanoniczny strony,
4. metadane Open Graph,
5. wewnętrzne odnośniki,
6. politykę prywatności, jeśli zmieniają się używane usługi.

Po zmianie `styles.css` lub `script.js` warto zaktualizować parametr wersji w plikach HTML, aby przeglądarki pobrały nową wersję plików.

## Najważniejsze adresy

- Strona: https://ppp-miszczyszyn.pl
- Instagram: https://www.instagram.com/ppp.magda.miszczyszyn/
- E-mail: pracownia.miszczyszyn@gmail.com
- Telefon: +48 509 850 497

## Status

Strona jest wdrożona produkcyjnie i aktywnie utrzymywana.

## Prawa do materiałów

Zdjęcia, wizualizacje, teksty oraz identyfikacja wizualna należą do Pracowni Pięknej Przestrzeni. Repozytorium nie zawiera licencji open-source zezwalającej na ich swobodne ponowne wykorzystanie.
