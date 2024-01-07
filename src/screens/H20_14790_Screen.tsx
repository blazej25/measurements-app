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

interface Measurement {
  id: number;
  date: Date;
  afterMass: string[];
  initialMass: string[];
  leakTightnessTest: string;
  aspiratorFlow: string;
  aspiratedGases: string;
}

const ButtonIcon = ({materialIconName}: {materialIconName: string}) => {
  return (
    <Icon
      name={materialIconName}
      style={{marginTop: 10}}
      size={20}
      color={colors.buttonBlue}
    />
  );
};

export const H2O_14790_Screen = ({navigation}: {navigation: any}) => {
  const [measurements, setMeasurements]: [
    measurements: Measurement[],
    setMeasurements: any,
  ] = useState([]);

  const initialState: Measurement = {
    id: 0,
    date: new Date(),
    afterMass: ['', '', ''],
    initialMass: ['', '', ''],
    leakTightnessTest: '',
    aspiratorFlow: '',
    aspiratedGases: '',
  };

  const [dataIndex, setDataIndex] = useState(0);
  const [scrubberIndex, setScrubberIndex] = useState(0);
  const [currentMeasurement, setCurrentMeasurement] =
    useState(initialState);

  const loadMeasurement = (measurement: Measurement) => {
    setCurrentMeasurement(measurement);
  };

  const storeCurrentValuesAsMeasurement = () => {
    const newMeasurement: Measurement = {
      id: currentMeasurement.id,
      date: currentMeasurement.date,
      afterMass: currentMeasurement.afterMass,
      initialMass: currentMeasurement.initialMass,
      leakTightnessTest: currentMeasurement.leakTightnessTest,
      aspiratorFlow: currentMeasurement.aspiratorFlow,
      aspiratedGases: currentMeasurement.aspiratedGases,
    };
    return newMeasurement;
  };

  // Function for erasing the current input values
  const eraseCurrentValues = () => {
    setCurrentMeasurement(initialState);
  };

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

  const measurementNavigationButtonStyle: StyleProp<ViewStyle> = {
    borderRadius: defaultBorderRadius,
    flexDirection: 'row',
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    backgroundColor: 'white',
    height: 40,
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <DataBar label={''}>
          <Text style={styles.dataSelectorText}>{dataIndex + 1}</Text>
        </DataBar>
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={currentMeasurement.date}
          setDate={date => {
            setCurrentMeasurement({...currentMeasurement, date: date});
          }}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="l"
          // Value parameter controlls what is displayed in the component
          value={currentMeasurement.leakTightnessTest}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, leakTightnessTest: text});
          }}
        label={''}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="m3/h"
          value={currentMeasurement.aspiratorFlow}
          onChangeText={(text) => {
            setCurrentMeasurement({...currentMeasurement, aspiratorFlow: text});
          }}
          // TODO
          label={''}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="m3"
          value={currentMeasurement.aspiratedGases}
          onChangeText={text => {
            setCurrentMeasurement({...currentMeasurement, aspiratedGases : text})
         }}
          label={'Ilość zaaspirowanych gazów:'}
        />
        <SelectorBar
          label={'Numer płuczki: '}
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
            const newInitialMass =
              currentMeasurement.initialMass.map((mass, index) =>
                index == scrubberIndex ? text : mass,
              );
            setCurrentMeasurement({...currentMeasurement, initialMass: newInitialMass});
          }}
          value={initialMassShowingValue}
          label={'Masa początkowa płuczki:'}
        />
        <NumberInputBar
          placeholder="0"
          valueUnit="g"
          value={afterMassDisplayValue}
          onChangeText={text => {
            let newAfterMass =
              currentMeasurement.afterMass.map((mass, index) =>
                index == scrubberIndex ? text : mass,
              );
            setCurrentMeasurement({...currentMeasurement, afterMass: newAfterMass});
          }}
          label={'Masa płuczki po pomiarze:'}
        />
        <View
          // This is the main button component
          style={{
            borderRadius: largeBorderRadius,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: colors.secondaryBlue,
            padding: defaultPadding,
            alignSelf: 'center',
            gap: defaultGap,
          }}>
          <TouchableOpacity
            style={measurementNavigationButtonStyle}
            onPress={() => {
              if (dataIndex > 0) {
                loadMeasurement(measurements[dataIndex - 1]);
                setDataIndex(dataIndex - 1);
              }
            }}>
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
                style={measurementNavigationButtonStyle}
                onPress={
                  // Here save the current state as the new saved measurement.
                  () => {
                    setMeasurements(
                      measurements.concat(storeCurrentValuesAsMeasurement()),
                    );
                    setDataIndex(dataIndex + 1);
                    eraseCurrentValues();
                    // Restore the 'numer płuczki' to 1.
                    setScrubberIndex(0);
                  }
                }>
                <ButtonIcon materialIconName="plus" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={measurementNavigationButtonStyle}
                onPress={() => {
                  // Update the currently selected measurement with the new values.
                  const newMeasurements = measurements.map(measurement => {
                    return measurement.id == dataIndex
                      ? storeCurrentValuesAsMeasurement()
                      : measurement;
                  });
                  setMeasurements(newMeasurements);
                }}>
                <ButtonIcon materialIconName="content-save" />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity
            style={measurementNavigationButtonStyle}
            onPress={() => {
              // Here if the dataIndex is within the measurements array, it means
              // that we are viewing an already-saved measurement and so we want
              // to load that measurement. Otherwise, if dataIndex
              // is equal to measurements.length, it means that we are adding a
              // new measurement and so no measurement exists that can be loaded.
              if (dataIndex < measurements.length - 1) {
                loadMeasurement(measurements[dataIndex + 1]);
              }

              if (dataIndex < measurements.length) {
                setDataIndex(dataIndex + 1);
              }
              // We erase the current values only if the user transitions from viewing the
              // last saved measurement to adding the new one.
              if (dataIndex + 1 == measurements.length) {
                eraseCurrentValues();
              }
            }}>
            <ButtonIcon materialIconName="arrow-right-circle" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
