# This is a list of bugs to repair in our application

## To Do

## Bugs fixed

- [X] Hour selection on AspirationScreen (turned out to be bad translation selection)
- [X] Number of sample on AspirationScreen (bad usage of the updateState magic function with spread operators)

# Tasklist

## To Do

- [ ] Requirements analysis for the GasAnalyzerCheckScreen
  - need to input loads of data column-wise per compound
  - the equipment should be loaded from the eqipment base (low priority feature)
- [ ] Add proper duration selector to replace number inputs in the UtilitiesScreen
- [ ] investigate number inputs being weird with 0s
- [ ] fix utilities screen
- [ ] add csv generation capabilities and load from csv

## Done

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
- [X] investigate permissions required (outcome: we can edit files provided that
      we were the ones who created the file)
