# Łódzkie licea — porównywarka klas

Repozytorium przeznaczone do publikacji istniejącej porównywarki jako statycznej strony GitHub Pages.

## Stan przenoszenia

Oryginalny plik `licea-lodz-2027.html` został dodany jako `index.html` na gałęzi `main`, bez zmian w treści strony. Porównywarka zawiera 26 klas i grup z 5 liceów. Style, skrypt oraz dane znajdują się w jednym pliku; nie jest wymagany etap budowania.

## Przygotowanie strony

1. Strona startowa znajduje się w katalogu głównym jako `index.html` na gałęzi `main`. Przy kolejnych aktualizacjach zachowaj tę nazwę.
2. Jeżeli strona odwołuje się do dodatkowych lokalnych plików, dodaj je z zachowaniem ścieżek względnych. Adres witryny zawiera prefiks `/highschool/`.
3. Zachowaj oznaczenia danych: zestawienie 2026/2027 oraz niepotwierdzona oferta 2027/2028. Przeniesienie strony nie stanowi aktualizacji ani ponownej weryfikacji ofert.

## Włączenie GitHub Pages

Po dodaniu `index.html`:

1. Otwórz [Settings → Pages](https://github.com/piotrlic/highschool/settings/pages).
2. W **Build and deployment → Source** wybierz **Deploy from a branch**.
3. Wybierz gałąź **main** oraz folder **/ (root)**.
4. Kliknij **Save**.
5. Poczekaj na zakończenie publikacji. Wynik sprawdzisz w [Actions](https://github.com/piotrlic/highschool/actions) oraz w ustawieniach Pages.

Docelowy adres: [https://piotrlic.github.io/highschool/](https://piotrlic.github.io/highschool/). Sam zapis plików w repozytorium nie potwierdza włączenia Pages ani udanego wdrożenia.

Instrukcja opiera się na [dokumentacji GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Sprawdzenie po publikacji

- Otwórz docelowy adres i potwierdź, że wyświetla porównywarkę, a nie README lub błąd 404.
- Sprawdź wyszukiwanie oraz filtry szkoły, profilu, rozszerzeń i języków.
- Sprawdź zapis i odczyt ulubionych po odświeżeniu oraz kopiowanie listy klas.
- Sprawdź odnośniki do ofert szkół i widok na telefonie.

## Podgląd lokalny

Po dodaniu pliku otwórz `index.html` w przeglądarce. Dla samodzielnej strony HTML nie jest potrzebna instalacja pakietów ani etap budowania. Pełną weryfikację zapisywania ulubionych i kopiowania listy wykonaj także pod docelowym adresem HTTPS.
