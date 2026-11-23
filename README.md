# Łódzkie licea i technika — porównywarka klas

Repozytorium przeznaczone do publikacji istniejącej porównywarki jako statycznej strony GitHub Pages.

## Stan przenoszenia

Strona z pliku `licea-lodz-2027.html` znajduje się jako `index.html` na gałęzi `main`. Dodano mapę lokalizacji szkół, adresy przy klasach, linki dojazdu oraz historyczne progi punktowe. Porównywarka zawiera 122 klasy, grupy i warianty kierunków z 5 liceów oraz 18 miejskich techników. Dotychczasowe klasy licealne i klucze ulubionych zostały zachowane. Style aplikacji, skrypt oraz dane znajdują się w jednym pliku; nie jest wymagany etap budowania. Mapa korzysta z Leaflet 1.9.4 (biblioteka i CSS z unpkg.com) oraz kafelków OpenStreetMap, więc jej wyświetlenie wymaga internetu. Gdy mapa się nie wczyta, pozostają dostępne adresy i linki dojazdu po wybraniu szkoły.

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

## Mapa szkół

Mapa nad listą klas pokazuje szkoły pasujące do bieżących filtrów (również widoku zapisanych). Kliknij znacznik, nazwę szkoły pod mapą lub „Pokaż na mapie” przy klasie. Wybrana szkoła zostaje przybliżona, a pod mapą pojawiają się adres, link dojazdu w Google Maps i kontakt szkoły. Przycisk „Pokaż widoczne szkoły” przywraca wspólny widok. Dojazd otwiera się w nowej karcie; strona nie pobiera lokalizacji użytkownika.

Adresy sprawdzono 23 listopada 2026 r. w źródłach szkół:

- [XI LO — kontakt](https://11liceumlodz.wikom.pl/strona/kontakt): Kopcińskiego 54.
- [XXIII LO — kontakt](https://lo23lodz.pl/strona/kontakt-kontakt): Piłsudskiego 159.
- [XXIV LO — kontakt](https://24lo.pl/strona/kontakt-kontakt): Marysińska 61/67.
- [XXVI LO — kontakt](https://www.lo26.pl/contact/): Wileńska 22a.
- [XXXIII LO — kontakt](https://33lo.pl/strona/kontakt): Kusocińskiego 116.

Współrzędne budynków/adresów pozyskano jednorazowo przez Nominatim. Dane mapowe: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Aplikacja nie odpytuje usługi geokodowania podczas korzystania z mapy.

## Technika i historyczne progi punktowe

Dodano typ szkoły (liceum/technikum), filtr zawodu i 96 wariantów kierunków z 18 miejskich techników: nr 1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 15, 17, 18, 19, 20, 21 i 22. W oddziałach łączonych zawody są osobnymi wariantami, a nie dodatkowymi klasami. To nadal katalog wstępny: nie obejmuje wszystkich liceów i techników niepublicznych ani techników prowadzonych przez inne podmioty.

Źródłem danych techników jest [Informator Kuratorium Oświaty w Łodzi 2026/2027 — kopia PDF udostępniona przez szkołę](https://sp1aleksandrowlodzki.pl/files/94/informator-2026.pdf), strony 44–62. [Strona Kuratorium z informatorem](https://www.kuratorium.lodz.pl/szkoly-i-organy-prowadzace/rekrutacja-do-szkol/) prowadzi również do oryginalnego dokumentu. Każda karta technikum wskazuje konkretną stronę informatora. Przy rozszerzeniach do wyboru, oddziałach łączonych i kilku adresach szkoły zachowano odpowiednie oznaczenia. Mapa wskazuje siedzibę szkoły, a nie wszystkie miejsca zajęć.

Progi historyczne pobrano 23.11.2026 z tabel klas dla naboru 2026/2027 w [WaszaEdukacja — licea](https://waszaedukacja.pl/rekrutacja/lodz/licea) oraz [WaszaEdukacja — technika](https://waszaedukacja.pl/rekrutacja/lodz/technika). Są to minimalne wyniki przyjętych kandydatów opublikowane przez portal, zaokrąglone do 0,1 pkt; nie średnie szkoły, rekomendowane wyniki ani prognozy na 2027/2028. Każdy wynik ma bezpośredni link do źródłowego oddziału.

Dopasowanie obejmuje 93 ze 122 pozycji (25 licealnych i 68 wariantów techników). Pozostałe 29 pozycji pokazuje „brak potwierdzonych danych”. W technikach wymagane są zgodność zawodu i symbolu oddziału, po normalizacji zapisu I/1, odstępów i wielkości liter. Zachowano źródłowe oznaczenia grup zbiorczych (np. 1C/D/E); nie zastępowano brakującego progu wynikiem całej szkoły. Dla Technikum nr 15 uwzględniono źródłowy przyrostek T przy zgodnym zawodzie. Inne zmienione lub niejednoznaczne symbole pozostają bez dopasowania.

Dla licealnych klas obejmujących kilka grup podano osobne wartości z ich oznaczeniami. W XI LO klasy dwujęzyczne mają skalę 300 pkt; nie należy porównywać ich liczbowo z oddziałami o skali 200 pkt. Progi nie gwarantują przyjęcia w kolejnym roku. Kopiowana lista ulubionych zawiera również dostępne progi i ich źródła.

Przy kolejnej aktualizacji sprawdź jednocześnie rocznik oferty i rocznik progów, a następnie symbole oddziałów, zawody i warianty grup. Nie przypisuj automatycznie wyniku klasy o zmienionym profilu.
