import React, { useEffect, useState, useTransition } from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {NumberInputBar, OutputBar, SelectorBar, TimeSelector} from '../components/input-bars';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {styles} from '../styles/common-styles';
import {jsonToCSV, readString} from 'react-native-csv';
import { useTranslation } from 'react-i18next';
import FileSystemService from '../services/FileSystemService';

interface SingleCompoundMeasurement {
  compound: string,
  concentration: string,
  analiserRange: string,
  readingBeforeAnalisatorZero: string, 
  readingBeforeAnalisatorRange: string,
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

interface AllData {
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

const INTERNAL_STORAGE_FILE_NAME = 'GasAnalyzerCheck.txt'
const ANALYSER_SCREEN_CSV_HEADING = 'Sprawdzenie analizatora gazów\n'

export const GasAnalyzerScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  const fileSystemService = new FileSystemService();

  const emptyMeasurement: SingleCompoundMeasurement = {
    compound: Compounds[0],
    concentration: '',
    analiserRange: '',
    readingBeforeAnalisatorZero: '',
    readingBeforeAnalisatorRange: '',
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
      newMeasurements.push({...currentMeasurement});
      setMeasurements(newMeasurements);
      persistStateInInternalStorage(hourOfCheckAfter, hourOfCheckBefore, newMeasurements);
    } else {
      measurements.push({...currentMeasurement});
      persistStateInInternalStorage(hourOfCheckAfter, hourOfCheckBefore, measurements);
      setMeasurements(measurements)
    }
  };

  const changeCurrentCompound = (compound: string) => {
    const newCompound = compound
    const newMeasurement = {...currentMeasurement};
    newMeasurement.compound = newCompound;

    if (compoundExists(newMeasurement)) {
      const loadedCompound = measurements.filter(
        (item: SingleCompoundMeasurement) =>
          newMeasurement.compound === item.compound
      )[0];
      setCurrentMeasurement({...loadedCompound});
    } else {
      setCurrentMeasurement({
        ...emptyMeasurement,
        compound: newMeasurement.compound,
      });
    }
  };

  const processingInput = () => {
    const fivePercent = currentMeasurement.analiserRange === '' ? 0 : parseInt(currentMeasurement.analiserRange) * 0.05;
    const twoPercent = currentMeasurement.analiserRange === '' ? 0 : parseInt(currentMeasurement.analiserRange) * 0.02;
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
      .loadJSONFromInternalStorage(INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        if (loadedMeasurements) {
          restoreStateFrom(loadedMeasurements);
        }
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var data = loadedMeasurements as AllData;
    // Extract times and measurements from all data
    data = parseDates(data);

    setHourOfCheckAfter(data.timeAfter);
    setHourOfCheckBefore(data.timeBefore);
    setMeasurements(data.measurements);
  };

  const parseDates = (data: AllData) => {
    data.timeBefore = new Date(data.timeBefore);
    data.timeAfter = new Date(data.timeAfter);
    return data;
  };

  const persistStateInInternalStorage = (hourOfCheckAfter: Date, hourOfCheckBefore: Date, measurements: SingleCompoundMeasurement[]) => {
    const allData: AllData = {timeAfter: hourOfCheckAfter, timeBefore: hourOfCheckBefore, measurements: measurements}

    fileSystemService.saveObjectToInternalStorage(
      allData,
      INTERNAL_STORAGE_FILE_NAME,
    );
  };

  const exportMeasurementsAsCSV = (newMeasurements: any, hourBefore: Date, hourAfter: Date) => {
    console.log('Exporting a CSV file: ');
    const csvRows: AnalyserCheckCSVRow[] = [];
    for (const measurement of newMeasurements) {
      csvRows.push({
        'Godzina sprawdzenia przed': hourBefore.toString(),
        'Godzina sprawdzenia po': hourAfter.toString(),
        Związek: measurement.compound, 
        'Stężenie butli': measurement.concentration,
        'Zakres analizatora': measurement.analiserRange, 
        'Odczyt przed analizator zero': measurement.readingBeforeAnalisatorZero,
        'Odczyt przed analizator zakres': measurement.readingBeforeAnalisatorRange,
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
    return csvFileContents;
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

    const rows = readString(fileContents, {header: true})[
      'data'
    ] as AnalyserCheckCSVRow[];

    const newMeasurements: SingleCompoundMeasurement[] = [];

    for (const row of rows) {
      newMeasurements.push({
        compound: row['Związek'],
        concentration: row['Stężenie butli'],
        analiserRange: row['Zakres analizatora'],
        readingBeforeAnalisatorZero: row['Odczyt przed analizator zero'], 
        readingBeforeAnalisatorRange: row['Odczyt przed analizator zakres'],
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
    setCurrentMeasurement({...emptyMeasurement})
    setMeasurements([{...emptyMeasurement}])
    setHourOfCheckAfter(new Date)
    setHourOfCheckBefore(new Date)
  }

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => {
          saveCurrentCompound();
          return exportMeasurementsAsCSV(measurements, hourOfCheckBefore, hourOfCheckAfter)}}
        onDelete={resetState}
        fileContentsHandler={restoreStateFromCSV}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <SelectorBar 
        label={'Gaz:'}
        selections={Compounds} 
        onSelect={(selectedItem: string, index: number) => {
          saveCurrentCompound();
          changeCurrentCompound(selectedItem);
        }}        
        />
        <TimeSelector 
        timeLabel='Godzina sprawdzenia przed:'
        date={hourOfCheckBefore}
        setDate={date => {setHourOfCheckBefore(date); persistStateInInternalStorage(hourOfCheckAfter, date, measurements);}}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.concentration}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, concentration: text});
          }}
          label={'Stężenie butli:'}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.analiserRange}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, analiserRange: text});
          }}
          label={'Zakres analizatora:'}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeAnalisatorZero}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, readingBeforeAnalisatorZero: text});
          }}
          label={'Odczyt przed analizator zero:'}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeAnalisatorRange}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, readingBeforeAnalisatorRange: text});
          }}
          label={'Odczyt przed analizator zakres:'}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeSystemZero}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, readingBeforeSystemZero: text});
          }}
          label={'Odczyt przed układ zero:'}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingBeforeSystemRange}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, readingBeforeSystemRange: text});
          }}
          label={'Odczyt przed układ zakres:'}
        />
        <TimeSelector 
        timeLabel='Godzina sprawdzenia po:'
        date={hourOfCheckAfter}
        setDate={date => setHourOfCheckAfter(date)}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingAfterSystemZero}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, readingAfterSystemZero: text});
          }}
          label={'Odczyt po układ zero:'}
        />
        <NumberInputBar
          placeholder="0"
          value={currentMeasurement.readingAfterSystemRange}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, readingAfterSystemRange: text});
          }}
          label={'Odczyt po układ zakres:'}
        />
        <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          console.log(currentMeasurement)
          processingInput()
        }}
        />
        <OutputBar 
        label={'2% zakresu:'}
        output={currentMeasurement.twoPCRange}
        />
        <OutputBar 
        label={'5% zakresu:'}
        output={currentMeasurement.fivePCRange}
        />
        <OutputBar 
        label={'Sprawdzenie zera przed:'}
        output={currentMeasurement.zeroEvaluationBefore}
        />
        <OutputBar 
        label={'Sprawdzenie zakresu przed:'}
        output={currentMeasurement.rangeEvaluationBefore}
        />
        <OutputBar 
        label={'Sprawdzenie pomiaru po:'}
        output={currentMeasurement.evaluationAfter}
        />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
