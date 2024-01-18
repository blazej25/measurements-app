import React, { useState } from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {NumberInputBar, SelectorBar, TimeSelector} from '../components/input-bars';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {styles} from '../styles/common-styles';

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
  twoPCRangeBefore: string,
  zeroEvaluationBefore: string,
  rangeEvaluationBefore: string,
  twoPCRangeAfter: string,
  fivePCRangeAfter: string,
  evaluationAfter: string,
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

export const GasAnalyzerScreen = ({navigation}: {navigation: any}) => {
  const [hourOfCheckBefore, setHourOfCheckBefore] = useState(new Date);
  const [hourOfCheckAfter, setHourOfCheckAfter] = useState(new Date);

  const initialState: SingleCompoundMeasurement = {
    compound: Compounds[0],
    concentration: '',
    analiserRange: '',
    readingBeforeAnalisatorZero: '',
    readingBeforeAnalisatorRange: '',
    readingBeforeSystemZero: '',
    readingBeforeSystemRange: '',
    readingAfterSystemZero: '',
    readingAfterSystemRange: '',
    twoPCRangeBefore: '',
    twoPCRangeAfter: '',
    fivePCRangeAfter: '',
    zeroEvaluationBefore: '',
    rangeEvaluationBefore: '',
    evaluationAfter: ''
  }

  const [currentMeasurement, setCurrentMeasurement] = useState(initialState);

  const [measurements, setMeasurements] = useState([initialState]);

  const compoundExists = (measurement: SingleCompoundMeasurement) => {
    const filtered = measurements.filter(
      (item: SingleCompoundMeasurement) => measurement.compound === item.compound
    );
    return filtered.length > 0;
  }

  const saveCurrentCompound = (compound: string) => {
    if (compoundExists(currentMeasurement)) {
      const newCompound = measurements.filter(
        (item: SingleCompoundMeasurement) =>
          currentMeasurement.compound != item.compound
      )
      newCompound.push({...currentMeasurement});
      setMeasurements(newCompound);
    } else {
      measurements.push({...currentMeasurement});
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
        ...initialState,
        compound: newMeasurement.compound,
      });
    }
  };

  const processingInput = () => {
    const fivePercent = currentMeasurement.analiserRange === '' ? 0 : parseInt(currentMeasurement.analiserRange) * 0.05;
    const twoPercent = currentMeasurement.analiserRange === '' ? 0 : parseInt(currentMeasurement.analiserRange) * 0.02;
    const beforeSystemZero = currentMeasurement.readingBeforeSystemZero === '' ? 0 : parseFloat(currentMeasurement.readingBeforeSystemZero);
    const beforeSystemRange = currentMeasurement.readingBeforeSystemRange === '' ? 0 : parseFloat(currentMeasurement.readingBeforeSystemRange);
    const afterSystemZero = currentMeasurement.readingAfterSystemZero === '' ? 0 : parseFloat(currentMeasurement.readingAfterSystemZero);
    const afterSystemRange = currentMeasurement.readingAfterSystemRange === '' ? 0 : parseFloat(currentMeasurement.readingAfterSystemRange);

    var evaluationZeroAfter = 0;
    var evaluationRangeAfter = 0;

    setCurrentMeasurement({
      ...currentMeasurement,
      twoPCRangeBefore: twoPercent.toFixed(2),
      twoPCRangeAfter: twoPercent.toFixed(2),
      fivePCRangeAfter: fivePercent.toFixed(2),
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

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={() => {}}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <SelectorBar 
        label={'Gaz:'}
        selections={Compounds} 
        onSelect={(selectedItem: string, index: number) => {
          saveCurrentCompound(selectedItem);
          changeCurrentCompound(selectedItem);
        }}        
        />
        <TimeSelector 
        timeLabel='Godzina sprawdzenia przed:'
        date={hourOfCheckBefore}
        setDate={date => setHourOfCheckBefore(date)}
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
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
