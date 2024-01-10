import React, { useMemo, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { NumberInputBar, SelectorBar } from '../components/input-bars';
import { defaultGap, styles } from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';


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

  const {t} = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={() => {}}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <SelectorBar
          label={
            t(`flowsScreen:pipeCrossSection`) + ':'
          }
          selections={[t('pipeCrossSectionTypes:ROUND'), t('pipeCrossSectionTypes:RECTANGULAR')]}
          onSelect={(selectedItem: string, _index: number) => {
            setMode(selectedItem !== t('pipeCrossSectionTypes:ROUND'))
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
              label={
                t(`flowsScreen:height`) + ':'
              }
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
              label={
                t(`flowsScreen:width`) + ':'
              }
            />
          </>
        ) : (
          <NumberInputBar
            placeholder=""
            valueUnit="m"
            value={pipeDiameter}
            onChangeText={text => setPipeDiameter(text)}
            label={
              t(`flowsScreen:pipeDiameter`) + ':'
            }
          />
        )}
        <NumberInputBar
          placeholder=""
          value={numberOfSpigots.toString()}
          onChangeText={text => setNumberOfSpigots(parseFloat(text))}
          label={
            t(`flowsScreen:numberOfSpigots`) + ':'
          }
        />
        <NumberInputBar
          placeholder=""
          value={numberOfPoints.toString()}
          onChangeText={text => setNumberOfPoints(parseFloat(text))}
          label={
            t(`flowsScreen:numberOfPoints`) + ':'
          }
        />
        <SelectorBar
          label={
            t(`flowsScreen:axisNumber`) + ':'
          }
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
          label={
            t(`flowsScreen:pointOnAxis`) + ':'
          }
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
          label={
            t(`flowsScreen:dynamicPressure`) + ' 1:'
          }
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
          label={
            t(`flowsScreen:dynamicPressure`) + ' 2:'
          }
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
          label={
            t(`flowsScreen:dynamicPressure`) + ' 3:'
          }
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
          label={
            t(`flowsScreen:dynamicPressure`) + ' 4:'
          }
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.temperature}
          onChangeText={text => { updateSingleFlowMeasurement({ temperature: text}) }}
          label={
            t(`flowsScreen:temperature`) + ':'
          }
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.angle}
          onChangeText={text => {
            updateSingleFlowMeasurement({ angle: text });
          }}
          label={
            t(`flowsScreen:angle`) + ':'
          }
        />
      </ScrollView>
    </View>
  );
};
