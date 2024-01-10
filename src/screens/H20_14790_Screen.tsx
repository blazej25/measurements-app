import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {CommonDataSchema} from '../constants';
import {t} from 'i18next';
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
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {ButtonIcon} from '../components/ButtonIcon';

interface Measurement {
  id: number;
  date: Date;
  afterMass: string[];
  initialMass: string[];
  leakTightnessTest: string;
  aspiratorFlow: string;
  aspiratedGases: string;
}

export const H2O_14790_Screen = ({navigation}: {navigation: any}) => {
  const [measurements, setMeasurements]: [
    measurements: Measurement[],
    setMeasurements: any,
  ] = useState([]);

  const initialState: Measurement = {
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
  const [currentMeasurement, setCurrentMeasurement] = useState(initialState);

  // Derived state used for displaying the curren scrubber masses.
  const afterMassDisplayValue = useMemo(
    () => currentMeasurement.afterMass[scrubberIndex],
    [currentMeasurement, scrubberIndex],
  );

  // useMemo makes a derived state out of some other state. In the case below the derived state
  // is the currently showing mass value depending on the number of the 'płuczka' that is currently showing.
  // syntax of use memo: useMemo(() => <expression-for-the-derived-state>, [state arguments from which the target state is derived]);
  const initialMassShowingValue = useMemo(
    () => currentMeasurement.initialMass[scrubberIndex],
    [currentMeasurement, scrubberIndex],
  );

  const updateField = (field: Partial<Measurement>) => {
    setCurrentMeasurement({...currentMeasurement, ...field});
  };

  /* State transitions for the navigation button component */

  const setPreviousMeasurement = () => {
    if (dataIndex == 0) {
      return;
    }
    setCurrentMeasurement(measurements[dataIndex - 1]);
    setDataIndex(dataIndex - 1);
  };

  const saveCurrentMeasurement = () => {
    setMeasurements(measurements.concat({...currentMeasurement}));
    setDataIndex(dataIndex + 1);
    setCurrentMeasurement(initialState);
    setScrubberIndex(0);
  };

  const saveModifiedMeasurement = () => {
    // Update the currently selected measurement with the new values.
    const newMeasurements = measurements.map(measurement => {
      return measurement.id == dataIndex
        ? {...currentMeasurement}
        : measurement;
    });
    setMeasurements(newMeasurements);
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

    if (dataIndex < measurements.length) {
      setDataIndex(dataIndex + 1);
    }
    // We erase the current values only if the user transitions from viewing the
    // last saved measurement to adding the new one.
    if (dataIndex + 1 == measurements.length) {
      setCurrentMeasurement(initialState);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={() => {}}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <DataBar label={t('h20Screen:measurementNumber') + ':'}>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={currentMeasurement.date}
          setDate={date => updateField({date: date})}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          // Value parameter controlls what is displayed in the component
          value={currentMeasurement.leakTightnessTest}
          onChangeText={text => updateField({leakTightnessTest: text})}
          label={t('h20Screen:leakTightnessTest') + ':'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="m3/h"
          value={currentMeasurement.aspiratorFlow}
          onChangeText={text => updateField({aspiratorFlow: text})}
          label={t('h20Screen:aspiratorFlow') + ':'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="m3"
          value={currentMeasurement.aspiratedGases}
          onChangeText={text => updateField({aspiratedGases: text})}
          label={t('h20Screen:aspiratedVolume') + ':'}
        />
        <SelectorBar
          label={t('h20Screen:scrubberNumber') + ':'}
          selections={['1', '2', '3']}
          onSelect={(selectedItem: string, _index: number) => {
            // We subtract 1 because the UI displays the numbers of the scrubbers
            // starting from 1, but the array of scrubbers uses usual 0-based
            // indexing.
            setScrubberIndex(parseInt(selectedItem) - 1);
          }}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="g"
          onChangeText={text => {
            const newInitialMass = currentMeasurement.initialMass.map(
              (mass, index) => (index == scrubberIndex ? text : mass),
            );
            updateField({initialMass: newInitialMass});
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
            updateField({afterMass: newAfterMass});
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
                onPress={saveCurrentMeasurement}>
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
