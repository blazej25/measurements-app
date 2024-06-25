import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CommonDataSchema } from '../constants';
import {
  DataBar,
  NumberInputBar,
  SelectorBar,
  TimeSelector,
} from '../components/input-bars';
import { styles } from '../styles/common-styles';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';
import { HelpAndSettingsGroup } from '../components/HelpAndSettingsGroup';
import { jsonToCSV, readString } from 'react-native-csv';
import { ButtonIcon } from '../components/ButtonIcon';
import FileSystemService from '../services/FileSystemService';
import { useTranslation } from 'react-i18next';

export interface H2OMeasurement {
  id: number;
  date: Date;
  afterMass: string[];
  initialMass: string[];
  leakTightnessTest: string;
  aspiratorFlow: string;
  aspiratedGases: string;
}

interface MeasurementCSVRow {
  'Numer pomiaru': string;
  'Godzina przyjazdu': string;
  'Próba szczelności': string;
  'Przepływ przez aspirator': string;
  'Objętość zaaspirowana': string;
  'Masa początkowa płuczka 1': string;
  'Masa końcowa płuczka 1': string;
  'Masa początkowa płuczka 2': string;
  'Masa końcowa płuczka 2': string;
  'Masa początkowa płuczka 3': string;
  'Masa końcowa płuczka 3': string;
}

export const H2O_INTERNAL_STORAGE_FILE_NAME = 'h2o-14790.txt';
export const H2O_SCREEN_CSV_HEADING = 'H2O-14790\n'

export const H2O_14790_Screen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const fileSystemService = new FileSystemService();

  /* State variables */
  const [measurements, setMeasurements]: [
    measurements: H2OMeasurement[],
    setMeasurements: any,
  ] = useState([]);

  const initialState: H2OMeasurement = {
    id: 0,
    date: new Date(),
    initialMass: ['', '', ''],
    afterMass: ['', '', ''],
    leakTightnessTest: '',
    aspiratorFlow: '',
    aspiratedGases: '',
  };

  const [dataIndex, setDataIndex] = useState(0);
  const [scrubberIndex, setScrubberIndex] = useState(0);
  const [currentMeasurement, setCurrentMeasurement] = useState({
    ...initialState,
  });

  // Derived state used for displaying the curren scrubber masses.
  const afterMassDisplayValue = useMemo(
    () => {
      if (currentMeasurement == undefined) {
        return "0"
      }
      return currentMeasurement.afterMass[scrubberIndex];
    },
    [currentMeasurement, scrubberIndex],
  );

  // useMemo makes a derived state out of some other state. In the case below the derived state
  // is the currently showing mass value depending on the number of the 'płuczka' that is currently showing.
  // syntax of use memo: useMemo(() => <expression-for-the-derived-state>, [state arguments from which the target state is derived]);
  const initialMassShowingValue = useMemo(
    () => {
      if (currentMeasurement == undefined) {
        return "0"
      }
      return currentMeasurement.initialMass[scrubberIndex];
    },
    [currentMeasurement, scrubberIndex],
  );

  const updateField = (field: Partial<H2OMeasurement>) => {
    setCurrentMeasurement({ ...currentMeasurement, ...field });
  };

  /* State transitions for the navigation button component */

  const setPreviousMeasurement = () => {
    if (dataIndex == 0) {
      return;
    }
    const indexed_measurement = measurements[dataIndex - 1]
    if (indexed_measurement == undefined) {
      setCurrentMeasurement({ ...initialState });
    } else {
      setCurrentMeasurement(indexed_measurement);
    }
    setDataIndex(dataIndex - 1);
  };

  const addNewMeasurement = () => {
    const newMeasurements = measurements.concat({ ...currentMeasurement });
    setMeasurements(newMeasurements);
    setDataIndex(dataIndex + 1);
    setCurrentMeasurement({ ...initialState, id: currentMeasurement.id + 1 });
    setScrubberIndex(0);

    // The modifications are saved to the internal storage.
    fileSystemService.saveObjectToInternalStorage(
      newMeasurements,
      H2O_INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const saveModifiedMeasurement = () => {
    // Update the currently selected measurement with the new values.
    const newMeasurements = measurements.map(measurement => {
      return measurement.id == dataIndex
        ? { ...currentMeasurement }
        : measurement;
    });
    setMeasurements(newMeasurements);

    // The modifications are saved to the internal storage.
    fileSystemService.saveObjectToInternalStorage(
      newMeasurements,
      H2O_INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const setNextMeasurement = () => {
    // Here if the dataIndex is within the measurements array, it means
    // that we are viewing an already-saved measurement and so we want
    // to load that measurement. Otherwise, if dataIndex
    // is equal to measurements.length, it means that we are adding a
    // new measurement and so no measurement exists that can be loaded.
    if (dataIndex < measurements.length - 1) {
      setCurrentMeasurement(measurements[dataIndex + 1]);
    }

    // We erase the current values only if the user transitions from viewing the
    // last saved measurement to adding the new one.
    if (dataIndex == measurements.length - 1) {
      setCurrentMeasurement({ ...initialState, id: measurements.length });
    }

    if (dataIndex < measurements.length) {
      setDataIndex(dataIndex + 1);
    }
  };

  /* Logic for saving the UI state as JSON into internal storage so that
   * the data stays in the UI when the app is closed. */

  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(H2O_INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        console.log(loadedMeasurements);
          restoreStateFrom(loadedMeasurements);
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var measurements = loadedMeasurements as H2OMeasurement[];
    // Call to pare dates replaces all date fields with the actual Typescript
    // date object so that it can be manipulated correctly by the UI.
    if (measurements.length == 0) {
        setCurrentMeasurement({...initialState});
        setMeasurements([]);
        setScrubberIndex(0);
        setDataIndex(0);
        return;
    }
    measurements = parseDates(measurements);

    // Load state of all measurements and load the current measurement so that the values get
    // loaded appropriately.
    setDataIndex(measurements.length - 1);
    setCurrentMeasurement(measurements[measurements.length - 1])
    setMeasurements(measurements);
  };

  // Ensures that the dates are parsed correctly after loading the saved
  // JSON object with the measurements
  const parseDates = (measurements: H2OMeasurement[]) => {
    for (var measurement of [...measurements]) {
      if (measurement != undefined) {
        measurement.date = new Date(measurement.date);
      }
    }
    return measurements;
  };

  /* Logic for saving and loading the file from external storage as CSV */

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={() => {
          setMeasurements([{ ...initialState }]);
          setCurrentMeasurement({ ...initialState })
          setDataIndex(0);
          setScrubberIndex(0);
          fileSystemService.saveObjectToInternalStorage(
            [],
            H2O_INTERNAL_STORAGE_FILE_NAME,
          );
        }}
        reloadScreen={loadMeasurements}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <DataBar label={t('h20Screen:measurementNumber') + ':'}>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={currentMeasurement ? currentMeasurement.date : new Date}
          setDate={date => updateField({ date: date })}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          // Value parameter controlls what is displayed in the component
          value={currentMeasurement.leakTightnessTest}
          onChangeText={text => updateField({ leakTightnessTest: text })}
          label={t('h20Screen:leakTightnessTest') + ':'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="m3/h"
          value={currentMeasurement.aspiratorFlow}
          onChangeText={text => updateField({ aspiratorFlow: text })}
          label={t('h20Screen:aspiratorFlow') + ':'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="m3"
          value={currentMeasurement.aspiratedGases}
          onChangeText={text => updateField({ aspiratedGases: text })}
          label={t('h20Screen:aspiratedVolume') + ':'}
        />
        <SelectorBar
          label={t('h20Screen:scrubberNumber') + ':'}
          selections={['1', '2', '3']}
          onSelect={(selectedItem: string, _index: number) => {
            // Subtract for 0-based indexing.
            setScrubberIndex(parseInt(selectedItem) - 1);
          }}
          selectionToText={_selection => (scrubberIndex + 1).toString()}
          rowTextForSelection={selection => selection}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="g"
          onChangeText={text => {
            const newInitialMass = currentMeasurement.initialMass.map(
              (mass, index) => (index == scrubberIndex ? text : mass),
            );
            updateField({ initialMass: newInitialMass });
          }}
          value={initialMassShowingValue}
          label={t('h20Screen:initialMass') + ':'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="g"
          value={afterMassDisplayValue}
          onChangeText={text => {
            const newAfterMass = currentMeasurement.afterMass.map(
              (mass, index) => (index == scrubberIndex ? text : mass),
            );
            updateField({ afterMass: newAfterMass });
          }}
          label={t('h20Screen:massAfterMeasurement') + ':'}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={setPreviousMeasurement}>
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
                style={styles.navigationButton}
                onPress={addNewMeasurement}>
                <ButtonIcon materialIconName="plus" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={saveModifiedMeasurement}>
                <ButtonIcon materialIconName="content-save" />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={setNextMeasurement}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};

export const exportMeasurementsAsCSV = (measurements: H2OMeasurement[]) => {
  console.log("Generating CSV contents for H2O Screen...")
  const csvRows: MeasurementCSVRow[] = [];
  for (const measurement of measurements) {
    csvRows.push({
      'Numer pomiaru': (measurement.id + 1).toString(),
      'Godzina przyjazdu': measurement.date ? measurement.date.toString() : (new Date()).toString(),
      'Próba szczelności': measurement.leakTightnessTest,
      'Przepływ przez aspirator': measurement.aspiratorFlow,
      'Objętość zaaspirowana': measurement.aspiratedGases,
      'Masa początkowa płuczka 1': ('' + measurement.initialMass[0]).trim(),
      'Masa końcowa płuczka 1': ('' + measurement.afterMass[0]).trim(),
      'Masa początkowa płuczka 2': ('' + measurement.initialMass[1]).trim(),
      'Masa końcowa płuczka 2': ('' + measurement.afterMass[1]).trim(),
      'Masa początkowa płuczka 3': ('' + measurement.initialMass[2]).trim(),
      'Masa końcowa płuczka 3': ('' + measurement.afterMass[2]).trim(),
    });
  }
  const csvString = H2O_SCREEN_CSV_HEADING + jsonToCSV(csvRows);
  console.log(csvString);
  console.log("CSV contents for H2O Screen created successfully...")
  return csvString;
};

export const restoreStateFromCSV = (fileContents: string) => {
  const csvRows: MeasurementCSVRow[] = readString(fileContents, {
    header: true,
  })['data'] as MeasurementCSVRow[];

  console.log('Restoring state from a CSV file: ');
  console.log(JSON.stringify(csvRows, null, 2));
  const newMeasurements: H2OMeasurement[] = [];
  for (const row of csvRows) {
    const initialMass = [
      ('' + row['Masa początkowa płuczka 1']).trim(),
      ('' + row['Masa początkowa płuczka 2']).trim(),
      ('' + row['Masa początkowa płuczka 3']).trim(),
    ];
    const afterMass = [
      ('' + row['Masa końcowa płuczka 1']).trim(),
      ('' + row['Masa końcowa płuczka 2']).trim(),
      ('' + row['Masa końcowa płuczka 3']).trim(),
    ];
    newMeasurements.push({
      id: parseInt(row['Numer pomiaru']) - 1,
      date: new Date(row['Godzina przyjazdu']),
      afterMass: afterMass,
      initialMass: initialMass,
      leakTightnessTest: ('' + row['Próba szczelności']).trim(),
      aspiratorFlow: ('' + row['Przepływ przez aspirator']).trim(),
      aspiratedGases: ('' + row['Objętość zaaspirowana']).trim(),
    });
  }
  return newMeasurements;
};