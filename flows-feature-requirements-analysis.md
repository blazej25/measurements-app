# Features to implement
- [x] circular pipe feature
  - [x] calculate the cross section area
  - [x] calculate the number of measurement points given the formula in the table
  - [x] select the method for calculating the measurement point locations
  - [x] paste the point location diagram drawing (nice to have)
  - [x] calculate the point locations
  - [x] make a separate unit-testable module for that
- [ ] rectangular pipe feature
  - [x] calculate the cross section area (and display in the app)
  - [x] calculate the number of measurement points given the formula in the table
  - [x] do we need to calculate point positions? - we do
  - [ ] do we need to calculate both coordinates of the point positions
        (this would introduce a complication compared to the circular pipe whereby
        we only have a single number)
  - [x] suggest the number of subdivisions along side length depending on the
        ratio of l_1/l_2 but allow override if necessary
        (feature implemented by changing the number of axes and allowing to change / override if needed)
  - [x] understand the elaborate logic for figuring out the measurement point
        grid locations

## Notes
  - focus on the business logic first and make it testable

