import React, {useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {NumberInputBar, SelectorBar} from '../components/input-bars';
import {defaultGap, styles} from '../styles/common-styles';

interface SingleFlowMeasurement {
  dynamicPressure: string[];
  staticPressure: string;
  temperature: string;
  angle: string;
  axisNumber: number;
  pointOnAxis: number;
}

const initialState: SingleFlowMeasurement = {
  dynamicPressure: [],
  staticPressure: "",
  temperature: "",
  angle: "",
  axisNumber: 0,
  pointOnAxis: 0,
};

export const FlowsScreen = ({navigation}: {navigation: any}) => {
  // We represent numerical values as strings so that they can be entered using
  // the number input bars.
  const [numberOfSpigots, setNumberOfSpigots] = useState(1);
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [pipeDimensions, setPipeDimensions] = useState(["", ""]);
  const [pipeDiameter, setPipeDiameter] = useState("");
  const [mode, setMode] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState(initialState);

  // Stores all measurements for the axes and points on those axes.
  const [measurements, setMeasurements] = useState([initialState]);

  const updateSingleFlowMeasurement = (field: any) => {
    setCurrentMeasurement({
      ...currentMeasurement,
      ...field,
    });
  };

  const selectionsSpigots: string[] = useMemo(() => {
    const selections: string[] = [];
    for (var i = 0; i < numberOfSpigots; i++) {
      selections.push((i + 1).toString());
    }
    return selections;
  }, [numberOfSpigots]);

  const selectionsPoints: string[] = useMemo(() => {
    const selections: string[] = [];
    for (var i = 0; i < numberOfPoints; i++) {
      selections.push((i + 1).toString());
    }
    return selections;
  }, [numberOfPoints]);

  const measurementExists = (measurement: SingleFlowMeasurement) => {
    const filtered = measurements.filter(
      (item: SingleFlowMeasurement) =>
        measurement.axisNumber === item.axisNumber &&
        measurement.pointOnAxis === item.pointOnAxis,
    );
    return filtered.length > 0;
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <SelectorBar
          label={'Rodzaj przewodu'}
          selections={['Kołowy', 'Prostokątny']}
          onSelect={(selectedItem: string, _index: number) => {
            setMode(selectedItem !== 'Kołowy');
            console.log(JSON.stringify(measurements, null, 2));
          }}
        />
        {mode ? (
          <>
            <NumberInputBar
              placeholder=""
              valueUnit="m"
              value={pipeDimensions[0]}
              onChangeText={text => {
                const width = pipeDimensions[1];
                const height = text;
                const new_value = [height, width];
                setPipeDimensions(new_value);
              }}
              label={'Wysokość'}
            />
            <NumberInputBar
              placeholder=""
              valueUnit="m"
              value={pipeDimensions[1]}
              onChangeText={text => {
                const height = pipeDimensions[0];
                const width = text;
                const new_value = [height, width];
                setPipeDimensions(new_value);
              }}
              label={'Szerokość'}
            />
          </>
        ) : (
          <NumberInputBar
            placeholder=""
            valueUnit="m"
            value={pipeDiameter}
            onChangeText={text => setPipeDiameter(text)}
            label={'Średnica przewodu'}
          />
        )}
        <NumberInputBar
          placeholder=""
          value={numberOfSpigots.toString()}
          onChangeText={text => setNumberOfSpigots(parseFloat(text))}
          label={'Liczba króćców na obiekcie'}
        />
        <NumberInputBar
          placeholder=""
          value={numberOfPoints.toString()}
          onChangeText={text => setNumberOfPoints(parseFloat(text))}
          label={'Ilość punktów na osi'}
        />
        <SelectorBar
          label={'Numer króćca'}
          selections={selectionsSpigots}
          onSelect={(_selectedItem: string, index: number) => {
            const newAxisNumber = index;

            // Save the current measurement
            if (measurementExists(currentMeasurement)) {
              // Remove the old version of the measurement for the current selection of axis and point on the axis
              const newMeasurements = measurements.filter(
                (item: SingleFlowMeasurement) =>
                  currentMeasurement.axisNumber != item.axisNumber ||
                  currentMeasurement.pointOnAxis != item.pointOnAxis,
              );
              newMeasurements.push({...currentMeasurement});
              setMeasurements(newMeasurements);
            } else {
              measurements.push({...currentMeasurement});
              setMeasurements(measurements);
            }

            // Load / flush the new measurement
            const newMeasurement = {...currentMeasurement};
            newMeasurement.axisNumber = newAxisNumber;

            if (measurementExists(newMeasurement)) {
              const loadedMeasurement = measurements.filter(
                (item: SingleFlowMeasurement) =>
                  newMeasurement.axisNumber === item.axisNumber &&
                  newMeasurement.pointOnAxis === item.pointOnAxis,
              )[0];
              setCurrentMeasurement({...loadedMeasurement});
            } else {
              setCurrentMeasurement({
                ...initialState,
                axisNumber: newMeasurement.axisNumber,
                pointOnAxis: newMeasurement.pointOnAxis,
              });
            }

            console.log(measurements);
          }}
        />
        <SelectorBar
          label={'Numer punktu pomiarowego'}
          selections={selectionsPoints}
          onSelect={(_selectedItem: string, index: number) => {
            const newPointOnAxis = index;

            // Save the current measurement
            if (measurementExists(currentMeasurement)) {
              // Remove the old version of the measurement for the current selection of axis and point on the axis
              const newMeasurements = measurements.filter(
                (item: SingleFlowMeasurement) =>
                  currentMeasurement.axisNumber != item.axisNumber ||
                  currentMeasurement.pointOnAxis != item.pointOnAxis,
              );
              newMeasurements.push({...currentMeasurement});
              setMeasurements(newMeasurements);
            } else {
              measurements.push({...currentMeasurement});
              setMeasurements(measurements);
            }

            // Load / flush the new measurement
            const newMeasurement = {...currentMeasurement};
            newMeasurement.pointOnAxis = newPointOnAxis;

            if (measurementExists(newMeasurement)) {
              const loadedMeasurement = measurements.filter(
                (item: SingleFlowMeasurement) =>
                  newMeasurement.axisNumber === item.axisNumber &&
                  newMeasurement.pointOnAxis === item.pointOnAxis,
              )[0];
              setCurrentMeasurement({...loadedMeasurement});
            } else {
              setCurrentMeasurement({
                ...initialState,
                axisNumber: newMeasurement.axisNumber,
                pointOnAxis: newMeasurement.pointOnAxis,
              });
            }
          }}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[0]}
          onChangeText={text => {
            const value0 = text;
            const value1 = currentMeasurement.dynamicPressure[1];
            const value2 = currentMeasurement.dynamicPressure[2];
            const value3 = currentMeasurement.dynamicPressure[3];
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={'Ciśnienie Dynamiczne 1'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[1]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0];
            const value1 = text;
            const value2 = currentMeasurement.dynamicPressure[2];
            const value3 = currentMeasurement.dynamicPressure[3];
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={'Ciśnienie Dynamiczne 2'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[2]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0];
            const value1 = currentMeasurement.dynamicPressure[1];
            const value2 = text;
            const value3 = currentMeasurement.dynamicPressure[3];
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={'Ciśnienie Dynamiczne 3'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[3]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0];
            const value1 = currentMeasurement.dynamicPressure[1];
            const value2 = currentMeasurement.dynamicPressure[2];
            const value3 = text;
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={'Ciśnienie Dynamiczne 4'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.temperature}
          onChangeText={text => {
            updateSingleFlowMeasurement({temperature: text});
          }}
          label={'Temperatura'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.angle}
          onChangeText={text => {
            updateSingleFlowMeasurement({angle: text});
          }}
          label={'Kąt'}
        />
      </ScrollView>
    </View>
  );
};
