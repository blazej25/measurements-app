import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {CommonDataSchema} from '../constants';
import {t} from 'i18next';
import {
  DataBar,
  NumberInputBar,
  SelectorBar,
  TimeSelector,
} from '../components/input-bars';
import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  largeBorderRadius,
  styles,
} from '../styles/common-styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TESTED_COMPOUNDS: string[] = [
  'HCL',
  'HF',
  'HG',
  'S02',
  'NH3',
  'METALE',
  'PB',
];

interface Measurement {
  id: number;
  compounds: {[compound: string]: MeasurementPerCompound};
}

// Add UI components to get this data
interface MeasurementPerCompound {
  date: Date;
  leakTightnessTest: number;
  aspiratorFlow: number;
  aspiratedVolume: number;
  initialVolume: number;
  testNumber: number;
}

const ButtonIcon = ({materialIconName}: {materialIconName: string}) => {
  return (
    <Icon
      name={materialIconName}
      style={{marginTop: 10}}
      size={20}
      color={colors.buttonBlue}
    />
  );
};

export const AspirationScreen = ({navigation}: {navigation: any}) => {
  // In this screen we are collecting a list of measurements.
  const [measurements, setMeasurements]: [
    measurements: Measurement[],
    setMeasurements: any,
  ] = useState([]);

  const initialState: MeasurementPerCompound = {
    date: new Date(),
    leakTightnessTest: 0,
    aspiratorFlow: 0,
    aspiratedVolume: 0,
    initialVolume: 0,
    testNumber: 0,
  };

  const [dataIndex, setDataIndex] = useState(0);
  const [currentMeasurement, setCurrentMeasurement] = useState(initialState);

  const loadMeasurement = (measurement: MeasurementPerCompound) => {
    setCurrentMeasurement(measurement);
  };

  const storeCurrentValuesAsMeasurement = () => {
    const newMeasurement: MeasurementPerCompound = {
      date: currentMeasurement.date,
      leakTightnessTest: currentMeasurement.leakTightnessTest,
      aspiratorFlow: currentMeasurement.aspiratorFlow,
      aspiratedVolume: currentMeasurement.aspiratedVolume,
      initialVolume: currentMeasurement.initialVolume,
      testNumber: currentMeasurement.testNumber,
    };
    return newMeasurement;
  };

  // Function for erasing the current input values
  const eraseCurrentValues = () => {
    setCurrentMeasurement(initialState);
  };

  const measurementNavigationButtonStyle: StyleProp<ViewStyle> = {
    borderRadius: defaultBorderRadius,
    flexDirection: 'row',
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    backgroundColor: 'white',
    height: 40,
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <DataBar label={'Numer Pomiaru'}>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <NumberInputBar
          placeholder="0"
          valueUnit="ml"
          value={currentMeasurement.aspiratorFlow}
          onChangeText={text => {
            currentMeasurement.initialVolume = parseFloat(text);
            setCurrentMeasurement(currentMeasurement);
          }}
          label={'Objętość początkowa roztworu'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentMeasurement.aspiratorFlow}
          onChangeText={text => {
            currentMeasurement.aspiratorFlow = parseFloat(text);
            setCurrentMeasurement(currentMeasurement);
          }}
          label={'Przepływ przez aspirator:'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentMeasurement.leakTightnessTest}
          onChangeText={text => {
            currentMeasurement.leakTightnessTest = parseFloat(text);
            setCurrentMeasurement(currentMeasurement);
          }}
          label={'Próba szczelności - przepływ:'}
        />
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={currentMeasurement.date}
          setDate={date => {
            currentMeasurement.date = date;
            setCurrentMeasurement(currentMeasurement);
          }}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          value={currentMeasurement.aspiratedVolume}
          onChangeText={text => {
            currentMeasurement.aspiratedVolume = parseFloat(text);
            setCurrentMeasurement(currentMeasurement);
          }}
          label={'Objętość zaaspirowana'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit=""
          value={currentMeasurement.aspiratedVolume}
          onChangeText={text => {
            currentMeasurement.testNumber = parseInt(text);
            setCurrentMeasurement(currentMeasurement);
          }}
          label={'Nr identyfikacyjny próbki'}
        />
        <SelectorBar
          label={'Numer płuczki: '}
          selections={['1', '2', '3']}
          onSelect={(selectedItem: string, _index: number) => {
            // We subtract 1 because the UI displays the numbers of the scrubbers
            // starting from 1, but the array of scrubbers uses usual 0-based
            // indexing.
          }}
        />
        <View
          // This is the main button component
          style={{
            borderRadius: largeBorderRadius,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: colors.secondaryBlue,
            padding: defaultPadding,
            alignSelf: 'center',
            gap: defaultGap,
          }}>
          <TouchableOpacity
            style={measurementNavigationButtonStyle}
            onPress={() => {
              if (dataIndex > 0) {
                loadMeasurement(measurements[dataIndex - 1]);
                setDataIndex(dataIndex - 1);
              }
            }}>
            <ButtonIcon materialIconName="arrow-left-circle" />
          </TouchableOpacity>
          {
            // If we are currently adding a new measurement, then here the '+' button
            // will be rendered, and clicking on it will save the new measurement.
            // If the user navigates into one of the previous measurements, then
            // instead of the '+' button, the save button will be rendered, and clicking
            // on that save button will apply the changes made to the input to that
            // previously captured measurement.
            dataIndex == measurements.length ? (
              <TouchableOpacity
                style={measurementNavigationButtonStyle}
                onPress={
                  // Here save the current state as the new saved measurement.
                  () => {
                    setMeasurements(
                      measurements.concat(storeCurrentValuesAsMeasurement()),
                    );
                    setDataIndex(dataIndex + 1);
                    eraseCurrentValues();
                    // Restore the 'numer płuczki' to 1.
                    setScrubberIndex(0);
                  }
                }>
                <ButtonIcon materialIconName="plus" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={measurementNavigationButtonStyle}
                onPress={() => {
                  // Update the currently selected measurement with the new values.
                  const newMeasurements = measurements.map(measurement => {
                    return measurement.id == dataIndex
                      ? storeCurrentValuesAsMeasurement()
                      : measurement;
                  });
                  setMeasurements(newMeasurements);
                }}>
                <ButtonIcon materialIconName="content-save" />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity
            style={measurementNavigationButtonStyle}
            onPress={() => {
              // Here if the dataIndex is within the measurements array, it means
              // that we are viewing an already-saved measurement and so we want
              // to load that measurement. Otherwise, if dataIndex
              // is equal to measurements.length, it means that we are adding a
              // new measurement and so no measurement exists that can be loaded.
              if (dataIndex < measurements.length - 1) {
                loadMeasurement(measurements[dataIndex + 1]);
              }

              if (dataIndex < measurements.length) {
                setDataIndex(dataIndex + 1);
              }
              // We erase the current values only if the user transitions from viewing the
              // last saved measurement to adding the new one.
              if (dataIndex + 1 == measurements.length) {
                eraseCurrentValues();
              }
            }}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
