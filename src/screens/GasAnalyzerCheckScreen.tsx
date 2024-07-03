import React, { useEffect, useState, useTransition } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HelpAndSettingsGroup } from '../components/HelpAndSettingsGroup';
import { NumberInputBar, OutputBar, SelectorBar, TimeSelector } from '../components/input-bars';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';
import { styles } from '../styles/common-styles';
import { jsonToCSV, readString } from 'react-native-csv';
import { useTranslation } from 'react-i18next';
import FileSystemService from '../services/FileSystemService';
import { NavigationButton } from '../components/buttons';

interface SingleCompoundMeasurement {
  compound: string,
  concentration: string,
  analyzerRange: string,
  readingBeforeAnalyzerZero: string,
  readingBeforeAnalyzerRange: string,
  readingBeforeSystemZero: string,
  readingBeforeSystemRange: string,
  readingAfterSystemZero: string,
  readingAfterSystemRange: string,
  twoPCRange: string,
  zeroEvaluationBefore: string,
  rangeEvaluationBefore: string,
  fivePCRange: string,
  evaluationAfter: string,
}

export interface GasAnalyzerCheckData {
  timeBefore: Date,
  timeAfter: Date,
  measurements: SingleCompoundMeasurement[],
}

export const gasEmptyData = {
  timeBefore: new Date,
  timeAfter: new Date,
  measurements: []
}

interface AnalyserCheckCSVRow {
  'Godzina sprawdzenia przed': string,
  'Godzina sprawdzenia po': string,
  Związek: string,
  'Stężenie butli': string,
  'Zakres analizatora': string,
  'Odczyt przed analizator zero': string,
  'Odczyt przed analizator zakres': string,
  'Odczyt przed system zero': string,
  'Odczyt przed system zakres': string,
  'Odczyt po system zero': string,
  'Odczyt po system zakres': string,
  '2% zakresu': string,
  'Sprawdzenie zera przed': string,
  'Sprawdzenie zakresu przed': string,
  '5% zakresu': string,
  'Sprawdzenie po': string
}

const Compounds: string[] = [
  'O2',
  'CO2',
  'SO2',
  'NO',
  'CO',
  'C3H6',
  'N2O',
]

export const GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME = 'GasAnalyzerCheck.txt'
export const ANALYSER_SCREEN_CSV_HEADING = 'Sprawdzenie analizatora gazów\n'

export const GasAnalyzerScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const fileSystemService = new FileSystemService();

  const emptyMeasurement: SingleCompoundMeasurement = {
    compound: Compounds[0],
    concentration: '',
    analyzerRange: '',
    readingBeforeAnalyzerZero: '',
    readingBeforeAnalyzerRange: '',
    readingBeforeSystemZero: '',
    readingBeforeSystemRange: '',
    readingAfterSystemZero: '',
    readingAfterSystemRange: '',
    twoPCRange: '',
    fivePCRange: '',
    zeroEvaluationBefore: '',
    rangeEvaluationBefore: '',
    evaluationAfter: ''
  }

  const [currentMeasurement, setCurrentMeasurement] = useState(emptyMeasurement);
  const [measurements, setMeasurements] = useState([emptyMeasurement]);
  const [hourOfCheckBefore, setHourOfCheckBefore] = useState(new Date);
  const [hourOfCheckAfter, setHourOfCheckAfter] = useState(new Date);


  const compoundExists = (compound: string) => {
    const filtered = measurements.filter(
      (item: SingleCompoundMeasurement) => compound === item.compound
    );
    return filtered.length > 0;
  }

  const log_enabled = true;
  const logger = (message: string) => {
    if (log_enabled) {
      console.log(message)
    }
  }

  const saveMeasurement = (measurement: SingleCompoundMeasurement) => {

    logger("Saving single gas analyzer measurement:")
    logger(`${JSON.stringify(measurement, undefined, 2)}`)
    logger(`Measurements before saving: \n${JSON.stringify(measurements, undefined, 2)}`)
    if (compoundExists(measurement.compound)) {
      // Remove the old measurement for this compound
      const newMeasurements = measurements.filter(
        (item: SingleCompoundMeasurement) =>
          measurement.compound !== item.compound
      )
      logger(`Measurements after filtering out old measurement: \n${JSON.stringify(newMeasurements, undefined, 2)}`)

      newMeasurements.push({ ...measurement });
      logger(`Measurements after adding the new measurement: \n${JSON.stringify(newMeasurements, undefined, 2)}`)

      // measurements
      setMeasurements(newMeasurements);
      // measurements = newMeasurement
      persistStateInInternalStorage(hourOfCheckAfter, hourOfCheckBefore, newMeasurements);
    } else {
      measurements.push({ ...measurement });
      persistStateInInternalStorage(hourOfCheckAfter, hourOfCheckBefore, measurements);
      setMeasurements(measurements)
    }
  };

  const changeCurrentCompound = (compound: string) => {
    const newCompound = compound
    const newMeasurement = { ...currentMeasurement };
    newMeasurement.compound = newCompound;

    if (compoundExists(newMeasurement.compound)) {
      const loadedCompound = measurements.filter(
        (item: SingleCompoundMeasurement) =>
          newMeasurement.compound === item.compound
      )[0];
      setCurrentMeasurement({ ...loadedCompound });
    } else {
      setCurrentMeasurement({
        ...emptyMeasurement,
        compound: newMeasurement.compound,
      });
    }
  };

  const processingInput = () => {
    const fivePercent = currentMeasurement.analyzerRange === '' ? 0 : parseInt(currentMeasurement.analyzerRange) * 0.05;
    const twoPercent = currentMeasurement.analyzerRange === '' ? 0 : parseInt(currentMeasurement.analyzerRange) * 0.02;
    const beforeSystemZero = currentMeasurement.readingBeforeSystemZero === '' ? 0 : parseFloat(currentMeasurement.readingBeforeSystemZero);
    const beforeSystemRange = currentMeasurement.readingBeforeSystemRange === '' ? 0 : Math.abs(parseFloat(currentMeasurement.readingBeforeSystemRange) - parseInt(currentMeasurement.concentration));
    const afterSystemZero = currentMeasurement.readingAfterSystemZero === '' ? 0 : parseFloat(currentMeasurement.readingAfterSystemZero);
    const afterSystemRange = currentMeasurement.readingAfterSystemRange === '' ? 0 : Math.abs(parseFloat(currentMeasurement.readingAfterSystemRange) - parseInt(currentMeasurement.concentration));

    var evaluationZeroAfter = 0;
    var evaluationRangeAfter = 0;

    if (afterSystemZero < twoPercent) {
      evaluationZeroAfter = 0;
    } else if (afterSystemZero < fivePercent) {
      evaluationZeroAfter = 1;
    } else {
      evaluationZeroAfter = 2;
    }

    if (afterSystemRange < twoPercent) {
      evaluationRangeAfter = 0;
    } else if (afterSystemRange < fivePercent) {
      evaluationRangeAfter = 1;
    } else {
      evaluationRangeAfter = 2;
    }

    const newMeasurement = {
      ...currentMeasurement,
      twoPCRange: twoPercent.toFixed(2),
      fivePCRange: fivePercent.toFixed(2),
      zeroEvaluationBefore:
        beforeSystemZero < twoPercent ? 'OK' : 'Adjustacja zera',
      rangeEvaluationBefore:
        beforeSystemRange < twoPercent ? 'OK' : 'Adjustacja zakresu',
      evaluationAfter:
        evaluationZeroAfter + evaluationRangeAfter === 0
          ? 'OK'
          : evaluationZeroAfter + evaluationRangeAfter === 1 || 2
            ? 'Korekta o dryft'
            : 'Odrzucenie pomiaru',
    }

    setCurrentMeasurement(newMeasurement);
    console.log(newMeasurement);
    return newMeasurement;
  }

  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        if (loadedMeasurements) {
          console.log(loadedMeasurements);
          if (loadedMeasurements) {
            restoreStateFrom(loadedMeasurements);
          }
        }
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var data = loadedMeasurements as GasAnalyzerCheckData;
    // Extract times and measurements from all data
    console.log("Restoring Gas Analyzer check state from local storage...");
    console.log(JSON.stringify(loadedMeasurements, undefined, 2));
    data = parseDates(data);

    setHourOfCheckAfter(data.timeAfter);
    setHourOfCheckBefore(data.timeBefore);
    setMeasurements(data.measurements);
    setCurrentMeasurement(data.measurements[0]);
  };

  const parseDates = (data: GasAnalyzerCheckData) => {
    data.timeBefore = new Date(data.timeBefore);
    data.timeAfter = new Date(data.timeAfter);
    return data;
  };

  const persistStateInInternalStorage = (hourOfCheckAfter: Date, hourOfCheckBefore: Date, persisted_measurements: SingleCompoundMeasurement[]) => {
    const allData: GasAnalyzerCheckData = { timeAfter: hourOfCheckAfter, timeBefore: hourOfCheckBefore, measurements: persisted_measurements }

    fileSystemService.saveObjectToInternalStorage(
      allData,
      GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const resetState = () => {
    setCurrentMeasurement({ ...emptyMeasurement })
    setMeasurements([emptyMeasurement])
    setHourOfCheckAfter(new Date)
    setHourOfCheckBefore(new Date)
    persistStateInInternalStorage(new Date, new Date, [emptyMeasurement])
  }
  /*

        ___/
         /
        /
        \
         \
           \
           OOOOO--/
           /\  /\
          /  \/  \
         /   /\   \

      Tallneck


    */


  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={resetState}
        reloadScreen={loadMeasurements}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <SelectorBar
          label={t('gasAnalyzerScreen:compound')}
          selections={Compounds}
          onSelect={(selectedItem: string, index: number) => {
            saveMeasurement(currentMeasurement)
            changeCurrentCompound(selectedItem);
          }}
        />
        <TimeSelector
          timeLabel={t('gasAnalyzerScreen:timeBefore')}
          date={hourOfCheckBefore}
          setDate={date => { setHourOfCheckBefore(date); persistStateInInternalStorage(hourOfCheckAfter, date, measurements); }}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.concentration}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, concentration: text });
          }}
          label={t('gasAnalyzerScreen:tankConcentration')}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.analyzerRange}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, analyzerRange: text });
          }}
          label={t('gasAnalyzerScreen:analyzerRange')}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeAnalyzerZero}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, readingBeforeAnalyzerZero: text });
          }}
          label={t('gasAnalyzerScreen:readingBeforeAnalyzerZero')}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeAnalyzerRange}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, readingBeforeAnalyzerRange: text });
          }}
          label={t('gasAnalyzerScreen:readingBeforeAnalyzerRange')}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeSystemZero}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, readingBeforeSystemZero: text });
          }}
          label={t('gasAnalyzerScreen:readingBeforeSystemZero')}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeSystemRange}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, readingBeforeSystemRange: text });
          }}
          label={t('gasAnalyzerScreen:readingBeforeSystemRange')}
        />
        <TimeSelector
          timeLabel={t('gasAnalyzerScreen:timeAfter')}
          date={hourOfCheckAfter}
          setDate={date => setHourOfCheckAfter(date)}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingAfterSystemZero}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, readingAfterSystemZero: text });
          }}
          label={t('gasAnalyzerScreen:readingAfterSystemZero')}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingAfterSystemRange}
          onChangeText={text => {
            setCurrentMeasurement({ ...currentMeasurement, readingAfterSystemRange: text });
          }}
          label={t('gasAnalyzerScreen:readingAfterSystemRange')}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 5,
          }}>
          <TouchableOpacity
            style={styles.roundedButton1}
            onPress={() => {
              const new_measurement = processingInput();
              saveMeasurement(new_measurement);
            }}
          >
            <Text style={styles.buttonText1}>{t('gasAnalyzerScreen:processData')}</Text>
          </TouchableOpacity>
        </View>
        <OutputBar
          label={t('gasAnalyzerScreen:twoPCRange')}
          output={currentMeasurement.twoPCRange}
        />
        <OutputBar
          label={t('gasAnalyzerScreen:fivePCRange')}
          output={currentMeasurement.fivePCRange}
        />
        <OutputBar
          label={t('gasAnalyzerScreen:zeroEvaluationBefore')}
          output={currentMeasurement.zeroEvaluationBefore}
        />
        <OutputBar
          label={t('gasAnalyzerScreen:rangeEvaluationBefore')}
          output={currentMeasurement.rangeEvaluationBefore}
        />
        <OutputBar
          label={t('gasAnalyzerScreen:evaluationAfter')}
          output={currentMeasurement.evaluationAfter}
        />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};

export const exportMeasurementsAsCSV = (newMeasurements: SingleCompoundMeasurement[], hourBefore: Date, hourAfter: Date) => {
  console.log('Start gas CSV');
  const csvRows: AnalyserCheckCSVRow[] = [];
  for (const measurement of newMeasurements) {
    csvRows.push({
      'Godzina sprawdzenia przed': hourBefore ? hourBefore.toString() : (new Date()).toString(),
      'Godzina sprawdzenia po': hourAfter ? hourAfter.toString() : (new Date()).toString(),
      Związek: measurement.compound,
      'Stężenie butli': measurement.concentration,
      'Zakres analizatora': measurement.analyzerRange,
      'Odczyt przed analizator zero': measurement.readingBeforeAnalyzerZero,
      'Odczyt przed analizator zakres': measurement.readingBeforeAnalyzerRange,
      'Odczyt przed system zero': measurement.readingBeforeSystemZero,
      'Odczyt przed system zakres': measurement.readingBeforeSystemRange,
      'Odczyt po system zero': measurement.readingAfterSystemZero,
      'Odczyt po system zakres': measurement.readingAfterSystemRange,
      '2% zakresu': measurement.twoPCRange,
      'Sprawdzenie zera przed': measurement.zeroEvaluationBefore,
      'Sprawdzenie zakresu przed': measurement.rangeEvaluationBefore,
      '5% zakresu': measurement.fivePCRange,
      'Sprawdzenie po': measurement.evaluationAfter
    });
  }

  const csvFileContents = ANALYSER_SCREEN_CSV_HEADING + jsonToCSV(csvRows);
  console.log('Exporting a CSV file: ');
  console.log(csvFileContents);
  console.log('End gas CSV');
  return csvFileContents;
};


export const restoreStateFromCSV = (fileContents: string) => {
  console.log('Restoring state from a CSV file: ');
  console.log(fileContents);
  // First we remove the section header from the file.
  fileContents = fileContents.replace(ANALYSER_SCREEN_CSV_HEADING, '');

  const rows = readString(fileContents, { header: true })[
    'data'
  ] as AnalyserCheckCSVRow[];

  const newMeasurements: SingleCompoundMeasurement[] = [];


  for (const row of rows) {
    console.log("parsing csv row:")
    console.log(row);
    newMeasurements.push({
      compound: row['Związek'],
      concentration: row['Stężenie butli'],
      analyzerRange: row['Zakres analizatora'],
      readingBeforeAnalyzerZero: row['Odczyt przed analizator zero'],
      readingBeforeAnalyzerRange: row['Odczyt przed analizator zakres'],
      readingBeforeSystemZero: row['Odczyt przed system zero'],
      readingBeforeSystemRange: row['Odczyt przed system zakres'],
      readingAfterSystemZero: row['Odczyt po system zero'],
      readingAfterSystemRange: row['Odczyt po system zakres'],
      twoPCRange: row['2% zakresu'],
      zeroEvaluationBefore: row['Sprawdzenie zera przed'],
      rangeEvaluationBefore: row['Sprawdzenie zakresu przed'],
      fivePCRange: row['5% zakresu'],
      evaluationAfter: row['Sprawdzenie po'],
    });
  }

  console.log("Parsed gas analyzer measurements:")
  console.log(newMeasurements);

  const data: GasAnalyzerCheckData = {
    timeBefore: rows[0] ? new Date(rows[0]['Godzina sprawdzenia przed']) : new Date(),
    timeAfter: rows[0] ? new Date(rows[0]['Godzina sprawdzenia po']) : new Date(),
    measurements: newMeasurements
  }
  return data;
}
