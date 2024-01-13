import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {AspirationDataSchema} from '../constants';
import {
  DataBar,
  NumberInputBar,
  SelectorBar,
  TimeSelector,
} from '../components/input-bars';
import {styles} from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import FileSystemService from '../services/FileSystemService';
import {ButtonIcon} from '../components/ButtonIcon';
import {jsonToCSV, readString} from 'react-native-csv';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';

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

interface AspirationMeasurementCSVRow {
  'Numer pomiaru': string;
  'Rodzaj związku': string;
  Data: Date;
  'Próba szczelności - przepływ': string;
  'Przepływ przez aspirator': string;
  'Objętość zaaspirowana': string;
  'Objętość początkowa roztworu': string;
  'Numer identyfikacyjny próbki': string;
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

const INTERNAL_STORAGE_FILE_NAME = 'aspiration-measurements.txt';

export const AspirationScreen = ({navigation}: {navigation: any}) => {
  // Initialise services
  const {t} = useTranslation();
  const fileSystemService = new FileSystemService();

  /* State variables */
  const initialState: MeasurementPerCompound = {
    compoundName: TESTED_COMPOUNDS[0],
    date: new Date(),
    leakTightnessTest: '',
    aspiratorFlow: '',
    aspiratedVolume: '',
    initialVolume: '',
    sampleId: 0,
  };

  const emptyMeasurement: AspirationMeasurement = {
    id: 0,
    compounds: {},
  };

  // Need to initialise the empty measurement to have an
  // empty measurement per compound for each compound measured.
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
  const [currentCompoundData, setCurrentCompoundData] = useState({
    ...initialState,
  });

  // Stores all measurements
  const [measurements, setMeasurements] = useState([{...emptyMeasurement}]);

  /* Logic for state transitions when switching between measurements follows */

  // Responsible for changing the UI state to the previous measurement in the list,
  // triggered when 'to-the-left' button is pressed in the control component
  // below the list of measurements.
  const loadPreviousMeasurement = () => {
    if (dataIndex == 0) {
      return;
    }
    const newIndex = dataIndex - 1;
    setCurrentCompoundData({
      ...measurements[newIndex].compounds[currentCompoundData.compoundName],
    });
    setDataIndex(newIndex);
  };

  // Responsible for loading the next measurement in the list. Triggered when
  // the 'to-the-right' button is pressed in the control component.
  const loadNextMeasurement = () => {
    if (dataIndex == measurements.length - 1) {
      return;
    }
    const newIndex = dataIndex + 1;
    setCurrentCompoundData({
      ...measurements[newIndex].compounds[currentCompoundData.compoundName],
    });
    setDataIndex(newIndex);
  };

  // Saves the currently modified measurement and adds a new empty measurement
  // at the end of the list of measurements. Triggered when the 'plus' button
  // is pressed in the control component.
  const addNewMeasurement = () => {
    saveModifications();
    setMeasurements([
      ...measurements,
      {...emptyMeasurement, id: measurements.length},
    ]);
    setDataIndex(dataIndex + 1);
    // Erase the fields so that new input can be collected.
    setCurrentCompoundData({...initialState});
  };

  // Responsible for saving the currently modified compound in the UI
  const saveModifications = () => {
    // Update the currently selected measurement with the new values.
    var modifiedMeasurement = measurements[dataIndex];

    // First overwrite the stored compound measurement data
    modifiedMeasurement.compounds[currentCompoundData.compoundName] = {
      ...currentCompoundData,
    };

    // Then overwrite the modified measurement.
    const newMeasurements: AspirationMeasurement[] = measurements.map(
      measurement => {
        return measurement.id === dataIndex ? modifiedMeasurement : measurement;
      },
    );

    setMeasurements(newMeasurements);

    // The modifications are saved to the internal storage.
    fileSystemService.saveObjectToInternalStorage(
      newMeasurements,
      INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const changeCurrentCompound = (compound: string) => {
    // When a new tested compound is selected we want to save the data
    // that was input for the current one, then load the selected one
    // from the current measurement state.
    var modifiedMeasurement = measurements[dataIndex];
    modifiedMeasurement.compounds[currentCompoundData.compoundName] = {
      ...currentCompoundData,
    };
    setCurrentCompoundData({...modifiedMeasurement.compounds[compound]});
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

  /* Logic for saving the UI state as JSON into internal storage so that
   * the data stays in the UI when the app is closed. */

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
    var measurements = loadedMeasurements as AspirationMeasurement[];
    // Call to pare dates replaces all date fields with the actual Typescript
    // date object so that it can be manipulated correctly by the UI.
    measurements = parseDates(measurements);

    const mostRecentMeasurement = measurements[measurements.length - 1];
    // Load state of all measurements and load the current measurement so that the values get
    // loaded appropriately.
    setDataIndex(measurements.length - 1);
    setMeasurements(measurements);
    setCurrentCompoundData({
      ...mostRecentMeasurement.compounds[TESTED_COMPOUNDS[0]],
    });
  };

  // Ensures that the dates are parsed correctly after loading the saved
  // JSON object with the measurements
  const parseDates = (measurements: AspirationMeasurement[]) => {
    for (var measurement of [...measurements]) {
      for (var compound of TESTED_COMPOUNDS) {
        measurement.compounds[compound].date = new Date(
          measurement.compounds[compound].date,
        );
      }
    }
    return measurements;
  };

  /* Logic for saving and loading the file from external storage as CSV */

  const exportMeasurementsAsCSV = () => {
    const csvRows: AspirationMeasurementCSVRow[] = [];
    for (const measurement of measurements) {
      for (const compound of TESTED_COMPOUNDS) {
        const compoundData = measurement.compounds[compound];
        csvRows.push({
          'Numer pomiaru': (measurement.id + 1).toString(),
          'Rodzaj związku': compoundData.compoundName,
          Data: compoundData.date,
          'Próba szczelności - przepływ': compoundData.leakTightnessTest,
          'Przepływ przez aspirator': compoundData.aspiratorFlow,
          'Objętość zaaspirowana': compoundData.aspiratedVolume,
          'Objętość początkowa roztworu': compoundData.initialVolume,
          'Numer identyfikacyjny próbki': compoundData.sampleId.toString(),
        });
      }
    }
    const csvString = jsonToCSV(csvRows);
    console.log('Exporting a CSV file: ');
    console.log(csvString);
    return csvString;
  };

  const restoreStateFromCSV = (fileContents: string) => {
    const csvRows: AspirationMeasurementCSVRow[] = readString(fileContents, {
      header: true,
    })['data'] as AspirationMeasurementCSVRow[];

    console.log('Restoring state from a CSV file: ');
    console.log(JSON.stringify(csvRows, null, 2));
    const newMeasurements: AspirationMeasurement[] = [];
    for (const row of csvRows) {
      if (row['Numer pomiaru'] == undefined) {
        continue;
      }

      const measurementNumber = parseInt(row['Numer pomiaru']);
      if (
        newMeasurements.length == 0 ||
        newMeasurements[newMeasurements.length - 1].id != measurementNumber - 1
      ) {
        const newData: AspirationMeasurement = {
          id: measurementNumber - 1,
          compounds: {},
        };
        for (const compound of TESTED_COMPOUNDS) {
          newData.compounds[compound] = {
            ...initialState,
            compoundName: compound,
          };
        }
        newMeasurements.push(newData);
      }

      if (newMeasurements.length >= measurementNumber) {
        newMeasurements[measurementNumber - 1].compounds[
          row['Rodzaj związku']
        ] = {
          compoundName: row['Rodzaj związku'],
          date: new Date(row['Data']),
          leakTightnessTest: row['Próba szczelności - przepływ'],
          aspiratorFlow: row['Przepływ przez aspirator'],
          aspiratedVolume: row['Objętość zaaspirowana'],
          initialVolume: row['Objętość początkowa roztworu'],
          sampleId: parseInt(row['Numer identyfikacyjny próbki']),
        };
      }
    }
    setMeasurements([...newMeasurements]);
    setDataIndex(0);
    setCurrentCompoundData(newMeasurements[0].compounds[TESTED_COMPOUNDS[0]]);
  };

  // The aim here is to load the state from the storage on each re-render of the
  // whole component
  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={exportMeasurementsAsCSV}
        onDelete={() => {
          setMeasurements([{...emptyMeasurement}]);
          setDataIndex(0);
          setCurrentCompoundData({...initialState});
        }}
        fileContentsHandler={restoreStateFromCSV}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <DataBar
          label={
            t(`aspirationScreen:${AspirationDataSchema.measurementNumber}`) +
            ':'
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
          onChangeText={text =>
            updateCurrentCompound({leakTightnessTest: text})
          }
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
          setDate={date => updateCurrentCompound({date: date})}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          value={currentCompoundData.aspiratedVolume}
          onChangeText={text => updateCurrentCompound({aspiratedVolume: text})}
          label={
            t(`aspirationScreen:${AspirationDataSchema.aspiratedVolume}`) + ':'
          }
        />
        <NumberInputBar
          placeholder="0"
          valueUnit=""
          value={currentCompoundData.sampleId.toString()}
          onChangeText={text =>
            updateCurrentCompound({sampleId: text == '' ? 0 : parseInt(text)})
          }
          label={t(`aspirationScreen:${AspirationDataSchema.sampleId}`) + ':'}
        />
        <SelectorBar
          label={
            t(`aspirationScreen:${AspirationDataSchema.compoundType}`) + ':'
          }
          selections={TESTED_COMPOUNDS}
          onSelect={(selectedItem: string, _index: number) =>
            changeCurrentCompound(selectedItem)
          }
          // Ensure that when the current compound is changed implicitly (e.g.
          // by adding a new measurement), the text displayed on the selector
          // needs to reflect that instead of the last selected value.
          selectionToText={_selection => currentCompoundData.compoundName}
          rowTextForSelection={selection => selection}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={loadPreviousMeasurement}>
            <ButtonIcon materialIconName="arrow-left-circle" />
          </TouchableOpacity>
          {dataIndex == measurements.length - 1 ? (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={addNewMeasurement}>
              <ButtonIcon materialIconName="plus" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={saveModifications}>
              <ButtonIcon materialIconName="content-save" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={loadNextMeasurement}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
