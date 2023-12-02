import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
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

const TESTED_COMPOUNDS: string[] = [
  'HCL',
  'HF',
  'HG',
  'S02',
  'NH3',
  'METALE',
  'PB',
];

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
  const [measurements, setMeasurements] = useState([emptyMeasurement]);

  const loadPreviousMeasurement = () => {
    if (dataIndex > 0) {
      setCurrentCompoundData(
        measurements[dataIndex - 1].compounds[currentCompoundData.compoundName],
      );
      setDataIndex(dataIndex - 1);
    }
  };

  const addNewMeasurement = () => {
    saveModifications();
    setMeasurements([
      ...measurements,
      {...emptyMeasurement, id: measurements.length},
    ]);
    setDataIndex(dataIndex + 1);
    // Erase the fields so that new input can be collected.
    setCurrentCompoundData(initialState);
  };

  const saveModifications = () => {
    // Update the currently selected measurement with the new values.
    var modifiedMeasurement = measurements[dataIndex];
    modifiedMeasurement.compounds[currentCompoundData.compoundName] = {
      ...currentCompoundData,
    };
    setCurrentMeasurement(modifiedMeasurement);
    const newMeasurements: Measurement[] = measurements.map(measurement => {
      return measurement.id == dataIndex ? currentMeasurement : measurement;
    });
    setMeasurements(newMeasurements);
  };

  const loadNextMeasurement = () => {
    if (isLatestMeasurement()) {
      setCurrentCompoundData(initialState);
    }
    if (dataIndex < measurements.length - 1) {
      setCurrentCompoundData(
        measurements[dataIndex + 1].compounds[currentCompoundData.compoundName],
      );
      setDataIndex(dataIndex + 1);
    }
  };

  const changeCurrentCompound = (compound: string) => {
    // When a new tested compound is selected we want to save the data
    // that was input for the current one, then load the selected one
    // from the current measurement state.
    var modifiedMeasurement = measurements[dataIndex];
    modifiedMeasurement.compounds[currentCompoundData.compoundName] = {
      ...currentCompoundData,
    };
    setCurrentCompoundData(modifiedMeasurement.compounds[compound]);
    setCurrentMeasurement(modifiedMeasurement);
  };

  const isLatestMeasurement = () => {
    return dataIndex == measurements.length - 1;
  };

  const updateCurrentCompound = (field: any) => {
    setCurrentCompoundData({
      ...currentCompoundData,
      ...field,
    });
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={defaultScrollViewStyle as ScrollViewProps}>
        <DataBar label={'Numer Pomiaru:'}>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <NumberInputBar
          placeholder="0"
          valueUnit="ml"
          value={currentCompoundData.initialVolume}
          onChangeText={text => {
            updateCurrentCompound({initialVolume: parseFloat(text)});
          }}
          label={'Objętość początkowa roztworu:'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentCompoundData.aspiratorFlow}
          onChangeText={text => {
            updateCurrentCompound({
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
            updateCurrentCompound({
              leakTightnessTest: parseFloat(text),
            });
          }}
          label={'Próba szczelności - przepływ:'}
        />
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={currentCompoundData.date}
          setDate={date => {
            updateCurrentCompound({date: date});
          }}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          value={currentCompoundData.aspiratedVolume}
          onChangeText={text => {
            updateCurrentCompound({
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
            updateCurrentCompound({
              testNumber: parseInt(text),
            });
          }}
          label={'Nr identyfikacyjny próbki:'}
        />
        <SelectorBar
          label={'Rodzaj próbki:'}
          selections={TESTED_COMPOUNDS}
          onSelect={(selectedItem: string, _index: number) => {
            changeCurrentCompound(selectedItem);
          }}
        />
        <View style={buttonContainerStyle as ViewProps}>
          <TouchableOpacity
            style={navigationButtonStyle}
            onPress={loadPreviousMeasurement}>
            <ButtonIcon materialIconName="arrow-left-circle" />
          </TouchableOpacity>
          {isLatestMeasurement() ? (
            <TouchableOpacity
              style={navigationButtonStyle}
              onPress={addNewMeasurement}>
              <ButtonIcon materialIconName="plus" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={navigationButtonStyle}
              onPress={saveModifications}>
              <ButtonIcon materialIconName="content-save" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={navigationButtonStyle}
            onPress={loadNextMeasurement}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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

const navigationButtonStyle: StyleProp<ViewStyle> = {
  borderRadius: defaultBorderRadius,
  flexDirection: 'row',
  margin: defaultGap,
  paddingHorizontal: defaultPadding,
  backgroundColor: 'white',
  height: 40,
};

const defaultScrollViewStyle = {
  flexGrow: 1,
  justifyContent: 'flex-start',
  gap: defaultGap,
};

const buttonContainerStyle = {
  borderRadius: largeBorderRadius,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  backgroundColor: colors.secondaryBlue,
  padding: defaultPadding,
  alignSelf: 'center',
  gap: defaultGap,
};
