import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { NumberInputBar, SelectorBar } from '../components/input-bars';
import { jsonToCSV, readString } from 'react-native-csv';
import { defaultGap, styles } from '../styles/common-styles';
import { useTranslation } from 'react-i18next';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';
import { HelpAndSettingsGroup } from '../components/HelpAndSettingsGroup';
import FileSystemService from '../services/FileSystemService';

export interface SingleFlowMeasurement {
  dynamicPressure: string[];
  staticPressure: string;
  temperature: string;
  angle: string;
  axisNumber: number;
  pointOnAxis: number;
  pipeDiameter?: string;
  pipeWidth?: string;
  pipeHeight?: string;
}

interface FlowMeasurementCSVRow {
  'Przekrój przewodu': string;
  'Wysokość przewodu': string;
  'Szerokość przewodu': string;
  'Średnica przewodu': string;
  'Ilość osi pomiarowych': string;
  'Ilość punktów na osi': string;
  'Numer osi': string;
  'Punkt na osi': string;
  'Ciśnienie dynamiczne 1': string;
  'Ciśnienie dynamiczne 2': string;
  'Ciśnienie dynamiczne 3': string;
  'Ciśnienie dynamiczne 4': string;
  'Ciśnienie statyczne': string;
  Temperatura: string;
  Kąt: string;
}

const initialState: SingleFlowMeasurement = {
  dynamicPressure: [],
  staticPressure: '',
  temperature: '',
  angle: '',
  axisNumber: 0,
  pointOnAxis: 0,
};

export const FLOWS_INTERNAL_STORAGE_FILE_NAME = 'flows.txt';
export const FLOWS_SCREEN_CSV_HEADING = 'Przepływy\n';

export const FlowsScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const fileSystemService = new FileSystemService();

  // We represent numerical values as strings so that they can be entered using
  // the number input bars.
  const [numberOfSpigots, setNumberOfSpigots] = useState(1);
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [pipeDimensions, setPipeDimensions] = useState(['', '']);
  const [pipeDiameter, setPipeDiameter] = useState('');
  // TODO: add a proper enum
  const roundMode = false;
  const [mode, setMode] = useState(roundMode);
  const [currentMeasurement, setCurrentMeasurement] = useState({
    ...initialState,
  });

  // Stores all measurements for the axes and points on those axes.
  const [measurements, setMeasurements] = useState([{ ...initialState }]);

  const resetState = () => {
    setNumberOfSpigots(1);
    setNumberOfPoints(1);
    setPipeDimensions(['', '']);
    setPipeDiameter('');
    setMode(roundMode);
    setCurrentMeasurement({ ...initialState });
    setMeasurements([{ ...initialState }]);
  };

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

  /* Logic for persisting state in the internal storage. */
  // See H20_14790_Screen for comments on how this works.
  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(FLOWS_INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        restoreStateFrom(loadedMeasurements);
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var measurements = loadedMeasurements as SingleFlowMeasurement[];

    if (measurements.length == 0) {
      return;
    }

    // find out if we have a rectangular or circular pipe.
    const firstMeasurement = measurements[0];
    if (firstMeasurement.pipeDiameter) {
      setMode(false);
      setPipeDiameter(firstMeasurement.pipeDiameter);
    } else {
      setMode(true);
      setPipeDimensions([
        firstMeasurement.pipeHeight as string,
        firstMeasurement.pipeWidth as string,
      ]);
    }

    // figure out the number of axes and points on each axis by taking the
    // maximum over incoming values.
    const axisNumber =
      Math.max(...measurements.map(entry => entry.axisNumber)) + 1;
    const pointsOnEachAxis =
      Math.max(...measurements.map(entry => entry.pointOnAxis)) + 1;

    setNumberOfSpigots(axisNumber);
    setNumberOfPoints(pointsOnEachAxis);

    setCurrentMeasurement(measurements[measurements.length - 1]);
    setMeasurements(measurements);
  };

  const persistStateInInternalStorage = (state: SingleFlowMeasurement[]) => {
    fileSystemService.saveObjectToInternalStorage(
      state,
      FLOWS_INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const flushChangesAfterPipeSpecsModified = (
    mode: boolean,
    height: string,
    width: string,
    diameter: string,
  ) => {
    const newState = mode
      ? {
        ...initialState,
        pipeWidth: width,
        pipeHeight: height,
      }
      : {
        ...initialState,
        pipeDiameter: diameter,
      };

    setMeasurements([newState]);
    setCurrentMeasurement(newState);
  };

  /* State transitions for the UI. */
  const saveCurrentMeasurement = () => {
    // Save the current measurement
    if (measurementExists(currentMeasurement)) {
      // Remove the old version of the measurement for the current selection of axis and point on the axis
      const newMeasurements: SingleFlowMeasurement[] = measurements.filter(
        (item: SingleFlowMeasurement) =>
          currentMeasurement.axisNumber != item.axisNumber ||
          currentMeasurement.pointOnAxis != item.pointOnAxis,
      );
      newMeasurements.push({ ...currentMeasurement });
      setMeasurements(newMeasurements);
      persistStateInInternalStorage(newMeasurements);
      // Return the new list of measurements for composing in other functions.
      return newMeasurements;
    } else {
      measurements.push({ ...currentMeasurement });
      setMeasurements(measurements);
      persistStateInInternalStorage(measurements);
      // Return the new list of measurements for composing in other functions.
      return measurements;
    }
  };

  const loadNewMeasurement = (newMeasurement: SingleFlowMeasurement) => {
    if (measurementExists(newMeasurement)) {
      const loadedMeasurement = measurements.filter(
        (item: SingleFlowMeasurement) =>
          newMeasurement.axisNumber === item.axisNumber &&
          newMeasurement.pointOnAxis === item.pointOnAxis,
      )[0];
      setCurrentMeasurement({ ...loadedMeasurement });
    } else {
      // Here we are adding an empty measurement.
      // if we are in rectangular mode, TODO: improve engineering here.
      const newState = mode
        ? {
          ...initialState,
          axisNumber: newMeasurement.axisNumber,
          pointOnAxis: newMeasurement.pointOnAxis,
          pipeWidth: pipeDimensions[1],
          pipeHeight: pipeDimensions[0],
        }
        : {
          ...initialState,
          axisNumber: newMeasurement.axisNumber,
          pointOnAxis: newMeasurement.pointOnAxis,
          pipeDiameter: pipeDiameter,
        };
      setCurrentMeasurement(newState);
    }
  };

  const restoreStateFromCSV = (fileContents: string) => {
    // The state is stored in two parts of a csv file.
    // The first one stores the information collected in the
    // header of the utilities screen, whereas the second one
    // stores the list of measurements that are displayed in the scrollable view.

    console.log('Restoring state from a CSV file: ');
    console.log(fileContents);
    // First we remove the section header from the file.
    fileContents = fileContents.replace(FLOWS_SCREEN_CSV_HEADING, '');

    const rows = readString(fileContents, { header: true })[
      'data'
    ] as FlowMeasurementCSVRow[];
    const newMeasurements: SingleFlowMeasurement[] = [];

    for (const row of rows) {
      newMeasurements.push({
        dynamicPressure: [
          row['Ciśnienie dynamiczne 1'],
          row['Ciśnienie dynamiczne 2'],
          row['Ciśnienie dynamiczne 3'],
          row['Ciśnienie dynamiczne 4'],
        ],
        staticPressure: row['Ciśnienie statyczne'],
        temperature: row.Temperatura,
        angle: row.Kąt,
        axisNumber: parseInt(row['Numer osi']),
        pointOnAxis: parseInt(row['Punkt na osi']),
        pipeDiameter: row['Średnica przewodu'],
        pipeWidth: row['Szerokość przewodu'],
        pipeHeight: row['Wysokość przewodu'],
      });
    }

    // find out if we have a rectangular or circular pipe.
    const mode = rows[0]['Przekrój przewodu'] === 'Okrągły';
    setMode(mode);
    if (mode) {
      setPipeDiameter(rows[0]['Średnica przewodu']);
    } else {
      setPipeDimensions([
        rows[0]['Wysokość przewodu'],
        rows[0]['Szerokość przewodu'],
      ]);
    }

    const axisNumber =
      Math.max(...newMeasurements.map(entry => entry.axisNumber)) + 1;
    const pointsOnEachAxis =
      Math.max(...newMeasurements.map(entry => entry.pointOnAxis)) + 1;

    setNumberOfSpigots(axisNumber);
    setNumberOfPoints(pointsOnEachAxis);

    setCurrentMeasurement(newMeasurements[newMeasurements.length - 1]);
    console.log(newMeasurements[newMeasurements.length - 1]);
    setMeasurements(newMeasurements);
    persistStateInInternalStorage(newMeasurements);
  };

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={resetState}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <SelectorBar
          label={t(`flowsScreen:pipeCrossSection`) + ':'}
          selections={[
            t('pipeCrossSectionTypes:ROUND'),
            t('pipeCrossSectionTypes:RECTANGULAR'),
          ]}
          onSelect={(selectedItem: string, _index: number) => {
            // When the pipe cross-section selector is used, we are dealing
            // with a completely new pipe so we need to flush all changes apart
            // from the diameter, width, axes and points settings.
            const newMode = selectedItem !== t('pipeCrossSectionTypes:ROUND');
            setMode(newMode);
            flushChangesAfterPipeSpecsModified(
              newMode,
              pipeDimensions[0],
              pipeDimensions[1],
              pipeDiameter,
            );
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
                flushChangesAfterPipeSpecsModified(
                  mode,
                  height,
                  width,
                  pipeDiameter,
                );
              }}
              label={t(`flowsScreen:height`) + ':'}
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
                flushChangesAfterPipeSpecsModified(
                  mode,
                  height,
                  width,
                  pipeDiameter,
                );
              }}
              label={t(`flowsScreen:width`) + ':'}
            />
          </>
        ) : (
          <NumberInputBar
            placeholder=""
            valueUnit="m"
            value={pipeDiameter}
            onChangeText={text => {
              setPipeDiameter(text);
              flushChangesAfterPipeSpecsModified(
                mode,
                pipeDimensions[0],
                pipeDimensions[1],
                text,
              );
            }}
            label={t(`flowsScreen:pipeDiameter`) + ':'}
          />
        )}
        <NumberInputBar
          placeholder=""
          value={numberOfSpigots.toString()}
          onChangeText={text =>
            setNumberOfSpigots(text === '' ? 0 : parseInt(text))
          }
          label={t(`flowsScreen:numberOfSpigots`) + ':'}
        />
        <NumberInputBar
          placeholder=""
          value={numberOfPoints.toString()}
          onChangeText={text =>
            setNumberOfPoints(text === '' ? 0 : parseInt(text))
          }
          label={t(`flowsScreen:numberOfPoints`) + ':'}
        />
        <SelectorBar
          label={t(`flowsScreen:axisNumber`) + ':'}
          selections={selectionsSpigots}
          rowTextForSelection={(selection: string) => selection}
          selectionToText={(_selection: string) => (currentMeasurement.axisNumber + 1).toString()}
          onSelect={(_selectedItem: string, index: number) => {
            const newAxisNumber = index;

            // Todo: figure out how to save the most recent measurement
            // without having to select a different one in the grid.
            // Currrently the measurement only gets saved when the selector is
            // used to change the selection in the grid
            saveCurrentMeasurement();
            const newMeasurement = { ...currentMeasurement };
            newMeasurement.axisNumber = newAxisNumber;
            loadNewMeasurement(newMeasurement);
          }}
        />
        <SelectorBar
          label={t(`flowsScreen:pointOnAxis`) + ':'}
          selections={selectionsPoints}
          rowTextForSelection={(selection: string) => selection}
          selectionToText={(_selection: string) => (currentMeasurement.pointOnAxis + 1).toString()}
          onSelect={(_selectedItem: string, index: number) => {
            const newPointOnAxis = index;

            saveCurrentMeasurement();
            const newMeasurement = { ...currentMeasurement };
            newMeasurement.pointOnAxis = newPointOnAxis;
            loadNewMeasurement(newMeasurement);
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

            updateSingleFlowMeasurement({ dynamicPressure: newValue });
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 1:'}
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

            updateSingleFlowMeasurement({ dynamicPressure: newValue });
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 2:'}
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

            updateSingleFlowMeasurement({ dynamicPressure: newValue });
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 3:'}
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

            updateSingleFlowMeasurement({ dynamicPressure: newValue });
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 4:'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.temperature}
          onChangeText={text => {
            updateSingleFlowMeasurement({ temperature: text });
          }}
          label={t(`flowsScreen:temperature`) + ':'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.angle}
          onChangeText={text => {
            updateSingleFlowMeasurement({ angle: text });
          }}
          label={t(`flowsScreen:angle`) + ':'}
        />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};

/* Logic for saving and loading the file from external storage as CSV */
export const exportMeasurementsAsCSV = (newMeasurements: SingleFlowMeasurement[]) => {
  // First we store the heading with all global information.
  console.log("Generating CSV contents for Flows Screen...")

  const firstMeasurement = newMeasurements[0];
  var mode = false;
  if (firstMeasurement.pipeDiameter) {
  } else {
    mode = true;
  }

  // figure out the number of axes and points on each axis by taking the
  // maximum over incoming values.
  const axisNumber =
    Math.max(...newMeasurements.map(entry => entry.axisNumber)) + 1;
  const pointsOnEachAxis =
    Math.max(...newMeasurements.map(entry => entry.pointOnAxis)) + 1;

  console.log('Exporting a CSV file: ');
  const csvRows: FlowMeasurementCSVRow[] = [];
  for (const measurement of newMeasurements) {
    csvRows.push({
      'Przekrój przewodu': mode ? 'Prostokątny' : 'Okrągły',
      'Wysokość przewodu': measurement.pipeHeight ? measurement.pipeHeight : "0",
      'Szerokość przewodu': measurement.pipeWidth ? measurement.pipeWidth : "0",
      'Średnica przewodu': measurement.pipeDiameter ? measurement.pipeDiameter : "0",
      'Ilość osi pomiarowych': axisNumber.toString(),
      'Ilość punktów na osi': pointsOnEachAxis.toString(),
      'Numer osi': measurement.axisNumber.toString(),
      'Punkt na osi': measurement.pointOnAxis.toString(),
      'Ciśnienie dynamiczne 1': measurement.dynamicPressure[0],
      'Ciśnienie dynamiczne 2': measurement.dynamicPressure[1],
      'Ciśnienie dynamiczne 3': measurement.dynamicPressure[2],
      'Ciśnienie dynamiczne 4': measurement.dynamicPressure[3],
      'Ciśnienie statyczne': measurement.staticPressure,
      Temperatura: measurement.temperature,
      Kąt: measurement.angle,
    });
  }

  const csvFileContents = FLOWS_SCREEN_CSV_HEADING + jsonToCSV(csvRows);
  console.log(csvFileContents);
  console.log("CSV contents for Flows Screen created successfully...")

  return csvFileContents;
};


export const restoreStateFromCSV = (fileContents: string) => {
  console.log('Restoring state from a CSV file: ');
  console.log(fileContents);
  // First we remove the section header from the file.
  fileContents = fileContents.replace(FLOWS_SCREEN_CSV_HEADING, '');

  const rows = readString(fileContents, { header: true })[
    'data'
  ] as FlowMeasurementCSVRow[];
  const newMeasurements: SingleFlowMeasurement[] = [];

  for (const row of rows) {
    newMeasurements.push({
      dynamicPressure: [
        row['Ciśnienie dynamiczne 1'],
        row['Ciśnienie dynamiczne 2'],
        row['Ciśnienie dynamiczne 3'],
        row['Ciśnienie dynamiczne 4'],
      ],
      staticPressure: row['Ciśnienie statyczne'],
      temperature: row.Temperatura,
      angle: row.Kąt,
      axisNumber: parseInt(row['Numer osi']),
      pointOnAxis: parseInt(row['Punkt na osi']),
      pipeDiameter: row['Średnica przewodu'],
      pipeWidth: row['Szerokość przewodu'],
      pipeHeight: row['Wysokość przewodu'],
    });
  }

  return newMeasurements;
};