# This is a list of bugs to repair in our application

## To Do

## Bugs fixed

- [x] Hour selection on AspirationScreen (turned out to be bad translation selection)
- [x] Number of sample on AspirationScreen (bad usage of the updateState magic function with spread operators)

# Tasklist

## To Do

- [ ] Requirements analysis for the GasAnalyzerCheckScreen
  - need to input loads of data column-wise per compound
  - the equipment should be loaded from the eqipment base (low priority feature)
- [ ] Add proper duration selector to replace number inputs in the UtilitiesScreen
- [ ] investigate number inputs being weird with 0s
- [ ] fix utilities screen
- [ ] adapt csv functionality for other screens

## Done

- [x] UtilitiesScreen
- [x] HomeScreen (input capabilties - no file load/store)
- [x] H20Screen (input capabilties - no file load/store)
- [x] FlowsScreen (input capabilties - no file load/store)
- [x] DustScreen (input capabilties - no file load/store)
- [x] AspirationScreen (input capabilties - no file load/store)
- [x] Add bottom bar scrolling / nice setup for handling multiple screens (Blazej fixed by adding the pomocnicze button)
- [x] File output functionality
- [x] Load state from file functionality
- [x] Add proper translation to the h2o screen
- [x] investigate permissions required (outcome: we can edit files provided that
      we were the ones who created the file)
- [x] add csv generation capabilities and load from csv
