import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AspirationDataSchema} from '../constants';
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
import {useTranslation} from 'react-i18next';
import FileSystemService from '../services/FileSystemService';
import FilePickerManager from 'react-native-file-picker';

interface AspirationMeasurement {
  id: number;
  compounds: {[compound: string]: MeasurementPerCompound};
}

interface MeasurementPerCompound {
  compoundName: string;
  date: Date;
  leakTightnessTest: string;
  aspiratorFlow: string;
  aspiratedVolume: string;
  initialVolume: string;
  sampleId: number;

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
  const initialState: MeasurementPerCompound = {
    compoundName: TESTED_COMPOUNDS[0],
    date: new Date(),
    leakTightnessTest: '',
    aspiratorFlow: '',
    aspiratedVolume: '',
    initialVolume: '',
    sampleId: 0,
  };

  const fileSystemService = new FileSystemService();



  const emptyMeasurement: AspirationMeasurement = {
    id: 0,
    compounds: {},
  };

  for (const compound of TESTED_COMPOUNDS) {
    emptyMeasurement.compounds[compound] = {
      ...initialState,
      compoundName: compound,
    };
  }
  // dataIndex is used to select the current measurement that is being modified.
  const [dataIndex, setDataIndex] = useState(0);

  // currentCompundData is used for storing the state of the measurement of
  // the current compound that is being entered / edited.
  const [currentCompoundData, setCurrentCompoundData] = useState(initialState);

  // current measurement is the measurement for which we are currently modifying
  // the respective compounds.
  const [currentMeasurement, setCurrentMeasurement] =
    useState(emptyMeasurement);

  const [measurements, setMeasurements] = useState([emptyMeasurement]);
  fileSystemService.loadLocal('aspiration-measurements.txt').then(loadedMeasurements => {
    const measurements = loadedMeasurements as AspirationMeasurement[];
    setMeasurements(measurements)

  })
  const loadPreviousMeasurement = () => {
    if (dataIndex > 0) {
      const newIndex = dataIndex - 1;
      setCurrentCompoundData(
        measurements[newIndex].compounds[currentCompoundData.compoundName],
      );
      setDataIndex(newIndex);
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
    const newMeasurements: AspirationMeasurement[] = measurements.map(
      measurement => {
        return measurement.id == dataIndex ? currentMeasurement : measurement;
      },
    );
    setMeasurements(newMeasurements);

    fileSystemService.saveJSON(newMeasurements, 'aspiration-measurements.txt');
    fileSystemService.saveLocal(newMeasurements, 'aspiration-measurements.txt');
  };

  const loadNextMeasurement = () => {
    if (isLatestMeasurement()) {
      setCurrentCompoundData(initialState);
    }
    const newIndex = dataIndex + 1;
    if (dataIndex < measurements.length - 1) {
      setCurrentCompoundData(
        measurements[newIndex].compounds[currentCompoundData.compoundName],
      );
      setDataIndex(newIndex);
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

  // This helper can be used for updating the array by overwriting a single
  // field inside of it. The field should be an object with a single field
  // that we want to update, e.g. {date: new Date()}
  const updateCurrentCompound = (field: Partial<MeasurementPerCompound>) => {
    setCurrentCompoundData({
      ...currentCompoundData,
      ...field,
    });
  };

  const {t} = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={local_styles.defaultScrollView}>
        <DataBar
          label={
            t(`aspirationScreen:${AspirationDataSchema.measurementNumber}`) + ':'
          }>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <NumberInputBar
          placeholder="0"
          valueUnit="ml"
          value={currentCompoundData.initialVolume}
          onChangeText={text => {
            updateCurrentCompound({initialVolume: text});
          }}
          label={
            t(`aspirationScreen:${AspirationDataSchema.initialVolume}`) + ':'
          }
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentCompoundData.aspiratorFlow}
          onChangeText={text => {
            updateCurrentCompound({aspiratorFlow: text});
          }}
          label={
            t(`aspirationScreen:${AspirationDataSchema.aspiratorFlow}`) + ':'
          }
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l/h"
          value={currentCompoundData.leakTightnessTest}
          onChangeText={text => {
            updateCurrentCompound({
              leakTightnessTest: text,
            });
          }}
          label={
            t(`aspirationScreen:${AspirationDataSchema.leakTightnessTest}`) +
            ':'
          }
        />
        <TimeSelector
          timeLabel={
            t(`aspirationScreen:${AspirationDataSchema.arrivalTime}`) + ':'
          }
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
              aspiratedVolume: text,
            });
          }}
          label={
            t(`aspirationScreen:${AspirationDataSchema.aspiratedVolume}`) + ':'
          }
        />
        <NumberInputBar
          placeholder="0"
          valueUnit=""
          value={currentCompoundData.sampleId.toString()}
          onChangeText={text => {
            updateCurrentCompound({
              sampleId: text == '' ? 0 : parseInt(text)
            });
          }}
          label={t(`aspirationScreen:${AspirationDataSchema.sampleId}`) + ':'}
        />
        <SelectorBar
          label={
            t(`aspirationScreen:${AspirationDataSchema.compoundType}`) + ':'
          }
          selections={TESTED_COMPOUNDS}
          onSelect={(selectedItem: string, _index: number) => {
            changeCurrentCompound(selectedItem);
          }}
        />
        <View style={local_styles.buttonContainer}>
          <TouchableOpacity
            style={local_styles.navigationButton}
            onPress={loadPreviousMeasurement}>
            <ButtonIcon materialIconName="arrow-left-circle" />
          </TouchableOpacity>
          {isLatestMeasurement() ? (
            <TouchableOpacity
              style={local_styles.navigationButton}
              onPress={addNewMeasurement}>
              <ButtonIcon materialIconName="plus" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={local_styles.navigationButton}
              onPress={saveModifications}>
              <ButtonIcon materialIconName="content-save" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={local_styles.navigationButton}
            onPress={loadNextMeasurement}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={local_styles.navigationButton}
          onPress={() => {
            FilePickerManager.showFilePicker((response: any) => {
              console.log('Response = ', response);

              if (response.didCancel) {
                console.log('User cancelled file picker');
              } else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
              } else {
                console.log({
                  file: response,
                });
              }
            });
          }}>
          <ButtonIcon materialIconName="folder-open" />
        </TouchableOpacity>
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

const local_styles = StyleSheet.create({
  navigationButton: {
    borderRadius: defaultBorderRadius,
    flexDirection: 'row',
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    backgroundColor: 'white',
    height: 40,
  },
  defaultScrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: defaultGap,
  },
  buttonContainer: {
    borderRadius: largeBorderRadius,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.secondaryBlue,
    padding: defaultPadding,
    alignSelf: 'center',
    gap: defaultGap,
  },
});
