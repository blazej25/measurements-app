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
  compoundName: string;
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
  const initialState: MeasurementPerCompound = {
    compoundName: TESTED_COMPOUNDS[0],
    date: new Date(),
    leakTightnessTest: 0,
    aspiratorFlow: 0,
    aspiratedVolume: 0,
    initialVolume: 0,
    testNumber: 0,
  };

  const emptyMeasurement: Measurement = {
    id: 0,
    compounds: {},
  };

  for (const compound of TESTED_COMPOUNDS) {
    emptyMeasurement.compounds[compound] = {
      ...initialState,
      compoundName: compound,
    };
  }

  const [dataIndex, setDataIndex] = useState(0);
  const [currentCompoundData, setCurrentCompoundData] = useState(initialState);
  const [currentMeasurement, setCurrentMeasurement] =
    useState(emptyMeasurement);
  const [measurements, setMeasurements]: [
    measurements: Measurement[],
    setMeasurements: any,
  ] = useState([emptyMeasurement]);

  const loadMeasurement = (measurement: MeasurementPerCompound) => {
    setCurrentCompoundData(measurement);
  };

  const snaphotCurrentInputValues = () => {
    const newMeasurement: MeasurementPerCompound = {
      compoundName: currentCompoundData.compoundName,
      date: currentCompoundData.date,
      leakTightnessTest: currentCompoundData.leakTightnessTest,
      aspiratorFlow: currentCompoundData.aspiratorFlow,
      aspiratedVolume: currentCompoundData.aspiratedVolume,
      initialVolume: currentCompoundData.initialVolume,
      testNumber: currentCompoundData.testNumber,
    };
    return newMeasurement;
  };

  // Function for erasing the current input values
  const eraseCurrentValues = () => {
    setCurrentCompoundData(initialState);
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
        <DataBar label={'Numer Pomiaru:'}>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <NumberInputBar
          placeholder="0"
          valueUnit="ml"
          value={currentCompoundData.initialVolume}
          onChangeText={text => {
            setCurrentCompoundData({
              ...currentCompoundData,
              initialVolume: parseFloat(text),
            });
          }}
          label={'Objętość początkowa roztworu:'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentCompoundData.aspiratorFlow}
          onChangeText={text => {
            setCurrentCompoundData({
              ...currentCompoundData,
              aspiratorFlow: parseFloat(text),
            });
          }}
          label={'Przepływ przez aspirator:'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentCompoundData.leakTightnessTest}
          onChangeText={text => {
            setCurrentCompoundData({
              ...currentCompoundData,
              leakTightnessTest: parseFloat(text),
            });
          }}
          label={'Próba szczelności - przepływ:'}
        />
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={currentCompoundData.date}
          setDate={date => {
            setCurrentCompoundData({...currentCompoundData, date: date});
          }}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          value={currentCompoundData.aspiratedVolume}
          onChangeText={text => {
            setCurrentCompoundData({
              ...currentCompoundData,
              aspiratedVolume: parseFloat(text),
            });
          }}
          label={'Objętość zaaspirowana:'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit=""
          value={currentCompoundData.testNumber}
          onChangeText={text => {
            setCurrentCompoundData({
              ...currentCompoundData,
              testNumber: parseInt(text),
            });
          }}
          label={'Nr identyfikacyjny próbki:'}
        />
        <SelectorBar
          label={'Rodzaj próbki:'}
          selections={TESTED_COMPOUNDS}
          onSelect={(selectedItem: string, _index: number) => {
            var modifiedMeasurement = measurements[dataIndex];
            modifiedMeasurement.compounds[currentCompoundData.compoundName] =
              snaphotCurrentInputValues();
            console.log(JSON.stringify(modifiedMeasurement.compounds, null, 2));
            loadMeasurement(modifiedMeasurement.compounds[selectedItem]);
            setCurrentMeasurement(modifiedMeasurement);
          }}
        />
        <View
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
                loadMeasurement(
                  measurements[dataIndex - 1].compounds[
                    currentCompoundData.compoundName
                  ],
                );
                setDataIndex(dataIndex - 1);
              }
            }}>
            <ButtonIcon materialIconName="arrow-left-circle" />
          </TouchableOpacity>
          {dataIndex == measurements.length - 1 ? (
            <TouchableOpacity
              style={measurementNavigationButtonStyle}
              onPress={
                // Here save the current state as the new saved measurement.
                () => {
                  var modifiedMeasurement = measurements[dataIndex];
                  modifiedMeasurement.compounds[
                    currentCompoundData.compoundName
                  ] = snaphotCurrentInputValues();
                  setCurrentMeasurement(modifiedMeasurement);
                  const newMeasurements: Measurement[] = measurements.map(
                    measurement => {
                      return measurement.id == dataIndex
                        ? currentMeasurement
                        : measurement;
                    },
                  );
                  setMeasurements([
                    ...newMeasurements,
                    {...emptyMeasurement, id: measurements.length},
                  ]);
                  setDataIndex(dataIndex + 1);
                  eraseCurrentValues();
                }
              }>
              <ButtonIcon materialIconName="plus" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={measurementNavigationButtonStyle}
              onPress={() => {
                // Update the currently selected measurement with the new values.
                var modifiedMeasurement = measurements[dataIndex];
                modifiedMeasurement.compounds[
                  currentCompoundData.compoundName
                ] = snaphotCurrentInputValues();
                setCurrentMeasurement(modifiedMeasurement);
                const newMeasurements: Measurement[] = measurements.map(
                  measurement => {
                    return measurement.id == dataIndex
                      ? currentMeasurement
                      : measurement;
                  },
                );
                setMeasurements(newMeasurements);
              }}>
              <ButtonIcon materialIconName="content-save" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={measurementNavigationButtonStyle}
            onPress={() => {
              if (dataIndex == measurements.length - 1) {
                eraseCurrentValues();
              }
              if (dataIndex < measurements.length - 1) {
                loadMeasurement(
                  measurements[dataIndex + 1].compounds[
                    currentCompoundData.compoundName
                  ],
                );
                setDataIndex(dataIndex + 1);
              }
            }}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
