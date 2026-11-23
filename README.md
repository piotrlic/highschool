# Łódzkie licea i technika — porównywarka klas

Repozytorium przeznaczone do publikacji istniejącej porównywarki jako statycznej strony GitHub Pages.

## Stan przenoszenia

Strona z pliku `licea-lodz-2027.html` znajduje się jako `index.html` na gałęzi `main`. Dodano mapę lokalizacji szkół, adresy przy klasach, linki dojazdu oraz historyczne progi punktowe. Katalog zawiera 89 szkół (59 liceów, w tym 4 plastyczne, oraz 30 techników). Obejmuje publiczne i niepubliczne szkoły dla młodzieży, w tym specjalne. Dla 23 szkół opisano 122 klasy, grupy i warianty kierunków; 66 pozostałych ma samodzielne karty bez przypisywania niezweryfikowanych profili. Dotychczasowe klasy licealne i klucze ulubionych zostały zachowane. Układ i style znajdują się w `index.html`, skrypt w `app.js`, a jedynym źródłem danych jest `data/schools.json`. Nie jest wymagany etap budowania. Mapa korzysta z Leaflet 1.9.4 (biblioteka i CSS z unpkg.com) oraz kafelków OpenStreetMap, więc jej wyświetlenie wymaga internetu. Gdy mapa się nie wczyta, pozostają dostępne adresy i linki dojazdu po wybraniu szkoły.

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

Uruchom w katalogu repozytorium `python3 -m http.server 8000` i otwórz http://localhost:8000. Plik JSON jest pobierany przez HTTP; samo otwarcie `index.html` jako lokalnego pliku nie wystarczy. Nie jest potrzebna instalacja pakietów ani etap budowania. Pełną weryfikację zapisywania ulubionych i kopiowania listy wykonaj także pod docelowym adresem HTTPS.

## Mapa szkół

Mapa pokazuje szkoły pasujące do bieżących filtrów, również szkoły bez opisanych klas. Filtry przedmiotów, języków, profili, zawodów i zapisanych klas ograniczają wyniki do szkół z pasującymi opisanymi klasami. Wyczyść je, aby wrócić do pełnego katalogu. Kliknij znacznik, nazwę szkoły pod mapą lub „Pokaż na mapie” przy klasie. Wybrana szkoła zostaje przybliżona, a pod mapą pojawiają się adres, link dojazdu w Google Maps i kontakt szkoły. Przycisk „Pokaż widoczne szkoły” przywraca wspólny widok. Dojazd otwiera się w nowej karcie; strona nie pobiera lokalizacji użytkownika.

Adresy sprawdzono 23 listopada 2026 r. w źródłach szkół:

- [XI LO — kontakt](https://11liceumlodz.wikom.pl/strona/kontakt): Kopcińskiego 54.
- [XXIII LO — kontakt](https://lo23lodz.pl/strona/kontakt-kontakt): Piłsudskiego 159.
- [XXIV LO — kontakt](https://24lo.pl/strona/kontakt-kontakt): Marysińska 61/67.
- [XXVI LO — kontakt](https://www.lo26.pl/contact/): Wileńska 22a.
- [XXXIII LO — kontakt](https://33lo.pl/strona/kontakt): Kusocińskiego 116.

Współrzędne budynków/adresów pozyskano jednorazowo przez Nominatim. Dane mapowe: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Aplikacja nie odpytuje usługi geokodowania podczas korzystania z mapy.

## Technika i historyczne progi punktowe

Dodano typ szkoły (liceum/technikum), filtr zawodu i 96 wariantów kierunków z 18 miejskich techników: nr 1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 15, 17, 18, 19, 20, 21 i 22. W oddziałach łączonych zawody są osobnymi wariantami, a nie dodatkowymi klasami. Oferta klas pozostaje częściowa. Sam katalog szkół rozszerzono o wszystkie licea ogólnokształcące, licea sztuk plastycznych i technika dla młodzieży z łódzkiej części informatora Kuratorium 2026/2027, w tym szkoły niepubliczne i specjalne, oraz XLIV LO z miejskiego wykazu. Nie obejmuje szkół dla dorosłych, branżowych, policealnych ani innych typów szkół artystycznych. Nie jest bieżącym odpisem RSPO.

Źródłem danych techników jest [Informator Kuratorium Oświaty w Łodzi 2026/2027 — kopia PDF udostępniona przez szkołę](https://sp1aleksandrowlodzki.pl/files/94/informator-2026.pdf), strony 44–62. [Strona Kuratorium z informatorem](https://www.kuratorium.lodz.pl/szkoly-i-organy-prowadzace/rekrutacja-do-szkol/) prowadzi również do oryginalnego dokumentu. Każda karta technikum wskazuje konkretną stronę informatora. Przy rozszerzeniach do wyboru, oddziałach łączonych i kilku adresach szkoły zachowano odpowiednie oznaczenia. Mapa wskazuje siedzibę szkoły, a nie wszystkie miejsca zajęć.

Progi historyczne pobrano 23.11.2026 z tabel klas dla naboru 2026/2027 w [WaszaEdukacja — licea](https://waszaedukacja.pl/rekrutacja/lodz/licea) oraz [WaszaEdukacja — technika](https://waszaedukacja.pl/rekrutacja/lodz/technika). Są to minimalne wyniki przyjętych kandydatów opublikowane przez portal, zaokrąglone do 0,1 pkt; nie średnie szkoły, rekomendowane wyniki ani prognozy na 2027/2028. Każdy wynik ma bezpośredni link do źródłowego oddziału.

Dopasowanie obejmuje 93 ze 122 pozycji (25 licealnych i 68 wariantów techników). Pozostałe 29 pozycji pokazuje „brak potwierdzonych danych”. W technikach wymagane są zgodność zawodu i symbolu oddziału, po normalizacji zapisu I/1, odstępów i wielkości liter. Zachowano źródłowe oznaczenia grup zbiorczych (np. 1C/D/E); nie zastępowano brakującego progu wynikiem całej szkoły. Dla Technikum nr 15 uwzględniono źródłowy przyrostek T przy zgodnym zawodzie. Inne zmienione lub niejednoznaczne symbole pozostają bez dopasowania.

Dla licealnych klas obejmujących kilka grup podano osobne wartości z ich oznaczeniami. W XI LO klasy dwujęzyczne mają skalę 300 pkt; nie należy porównywać ich liczbowo z oddziałami o skali 200 pkt. Progi nie gwarantują przyjęcia w kolejnym roku. Kopiowana lista ulubionych zawiera również dostępne progi i ich źródła.

Przy kolejnej aktualizacji sprawdź jednocześnie rocznik oferty i rocznik progów, a następnie symbole oddziałów, zawody i warianty grup. Nie przypisuj automatycznie wyniku klasy o zmienionym profilu.

## Codzienny monitoring informacji o szkołach

`data/schools.json` zawiera `schemaVersion`, `schools`, `classes`, `thresholds` oraz `monitoring`. `schools[id].monitorUrl` określa oficjalną stronę monitorowaną dla danej szkoły. Wszystkie szkoły z tym adresem są sprawdzane, niezależnie od obecności klas oraz lokalnego wyboru obserwowanych. Brak ustalonej witryny (`null`) daje status `not_configured` i nie przerywa sprawdzania pozostałych szkół; obecnie dotyczy LO Nowoczesna Edukacja. Nie traktujemy samego wpisu w katalogu jako działającego monitoringu. Stabilne identyfikatory szkół i klas zachowują ulubione. `monitoring.sources` przechowuje ostatni poprawny odczyt, jego skrót, datę sprawdzenia i ewentualny błąd. `monitoring.updates` zawiera maksymalnie 100 wykrytych zmian do sprawdzenia. Strona pokazuje datę i zakres ostatniego odczytu oraz zmiany pasujące do filtrów.

Workflow `.github/workflows/daily-school-check.yml` działa raz dziennie o 06:17 UTC (07:17 zimą i 08:17 latem w Polsce). GitHub może opóźnić wykonanie; w publicznych repozytoriach może też wyłączyć harmonogram po 60 dniach braku aktywności. Można uruchomić go ręcznie: Actions → Daily school information check → Run workflow. Pierwsze wdrożenie oraz zmiana skryptu/workflow/testów uruchamiają sprawdzenie także przez `push`.

Skrypt `scripts/check_schools.py` korzysta tylko z biblioteki standardowej Pythona. Odczytuje jedną skonfigurowaną stronę HTML dla każdej szkoły. Porównuje tekst oraz odnośniki związane z rekrutacją, ofertą, profilami, kierunkami, klasami, dniami otwartymi i rokiem 2027/2028. Pomija skrypty, nawigację, nagłówki i stopki. Nie pobiera treści załączników PDF/DOCX ani całych witryn; ich nowe/zmienione odnośniki mogą wywołać wpis do weryfikacji. Zmiany mogą obejmować również stare roczniki. Nie jest to pełne wyszukiwanie wszystkich wiadomości o szkołach.

Pierwszy poprawny odczyt tworzy bazę porównania. Późniejsze zmiany dostają status `needs_review`. Błąd HTTP, certyfikatu lub blokada nie usuwa ostatniej poprawnej treści ani profili/progów. Całkowita niedostępność źródeł kończy job błędem po zapisaniu diagnostyki. Częściowe błędy są widoczne w JSON-ie, na stronie i w logu Actions. HTML nigdy nie jest wykonywany. Wykryty tekst nie staje się automatycznie potwierdzoną ofertą: skrypt aktualizuje wyłącznie `monitoring`, a zweryfikowane klasy i progi zmienia się po sprawdzeniu źródła.

Workflow zapisuje zmiany JSON-a na `main` przez `GITHUB_TOKEN` z uprawnieniem `contents: write`, a następnie żąda ponownego zbudowania GitHub Pages (`pages: write`, API `/pages/builds`). To konieczne, ponieważ commit bota sam nie wyzwala publikacji Pages. Zachowaj ustawienie Pages: Deploy from a branch → main → / (root). Nie są potrzebne dodatkowe sekrety ani płatne API. Jeżeli polityka repozytorium blokuje zapis bota, sprawdź Settings → Actions → General → Workflow permissions i reguły ochrony `main`; log poda dokładny błąd.

Lokalne sprawdzenie: `python3 -m unittest discover -s tests -v`. Odczyt stron: `python3 scripts/check_schools.py`. Po zweryfikowaniu nowej oferty edytuj odpowiednie rekordy `classes` / `thresholds` w JSON-ie, zachowując identyfikatory, rocznik i źródła.


## Pełny katalog szkół i obserwowanie

Wpisy szkół istnieją niezależnie od tablicy `classes`. Każda szkoła ma adres, typ, status publiczno-prawny (`ownership`), kategorię (`category`), źródło wpisu z numerem strony informatora (`catalogSource`), rocznik i status oferty docelowej (`admissions`) oraz informację, czy opisano ofertę referencyjną (`referenceStatus`). Pola `catalog.scope`, `catalog.basis` i `catalog.sources` dokumentują zakres i podstawę zestawienia. Wykaz sporządzono 23.11.2026; zmiany sieci szkół po sporządzeniu informatora wymagają aktualizacji katalogu.

Podstawa 89 wpisów: 28 miejskich LO (w tym XLIV LO uzupełnione z [wykazu Urzędu Miasta](https://uml.lodz.pl/files/public/user_upload/Wykaz_liceow_ogolnoksztalcacych.pdf)), 4 pozostałe publiczne LO, 21 niepublicznych LO, 4 licea sztuk plastycznych, 2 LO specjalne, 18 miejskich techników, 2 pozostałe publiczne technika, 8 niepublicznych techników i 2 technika specjalne. Informator: s. 13–43, 44–63, 65–67 i 69–76. Szkoły o wspólnej siedzibie pozostają osobnymi wpisami. W przypadku LO SPSK aktualny [kontakt szkoły](https://lodz-lotech.spsk.pl/kontakt/) wskazuje Skwer Kolbego 1; rozbieżność z Nałkowskiej 2 w informatorze jest oznaczona na karcie.

W katalogu można użyć gwiazdki „Obserwuj”, również bez opisanych klas. Wybór jest zapisywany lokalnie na tym urządzeniu (`lodz-schools-followed`) i filtrowany przyciskiem „Obserwowane”. Nie wysyła powiadomień e-mail ani nie ogranicza codziennego monitoringu. Serduszka klas zachowują dotychczasowy osobny zapis. Filtr „Bez opisanych klas” pokazuje 66 szkół bez wpisów w `classes`; brak tych wpisów nie jest stwierdzeniem braku oferty ani naboru. Wszystkie wpisy oznaczono jako niepotwierdzone na 2027/2028; historyczne klasy i progi pozostają z rocznika 2026/2027.

Karty pokazują stan odczytu źródła: sprawdzono, błąd, oczekuje na pierwszy odczyt lub brak ustalonej witryny. Dodając nową szkołę, zachowaj stabilny identyfikator, podaj źródło i `monitorUrl` (albo jawne `null`). Nie twórz fikcyjnej klasy, zawodu ani progu, aby szkoła była widoczna. Współrzędne mogą być `null`; wówczas pozostają adres i dojazd według adresu, bez fałszywego znacznika. Mapa używa geokodowanych adresów, nie wyznacza wejść do budynków.

Kliknięcie znacznika lub nazwy pod mapą ustawia filtr „Szkoła”, otwiera katalog i przewija do szczegółów szkoły. Lista klas pokazuje jej pasujące klasy; szkoła bez opisanych klas nadal ma kartę ze statusem i źródłami. Pozostałe filtry pozostają aktywne. Przycisk przy mapie „Wyczyść wybór szkoły” usuwa tylko ten wybór. „Pokaż na mapie” przy karcie ustawia ten sam filtr i przewija do lokalizacji.
