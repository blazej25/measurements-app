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


  const compoundExists = (measurement: SingleCompoundMeasurement) => {
    const filtered = measurements.filter(
      (item: SingleCompoundMeasurement) => measurement.compound === item.compound
    );
    return filtered.length > 0;
  }

  const saveCurrentCompound = () => {
    if (compoundExists(currentMeasurement)) {
      const newMeasurements = measurements.filter(
        (item: SingleCompoundMeasurement) =>
          currentMeasurement.compound != item.compound
      )
      newMeasurements.push({ ...currentMeasurement });
      setMeasurements(newMeasurements);
      persistStateInInternalStorage(hourOfCheckAfter, hourOfCheckBefore, newMeasurements);
    } else {
      measurements.push({ ...currentMeasurement });
      persistStateInInternalStorage(hourOfCheckAfter, hourOfCheckBefore, measurements);
      setMeasurements(measurements)
    }
  };

  const changeCurrentCompound = (compound: string) => {
    const newCompound = compound
    const newMeasurement = { ...currentMeasurement };
    newMeasurement.compound = newCompound;

    if (compoundExists(newMeasurement)) {
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

    setCurrentMeasurement({
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
    });

    console.log(currentMeasurement);
  }

  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        if (loadedMeasurements) {
          restoreStateFrom(loadedMeasurements);
        }
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var data = loadedMeasurements as GasAnalyzerCheckData;
    // Extract times and measurements from all data
    console.log("Restoring state from local storage...");
    console.log(JSON.stringify(loadedMeasurements, undefined, 2));
    data = parseDates(data);

    setHourOfCheckAfter(data.timeAfter);
    setHourOfCheckBefore(data.timeBefore);
    setMeasurements(data.measurements);
  };

  const parseDates = (data: GasAnalyzerCheckData) => {
    data.timeBefore = new Date(data.timeBefore);
    data.timeAfter = new Date(data.timeAfter);
    return data;
  };

  const persistStateInInternalStorage = (hourOfCheckAfter: Date, hourOfCheckBefore: Date, measurements: SingleCompoundMeasurement[]) => {
    const allData: GasAnalyzerCheckData = { timeAfter: hourOfCheckAfter, timeBefore: hourOfCheckBefore, measurements: measurements }

    console.log(JSON.stringify(allData, undefined, 2));
    fileSystemService.saveObjectToInternalStorage(
      allData,
      GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME,
    );
  };


  const restoreStateFromCSV = (fileContents: string) => {
    // The state is stored in two parts of a csv file.
    // The first one stores the information collected in the
    // header of the utilities screen, whereas the second one
    // stores the list of measurements that are displayed in the scrollable view.

    console.log('Restoring state from a CSV file: ');
    console.log(fileContents);
    // First we remove the section header from the file.
    fileContents = fileContents.replace(ANALYSER_SCREEN_CSV_HEADING, '');

    const rows = readString(fileContents, { header: true })[
      'data'
    ] as AnalyserCheckCSVRow[];

    const newMeasurements: SingleCompoundMeasurement[] = [];

    for (const row of rows) {
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

    setHourOfCheckBefore(new Date(rows[0]['Godzina sprawdzenia przed']))
    setHourOfCheckAfter(new Date(rows[0]['Godzina sprawdzenia po']))
    setCurrentMeasurement(newMeasurements[newMeasurements.length - 1]);
    setMeasurements(newMeasurements);
    persistStateInInternalStorage(new Date(rows[0]['Godzina sprawdzenia po']), new Date(rows[0]['Godzina sprawdzenia przed']), newMeasurements);
    console.log(newMeasurements[newMeasurements.length - 1]);
  }

  const resetState = () => {
    setCurrentMeasurement({ ...emptyMeasurement })
    setMeasurements([{ ...emptyMeasurement }])
    setHourOfCheckAfter(new Date)
    setHourOfCheckBefore(new Date)
  }
  /* 

      /_/
        \
          \
          OOOOO--/
          /\  /\

      żyrafa

  
    */


  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={resetState}
        fileContentsHandler={restoreStateFromCSV}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <SelectorBar
          label={t('gasAnalyzerScreen:compound')}
          selections={Compounds}
          onSelect={(selectedItem: string, index: number) => {
            saveCurrentCompound();
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
            onPress={() => processingInput()}
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
      'Godzina sprawdzenia przed': hourBefore.toString(),
      'Godzina sprawdzenia po': hourAfter.toString(),
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