import React, {useEffect, useMemo, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {
  MeasurementPointDisplayDropdown,
  NumberInputBar,
  OutputBar,
  SelectorBar,
} from '../components/input-bars';
import {jsonToCSV, readString} from 'react-native-csv';
import {defaultGap, styles} from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import FileSystemService from '../services/FileSystemService';
import RectangularPipeCalculationEngine from '../calculations/RectangularPipeCalculationEngine';
import CircularPipeCalculationEngine from '../calculations/CircularPipeCalculationEngine';

export interface SingleFlowMeasurement {
  dynamicPressure: string[];
  staticPressure: string;
  temperature: string;
  angle: string;
  axisNumber: number;
  pointOnAxis: number;
  pointPosition: number;
  pipeDiameter?: string;
  pipeWidth?: string;
  pipeHeight?: string;
  useAlternativePointPositionCalculationMethod?: boolean;
  // We also need to keep track of the choice of the number of axes and positions
  // on each axis.
  numberOfAxes: number;
  numberOfPointsOnEachAxis: number;
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
  'Położenie punktu': string;
  'Ciśnienie dynamiczne 1': string;
  'Ciśnienie dynamiczne 2': string;
  'Ciśnienie dynamiczne 3': string;
  'Ciśnienie dynamiczne 4': string;
  'Ciśnienie statyczne': string;
  Temperatura: string;
  Kąt: string;
}

export const initialState: SingleFlowMeasurement = {
  dynamicPressure: ['', '', '', ''],
  staticPressure: '',
  temperature: '',
  angle: '',
  axisNumber: 0,
  pointOnAxis: 0,
  pointPosition: 0,
  numberOfAxes: 1,
  numberOfPointsOnEachAxis: 1,
};

export const FLOWS_INTERNAL_STORAGE_FILE_NAME = 'flows.txt';
export const FLOWS_SCREEN_CSV_HEADING = 'Przepływy\n';

export const FlowsScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  const fileSystemService = new FileSystemService();

  // We represent numerical values as strings so that they can be entered using
  // the number input bars.
  const [numberOfSpigots, setNumberOfSpigots] = useState(1);
  const emptyPointPositions: number[] = [];
  const [pointPositions, setPointPositions] = useState(emptyPointPositions);
  const [numberOfPoints, setNumberOfPoints] = useState(1);
  const [pipeDimensions, setPipeDimensions] = useState(['', '']);
  const [pipeDiameter, setPipeDiameter] = useState('');
  const [
    useAlternativePointPositionCalculationMethod,
    setUseAlternativePointPositionCalculationMethod,
  ] = useState(false);
  // TODO: add a proper enum
  const roundMode = false;
  const [useRectangularPipe, setUseRectangularPipe] = useState(roundMode);
  const [currentMeasurement, setCurrentMeasurement] = useState({
    ...initialState,
  });

  // Stores all measurements for the axes and points on those axes.
  const [measurements, setMeasurements] = useState([{...initialState}]);

  const resetState = () => {
    setNumberOfSpigots(1);
    setNumberOfPoints(1);
    setPipeDimensions(['', '']);
    setPipeDiameter('');
    setUseRectangularPipe(roundMode);
    setCurrentMeasurement({...initialState});
    setMeasurements([{...initialState}]);
    persistStateInInternalStorage([{...initialState}]);
    setPointPositions([]);
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
        if (loadedMeasurements) {
          restoreStateFrom(loadedMeasurements);
        }
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
      setUseRectangularPipe(false);
      setPipeDiameter(firstMeasurement.pipeDiameter);
      // We need to cast here to make the types match up.
      setUseAlternativePointPositionCalculationMethod(
        firstMeasurement.useAlternativePointPositionCalculationMethod
          ? true
          : false,
      );
      performPointMeasurementCalculation(
        false,
        firstMeasurement.useAlternativePointPositionCalculationMethod
          ? true
          : false,
        '',
        '',
        firstMeasurement.pipeDiameter,
      );
    } else {
      setUseRectangularPipe(true);
      setPipeDimensions([
        firstMeasurement.pipeHeight as string,
        firstMeasurement.pipeWidth as string,
      ]);
      performPointMeasurementCalculation(
        true,
        false,
        firstMeasurement.pipeHeight as string,
        firstMeasurement.pipeWidth as string,
        '',
      );
    }

    const axisNumber = firstMeasurement.numberOfAxes
      ? firstMeasurement.numberOfAxes
      : 1;
    const pointsOnEachAxis = firstMeasurement.numberOfPointsOnEachAxis
      ? firstMeasurement.numberOfPointsOnEachAxis
      : 1;

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
    useRectangularPipe: boolean,
    useAlternativePointPositionCalculationMethod: boolean,
    height: string,
    width: string,
    diameter: string,
  ) => {
    // Change the state of the currently displayed measurement.
    const newState = useRectangularPipe
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
    performPointMeasurementCalculation(
      useRectangularPipe,
      useAlternativePointPositionCalculationMethod,
      height,
      width,
      diameter,
    );
  };


  const updatePointMeasurementCalculation = (
    useRectangularPipe: boolean,
    useAlternativePointPositionCalculationMethod: boolean,
    height: string,
    width: string,
    diameter: string,
    pointCount: number,
    axisCount: number,
  ) => {
    if (useRectangularPipe) {
      const calculationEngine = new RectangularPipeCalculationEngine(
        parseInt(height),
        parseInt(width),
      );
      // TODO: do the rectangle calculation here
    } else {
      const calculationEngine = new CircularPipeCalculationEngine(
        parseFloat(diameter),
      );
      if (useAlternativePointPositionCalculationMethod) {
        setPointPositions(
          calculationEngine.findMeasurementPointPositionsAlternativeMethod(
            pointCount,
            axisCount,
          ),
        );
      } else {
        setPointPositions(
          calculationEngine.findMeasurementPointPositionsBasicMethod(
            pointCount,
            axisCount,
          ),
        );
      }
    }
  };
  const performPointMeasurementCalculation = (
    useRectangularPipe: boolean,
    useAlternativePointPositionCalculationMethod: boolean,
    height: string,
    width: string,
    diameter: string,
  ) => {
    if (useRectangularPipe) {
      const calculationEngine = new RectangularPipeCalculationEngine(
        parseInt(height),
        parseInt(width),
      );
      const measurementConstraints =
        calculationEngine.determineMeasurementConstraints();
    } else {
      const calculationEngine = new CircularPipeCalculationEngine(
        parseFloat(diameter),
      );
      const measurementConstraints =
        calculationEngine.determineMeasurementConstraints();
      // Pre-fill the number of axes and measurement points based on the calculation
      const pointCount = measurementConstraints.minimumMeasurementPointCount;
      const axisCount = measurementConstraints.minimumMeasurementAxisCount;
      setNumberOfPoints(pointCount);
      setNumberOfSpigots(axisCount);
      if (useAlternativePointPositionCalculationMethod) {
        setPointPositions(
          calculationEngine.findMeasurementPointPositionsAlternativeMethod(
            pointCount,
            axisCount,
          ),
        );
      } else {
        setPointPositions(
          calculationEngine.findMeasurementPointPositionsBasicMethod(
            pointCount,
            axisCount,
          ),
        );
      }
    }
  };

  /* State transitions for the UI. */
  const saveCurrentMeasurement = () => {
    // Save the current measurement
    if (measurementExists(currentMeasurement)) {
      // Append the point position information to the measurement
      // Remove the old version of the measurement for the current selection of axis and point on the axis
      const newMeasurements: SingleFlowMeasurement[] = measurements.filter(
        (item: SingleFlowMeasurement) =>
          currentMeasurement.axisNumber != item.axisNumber ||
          currentMeasurement.pointOnAxis != item.pointOnAxis,
      );
      newMeasurements.push({
        ...currentMeasurement,
        pointPosition: pointPositions[currentMeasurement.pointOnAxis],
        numberOfPointsOnEachAxis: numberOfPoints,
        numberOfAxes: numberOfSpigots,
        useAlternativePointPositionCalculationMethod:
          useAlternativePointPositionCalculationMethod,
      });
      setMeasurements(newMeasurements);
      persistStateInInternalStorage(newMeasurements);
      // Return the new list of measurements for composing in other functions.
      return newMeasurements;
    } else {
      measurements.push({
        ...currentMeasurement,
        pointPosition: pointPositions[currentMeasurement.pointOnAxis],
        numberOfPointsOnEachAxis: numberOfPoints,
        numberOfAxes: numberOfSpigots,
        useAlternativePointPositionCalculationMethod:
          useAlternativePointPositionCalculationMethod,
      });
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
      setCurrentMeasurement({...loadedMeasurement});
    } else {
      // Here we are adding an empty measurement.
      // if we are in rectangular mode, TODO: improve engineering here.
      const newState = useRectangularPipe
        ? {
            ...initialState,
            axisNumber: newMeasurement.axisNumber,
            pointOnAxis: newMeasurement.pointOnAxis,
            numberOfSpigots: numberOfSpigots,
            numberOfPoints: numberOfPoints,
            pipeWidth: pipeDimensions[1],
            pipeHeight: pipeDimensions[0],
          }
        : {
            ...initialState,
            axisNumber: newMeasurement.axisNumber,
            pointOnAxis: newMeasurement.pointOnAxis,
            numberOfSpigots: numberOfSpigots,
            numberOfPoints: numberOfPoints,
            pipeDiameter: pipeDiameter,
          };
      setCurrentMeasurement(newState);
    }
  };

  const IMAGE_WIDTH = 400;
  const IMAGE_HEIGHT = 300;

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={resetState}
        reloadScreen={loadMeasurements}
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
            setUseRectangularPipe(newMode);
            flushChangesAfterPipeSpecsModified(
              newMode,
              useAlternativePointPositionCalculationMethod,
              pipeDimensions[0],
              pipeDimensions[1],
              pipeDiameter,
            );
          }}
        />
        {useRectangularPipe ? (
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
                  useRectangularPipe,
                  useAlternativePointPositionCalculationMethod,
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
                  useRectangularPipe,
                  useAlternativePointPositionCalculationMethod,
                  height,
                  width,
                  pipeDiameter,
                );
              }}
              label={t(`flowsScreen:width`) + ':'}
            />
          </>
        ) : (
          <>
            <NumberInputBar
              placeholder=""
              valueUnit="m"
              value={pipeDiameter}
              onChangeText={text => {
                setPipeDiameter(text);
                flushChangesAfterPipeSpecsModified(
                  useRectangularPipe,
                  useAlternativePointPositionCalculationMethod,
                  pipeDimensions[0],
                  pipeDimensions[1],
                  text,
                );
              }}
              label={t(`flowsScreen:pipeDiameter`) + ':'}
            />
            <SelectorBar
              label={t(`flowsScreen:measurementPointLocationMethod`) + ':'}
              maxWidthOverride={200}
              selections={[
                t('measurementPointLocationMethod:BASIC'),
                t('measurementPointLocationMethod:ALTERNATIVE'),
              ]}
              onSelect={(selectedItem: string, _index: number) => {
                // When the pipe cross-section selector is used, we are dealing
                // with a completely new pipe so we need to flush all changes apart
                // from the diameter, width, axes and points settings.
                const newMode =
                  selectedItem !== t('measurementPointLocationMethod:BASIC');
                setUseAlternativePointPositionCalculationMethod(newMode);
              }}
            />
          </>
        )}
        <View style={{width: 0.8, height: IMAGE_HEIGHT}}>
          {useAlternativePointPositionCalculationMethod ? (
            <Image
              source={require('../assets/circular-pipe-diagram-2.png')}
              style={{
                flex: 1,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                resizeMode: 'contain',
              }}
            />
          ) : (
            <Image
              source={require('../assets/circular-pipe-diagram-1.png')}
              style={{
                flex: 1,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
        <MeasurementPointDisplayDropdown
          label={t(`flowsScreen:pointPositions`) + ':'}
          pointPositionList={pointPositions}
        />
        <NumberInputBar
          placeholder=""
          value={numberOfSpigots.toString()}
          onChangeText={text => {
            const newNumberOfSpigots = text === '' ? 0 : parseInt(text);
            setNumberOfSpigots(newNumberOfSpigots);
            updatePointMeasurementCalculation(
              useRectangularPipe,
              useAlternativePointPositionCalculationMethod,
              pipeDimensions[0],
              pipeDimensions[1],
              pipeDiameter,
              numberOfPoints,
              newNumberOfSpigots
            );
          }}
          label={t(`flowsScreen:numberOfSpigots`) + ':'}
        />
        <NumberInputBar
          placeholder=""
          value={numberOfPoints.toString()}
          onChangeText={text => {
            const newNumberOfPoints = text === '' ? 0 : parseInt(text);
            setNumberOfPoints(newNumberOfPoints)
            updatePointMeasurementCalculation(
              useRectangularPipe,
              useAlternativePointPositionCalculationMethod,
              pipeDimensions[0],
              pipeDimensions[1],
              pipeDiameter,
              newNumberOfPoints,
              numberOfSpigots
            );
          }
          }
          label={t(`flowsScreen:numberOfPoints`) + ':'}
        />
        <SelectorBar
          label={t(`flowsScreen:axisNumber`) + ':'}
          selections={selectionsSpigots}
          rowTextForSelection={(selection: string) => selection}
          selectionToText={(_selection: string) =>
            (currentMeasurement.axisNumber + 1).toString()
          }
          onSelect={(_selectedItem: string, index: number) => {
            const newAxisNumber = index;

            // Todo: figure out how to save the most recent measurement
            // without having to select a different one in the grid.
            // Currrently the measurement only gets saved when the selector is
            // used to change the selection in the grid
            saveCurrentMeasurement();
            const newMeasurement = {...currentMeasurement};
            newMeasurement.axisNumber = newAxisNumber;
            loadNewMeasurement(newMeasurement);
          }}
        />
        <SelectorBar
          label={t(`flowsScreen:pointOnAxis`) + ':'}
          selections={selectionsPoints}
          rowTextForSelection={(selection: string) => selection}
          selectionToText={(_selection: string) =>
            (currentMeasurement.pointOnAxis + 1).toString()
          }
          onSelect={(_selectedItem: string, index: number) => {
            const newPointOnAxis = index;

            saveCurrentMeasurement();
            const newMeasurement = {...currentMeasurement};
            newMeasurement.pointOnAxis = newPointOnAxis;
            loadNewMeasurement(newMeasurement);
          }}
        />
        <OutputBar
          label={t('flowsScreen:pointPosition') + ':'}
          output={
            String(
              pointPositions[currentMeasurement.pointOnAxis]
                ? pointPositions[currentMeasurement.pointOnAxis].toFixed(3)
                : 0,
            ) + ' m'
          }
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
          label={t(`flowsScreen:dynamicPressure`) + ' 1:'}
        />
        <NumberInputBar
          placeholder=""
          valueUnit="Pa"
          value={currentMeasurement.dynamicPressure[1]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0];
            const value1 = text;
            const value2 = currentMeasurement.dynamicPressure[2];
            const value3 = currentMeasurement.dynamicPressure[3];
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 2:'}
        />
        <NumberInputBar
          placeholder=""
          valueUnit="Pa"
          value={currentMeasurement.dynamicPressure[2]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0];
            const value1 = currentMeasurement.dynamicPressure[1];
            const value2 = text;
            const value3 = currentMeasurement.dynamicPressure[3];
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 3:'}
        />
        <NumberInputBar
          placeholder=""
          valueUnit="Pa"
          value={currentMeasurement.dynamicPressure[3]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0];
            const value1 = currentMeasurement.dynamicPressure[1];
            const value2 = currentMeasurement.dynamicPressure[2];
            const value3 = text;
            const newValue = [value0, value1, value2, value3];

            updateSingleFlowMeasurement({dynamicPressure: newValue});
          }}
          label={t(`flowsScreen:dynamicPressure`) + ' 4:'}
        />
        <NumberInputBar
          placeholder=""
          valueUnit="℃"
          value={currentMeasurement.temperature}
          onChangeText={text => {
            updateSingleFlowMeasurement({temperature: text});
          }}
          label={t(`flowsScreen:temperature`) + ':'}
        />
        <NumberInputBar
          placeholder=""
          valueUnit="°"
          value={currentMeasurement.angle}
          onChangeText={text => {
            updateSingleFlowMeasurement({angle: text});
          }}
          label={t(`flowsScreen:angle`) + ':'}
        />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};

/* Logic for saving and loading the file from external storage as CSV */
export const exportMeasurementsAsCSV = (
  newMeasurements: SingleFlowMeasurement[],
) => {
  // First we store the heading with all global information.
  console.log('Generating CSV contents for Flows Screen...');

  const firstMeasurement = newMeasurements[0];
  var mode = false;
  if (firstMeasurement.pipeDiameter) {
  } else {
    mode = true;
  }

  console.log('Exporting a CSV file: ');
  const csvRows: FlowMeasurementCSVRow[] = [];
  for (const measurement of newMeasurements) {
    console.log(measurement);
    csvRows.push({
      'Przekrój przewodu': mode ? 'Prostokątny' : 'Okrągły',
      'Wysokość przewodu': measurement.pipeHeight
        ? measurement.pipeHeight
        : '0',
      'Szerokość przewodu': measurement.pipeWidth ? measurement.pipeWidth : '0',
      'Średnica przewodu': measurement.pipeDiameter
        ? measurement.pipeDiameter
        : '0',
      'Ilość osi pomiarowych': String(measurement.numberOfAxes),
      'Ilość punktów na osi': String(measurement.numberOfPointsOnEachAxis),
      'Numer osi': measurement.axisNumber.toString(),
      'Punkt na osi': measurement.pointOnAxis.toString(),
      'Położenie punktu': measurement.pointPosition.toString(),
      'Ciśnienie dynamiczne 1': ('' + measurement.dynamicPressure[0]).trim(),
      'Ciśnienie dynamiczne 2': ('' + measurement.dynamicPressure[1]).trim(),
      'Ciśnienie dynamiczne 3': ('' + measurement.dynamicPressure[2]).trim(),
      'Ciśnienie dynamiczne 4': ('' + measurement.dynamicPressure[3]).trim(),
      'Ciśnienie statyczne': ('' + measurement.staticPressure).trim(),
      Temperatura: ('' + measurement.temperature).trim(),
      Kąt: measurement.angle.trim(),
    });
  }

  const csvFileContents = FLOWS_SCREEN_CSV_HEADING + jsonToCSV(csvRows);
  console.log(csvFileContents);
  console.log('CSV contents for Flows Screen created successfully...');

  return csvFileContents;
};

export const restoreStateFromCSV = (fileContents: string) => {
  console.log('Restoring state from a CSV file: ');
  console.log(fileContents);
  // First we remove the section header from the file.
  fileContents = fileContents.replace(FLOWS_SCREEN_CSV_HEADING, '');

  const rows = readString(fileContents, {header: true})[
    'data'
  ] as FlowMeasurementCSVRow[];
  const newMeasurements: SingleFlowMeasurement[] = [];

  for (const row of rows) {
    newMeasurements.push({
      dynamicPressure: [
        ('' + row['Ciśnienie dynamiczne 1']).trim(),
        ('' + row['Ciśnienie dynamiczne 2']).trim(),
        ('' + row['Ciśnienie dynamiczne 3']).trim(),
        ('' + row['Ciśnienie dynamiczne 4']).trim(),
      ],
      staticPressure: ('' + row['Ciśnienie statyczne']).trim(),
      temperature: ('' + row.Temperatura).trim(),
      angle: row.Kąt,
      axisNumber: parseInt(('' + row['Numer osi']).trim()),
      pointOnAxis: parseInt(('' + row['Punkt na osi']).trim()),
      pointPosition: parseInt(('' + row['Położenie punktu']).trim()),
      pipeDiameter: ('' + row['Średnica przewodu']).trim(),
      pipeWidth: ('' + row['Szerokość przewodu']).trim(),
      pipeHeight: ('' + row['Wysokość przewodu']).trim(),
      numberOfAxes: parseInt(('' + row['Ilość osi pomiarowych']).trim()),
      numberOfPointsOnEachAxis: parseInt(
        ('' + row['Ilość punktów na osi']).trim(),
      ),
    });
  }

  return newMeasurements;
};
