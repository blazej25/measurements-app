# List of bugs to repair

## To Do

- [ ] GasAnalyzer check saving problem.
- [ ] Fix home screen loading.
- [ ] Rework adding workers
- [ ] Loading data doesn't work
- [ ] h20 screen not loading.
- [ ] fix the problem below in flows, dust and H2O
        Przepływy
        Przekrój przewodu,Wysokość przewodu,Szerokość przewodu,Średnica przewodu,Ilość osi pomiarowych,Ilość punktów na osi,Numer osi,Punkt na osi,Ciśnienie dynamiczne 1,Ciśnienie dynamiczne 2,Ciśnienie dynamiczne 3,Ciśnienie dynamiczne 4,Ciśnienie statyczne,Temperatura,Kąt
        Okrągły,2,2,0,1,1,0,0,1,2,3,3,,2,"1
        """"
        ""
        "
        H2O-14790
        Numer pomiaru,Godzina przyjazdu,Próba szczelności,Przepływ przez aspirator,Objętość zaaspirowana,Masa początkowa płuczka 1,Masa końcowa płuczka 1,Masa początkowa płuczka 2,Masa końcowa płuczka 2,Masa początkowa płuczka 3,Masa końcowa płuczka 3
        1,2024-06-07T17:28:57.873Z,11,1,1,11,1,,,,"
        """"
        ""
        "
        Pyły
        Numer pomiaru,Dobrana końcówka,Godzina rozpoczęcia,Czas aspiracji,Objętość zaaspirowana,Filtr,Woda
        1,1,2024-06-07T17:26:28.792Z,1,1,1,"1
        """"
        ""
        "

## Bugs fixed


# Tasklist

## Future Features

- [ ] Add proper duration selector to replace number inputs in the UtilitiesScreen

## To Do

- [ ] manually investigate correctness of all screens (gas analyzer check screen)
- [ ] GasAnalyzerCheckSCreen: the equipment should be loaded from the eqipment base (low priority feature) (Extra Feature)
- [ ] Fix json internal storage file loading for the gas screen
- [ ] Add default file name suggestions when exporting measurements.

## In progress

- [ ] Add localization to the gas analyzer check screen

## Done

- [x] utilities time loading.
- [x] Changing tabs shouldn't erase data.
- [x] Add csv support for HomeScreen
- [x] Add csv support for GasAnalyzerCheckScreen
- [X] UtilitiesScreen
- [X] HomeScreen (input capabilties - no file load/store)
- [X] H20Screen (input capabilties - no file load/store)
- [X] FlowsScreen (input capabilties - no file load/store)
- [X] DustScreen (input capabilties - no file load/store)
- [X] AspirationScreen (input capabilties - no file load/store)
- [X] Add bottom bar scrolling / nice setup for handling multiple screens (Blazej fixed by adding the pomocnicze button)
- [X] File output functionality
- [X] Load state from file functionality
- [X] Add proper translation to the h2o screen
- [X] investigate permissions required (outcome: we can edit files provided that we were the ones who created the file)
- [X] add csv generation capabilities and load from csv
- [x] fix utilities screen
- [x] Add localization to StartEndBar
- [x] Investigate number inputs being weird with 0s
- [x] Requirements analysis for the GasAnalyzerCheckScreen
  - need to input loads of data column-wise per compound
- [x] Add internal storage save for HomeScreen
- [x] Add csv support for utilities
- [x] Add csv support for flows
- [x] Add data bars for gas analyzer check calculated values
- [X] Hour selection on AspirationScreen (turned out to be bad translation selection)
- [X] Number of sample on AspirationScreen (bad usage of the updateState magic function with spread operators)
