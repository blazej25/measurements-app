import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  NumberInputBar,
  SelectorBar,
  TextInputBar,
  TimeSelector,
} from '../components/input-bars';
import {styles} from '../styles/common-styles';
import {jsonToCSV, readString} from 'react-native-csv';
import {useTranslation} from 'react-i18next';
import {DustMeasurementDataSchema} from '../constants';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {ButtonIcon} from '../components/ButtonIcon';
import FileSystemService from '../services/FileSystemService';

interface DustMeasurement {
  id: number;
  selectedEndDiameter: string;
  measurementStartTime: Date;
  aspirationTime: string;
  aspiratedVolume: string;
  filterType: string;
  water: string;
}

interface DustMeasurementCSVRow {
  'Numer pomiaru': string;
  'Dobrana końcówka': string;
  'Godzina rozpoczęcia': string;
  'Czas aspiracji': string;
  'Objętość zaaspirowana': string;
  Filtr: string;
  Woda: string;
}

const initialData: DustMeasurement = {
  id: 0,
  selectedEndDiameter: '',
  measurementStartTime: new Date(),
  aspirationTime: '',
  aspiratedVolume: '',
  filterType: '',
  water: '',
};

const INTERNAL_STORAGE_FILE_NAME = 'dust.txt';

export const DustScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  const fileSystemService = new FileSystemService();

  /* State variables */

  const [currentMeasurement, setCurrentMeasurement] = useState({
    ...initialData,
  });
  const [savedMeasurements, setSavedMeasurements] = useState([
    {...initialData},
  ]);
  const [measurementIndex, setMeasurementIndex] = useState(0);
  const [numberOfMeasurements, setNumberOfMeasurements] = useState(1);

  // Here we need to have the derived state so that the measurement number selector
  // has the correct set of strings to display and select from.
  const selections: string[] = useMemo(
    () =>
      savedMeasurements
        .map(measurement => savedMeasurements.indexOf(measurement) + 1)
        .map(index => index.toString()),
    [savedMeasurements],
  );

  /* Logic for UI state transitions */
  const updateField = (field: Partial<DustMeasurement>) => {
    setCurrentMeasurement({...currentMeasurement, ...field});
  };

  const addNewMeasurement = () => {
    let newMeasurements = [...savedMeasurements];
    newMeasurements[measurementIndex] = {...currentMeasurement};
    if (newMeasurements.length == numberOfMeasurements) {
      // Don't allow adding measurements past the specified number
      setSavedMeasurements(newMeasurements);
      persistStateInInternalStorage(newMeasurements);
      return;
    }

    const newMeasurement = {...initialData, id: currentMeasurement.id + 1};
    newMeasurements = newMeasurements.concat([newMeasurement]);
    setSavedMeasurements(newMeasurements);
    persistStateInInternalStorage(newMeasurements);
    setMeasurementIndex(measurementIndex + 1);
    setCurrentMeasurement(newMeasurement);
  };

  const saveModifications = () => {
    let newMeasurements = [...savedMeasurements];
    newMeasurements[measurementIndex] = {...currentMeasurement};
    setSavedMeasurements(newMeasurements);
    persistStateInInternalStorage(newMeasurements);
  };

  const persistStateInInternalStorage = (state: DustMeasurement[]) => {
    fileSystemService.saveObjectToInternalStorage(
      state,
      INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const showingLastMeasurement = () =>
    measurementIndex == savedMeasurements.length - 1;

  const isSpaceLeft = () => savedMeasurements.length < numberOfMeasurements;

  const flushState = () => {
    setSavedMeasurements([{...initialData}]);
    setCurrentMeasurement({...initialData});
    setMeasurementIndex(0);
    setNumberOfMeasurements(1);
  };

  /* Logic for persisting state in the internal storage. */
  // See H20_14790_Screen for comments on how this works.
  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        if (loadedMeasurements) {
          restoreStateFrom(loadedMeasurements);
        }
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var measurements = loadedMeasurements as DustMeasurement[];
    measurements = parseDates(measurements);
    const lastMeasurementIndex = measurements.length - 1;
    setMeasurementIndex(lastMeasurementIndex);
    setSavedMeasurements(measurements);
    setNumberOfMeasurements(measurements.length);
    setCurrentMeasurement(measurements[lastMeasurementIndex]);
  };

  const parseDates = (measurements: DustMeasurement[]) => {
    for (var measurement of [...measurements]) {
      measurement.measurementStartTime = new Date(
        measurement.measurementStartTime,
      );
    }
    return measurements;
  };

  /* Logic for saving and loading the file from external storage as CSV */

  const exportMeasurementsAsCSV = () => {
    const csvRows: DustMeasurementCSVRow[] = [];
    for (const measurement of savedMeasurements) {
      csvRows.push({
        'Numer pomiaru': (measurement.id + 1).toString(),
        'Dobrana końcówka': measurement.selectedEndDiameter,
        'Godzina rozpoczęcia': measurement.measurementStartTime.toString(),
        'Czas aspiracji': measurement.aspirationTime,
        'Objętość zaaspirowana': measurement.aspiratedVolume,
        Filtr: measurement.filterType,
        Woda: measurement.water,
      });
    }
    const csvString = jsonToCSV(csvRows);
    console.log('Exporting a CSV file: ');
    console.log(csvString);
    return csvString;
  };

  const restoreStateFromCSV = (fileContents: string) => {
    const csvRows: DustMeasurementCSVRow[] = readString(fileContents, {
      header: true,
    })['data'] as DustMeasurementCSVRow[];

    console.log('Restoring state from a CSV file: ');
    console.log(JSON.stringify(csvRows, null, 2));
    const newMeasurements: DustMeasurement[] = [];
    for (const row of csvRows) {
      newMeasurements.push({
        id: parseInt(row['Numer pomiaru']) - 1,
        selectedEndDiameter: row['Dobrana końcówka'],
        measurementStartTime: new Date(row['Godzina rozpoczęcia']),
        aspirationTime: row['Czas aspiracji'],
        aspiratedVolume: row['Objętość zaaspirowana'],
        filterType: row['Filtr'],
        water: row['Woda'],
      });
    }
    setSavedMeasurements([...newMeasurements]);
    const lastMeasurementIndex = newMeasurements.length - 1;
    setMeasurementIndex(lastMeasurementIndex);
    setNumberOfMeasurements(newMeasurements.length);
    setCurrentMeasurement(newMeasurements[lastMeasurementIndex]);
  };

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={exportMeasurementsAsCSV}
        onDelete={flushState}
        fileContentsHandler={restoreStateFromCSV}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <NumberInputBar
          placeholder="0"
          value={numberOfMeasurements.toString()}
          onChangeText={text =>
            setNumberOfMeasurements(text ? parseInt(text) : 0)
          }
          label={t(
            `dustScreen:${DustMeasurementDataSchema.numberOfMeasurements}`,
          )}
        />
        <View style={{...styles.mainContainer, margin: 0}}>
          <NumberInputBar
            placeholder="0"
            value={currentMeasurement.selectedEndDiameter}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.selectedEndDiameter}`) +
              ':'
            }
            onChangeText={text => updateField({selectedEndDiameter: text})}
          />
          <TimeSelector
            timeLabel={
              t(
                `dustScreen:${DustMeasurementDataSchema.measurementStartTime}`,
              ) + ':'
            }
            date={currentMeasurement.measurementStartTime}
            setDate={date => updateField({measurementStartTime: date})}
          />
          <NumberInputBar
            placeholder="0"
            value={currentMeasurement.aspirationTime}
            valueUnit="min"
            onChangeText={text => updateField({aspirationTime: text})}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.aspirationTime}`) + ':'
            }
          />
          <NumberInputBar
            placeholder="0"
            value={currentMeasurement.aspiratedVolume}
            onChangeText={text => updateField({aspiratedVolume: text})}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.aspiratedVolume}`) + ':'
            }
          />
          <TextInputBar
            value={currentMeasurement.filterType}
            label={
              t(`dustScreen:${DustMeasurementDataSchema.filterType}`) + ':'
            }
            onChangeText={text => updateField({filterType: text})}
          />
          <TextInputBar
            value={currentMeasurement.water}
            label={t(`dustScreen:${DustMeasurementDataSchema.water}`) + ':'}
            onChangeText={text => updateField({water: text})}
          />
          <SelectorBar
            label={
              t(`dustScreen:${DustMeasurementDataSchema.measurementNumber}`) +
              ':'
            }
            selections={selections}
            onSelect={(_selectedItem: string, index: number) => {
              setMeasurementIndex(index);
              setCurrentMeasurement(savedMeasurements[index]);
            }}
            selectionToText={_selection => (measurementIndex + 1).toString()}
            rowTextForSelection={selection => selection}
          />
          {showingLastMeasurement() && isSpaceLeft() ? (
            <TouchableOpacity
              style={{...styles.actionButton, justifyContent: 'center'}}
              onPress={addNewMeasurement}>
              <Text style={styles.actionButtonText}>
                {t(`dustScreen:addMeasurement`)}
              </Text>
              <ButtonIcon materialIconName={'plus'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{...styles.actionButton, justifyContent: 'center'}}
              onPress={saveModifications}>
              <Text style={styles.actionButtonText}>
                {t(`dustScreen:saveMeasurement`)}
              </Text>
              <ButtonIcon materialIconName={'content-save-edit'} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
