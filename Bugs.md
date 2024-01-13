# List of bugs to repair

## To Do

## Bugs fixed

- [X] Hour selection on AspirationScreen (turned out to be bad translation selection)
- [X] Number of sample on AspirationScreen (bad usage of the updateState magic function with spread operators)

# Tasklist

## Future Features

- [ ] Add proper duration selector to replace number inputs in the UtilitiesScreen

## To Do

- [ ] Investigate number inputs being weird with 0s
- [ ] Adapt csv functionality for other screens
- [ ] GasAnalyzerCheckSCreen: the equipment should be loaded from the eqipment base (low priority feature)
- [ ] Add localization to the gas analyzer check screen
- [ ] Add internal storage save for HomeScreen
- [ ] Add csv support for utilities
- [ ] Add csv support for flows
- [ ] Add csv support for HomeScreen


## In progress

- [ ] Requirements analysis for the GasAnalyzerCheckScreen
  - need to input loads of data column-wise per compound

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
- [X] investigate permissions required (outcome: we can edit files provided that we were the ones who created the file)
- [X] add csv generation capabilities and load from csv
- [x] fix utilities screen
- [x] Add localization to StartEndBar
