import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {t} from 'i18next';
import {
  DataBar,
  DateTimeSelectorGroup,
  NumberInputBar,
  SelectorBar,
  TimeSelector,
} from '../components/input-bars';
import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
} from '../styles/common-styles';
import {
  CommonMeasurementDataSetters,
  PipeCrossSectionType,
  crossSectionTypeFrom,
} from '../model';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MeasurementsScreen} from './MeasurementScreen';

// interfaces are like structs in c
// syntax:
// interface MyInterfaceName{
//   field: FieldType
// }
//

interface Measurement {
  id: number;
  date: Date;
  afterMass: number[];
  initialMass: number[];
  leakTightnessTest: number;
  aspiratorFlow: number;
  aspiratedGases: number;
}

export const H2O_14790_Screen = ({navigation}: {navigation: any}) => {
  // In this screen we are collecting a list of measurements.
  const [measurements, setMeasurements]: [
    measurements: Measurement[],
    setMeasurements: any,
  ] = useState([]);

  // State of the measurement that is currently showing on the screen.
  const [date, setDate] = useState(new Date());
  const [initialMass, setInitialMass]: [
    number[],
    Dispatch<SetStateAction<number[]>>,
  ] = useState([0, 0, 0]);
  const [afterMass, setAfterMass]: [
    number[],
    Dispatch<SetStateAction<number[]>>,
  ] = useState([0, 0, 0]);
  const [leakTightnessTest, setLeakTightnessTest] = useState(0);
  const [aspiratorFlow, setAspiratorFlow] = useState(0);
  const [aspiratedGases, setAspiratedGases] = useState(0);

  const [scrubberIndex, setScrubberIndex] = useState(0);
  const [dataIndex, setDataIndex] = useState(0);

  const loadMeasurement = (measurement: Measurement) => {
    setDate(measurement.date);
    setInitialMass(measurement.initialMass);
    setAfterMass(measurement.afterMass);
    setLeakTightnessTest(measurement.leakTightnessTest);
    setAspiratorFlow(measurement.aspiratorFlow);
    setAspiratedGases(measurement.aspiratedGases);
  };

  const storeCurrentValuesAsMeasurement = () => {
    const newMeasurement: Measurement = {
      id: dataIndex,
      date: date,
      afterMass: afterMass,
      initialMass: initialMass,
      leakTightnessTest: leakTightnessTest,
      aspiratorFlow: aspiratorFlow,
      aspiratedGases: aspiratedGases,
    };
    return newMeasurement;
  };

  // Function for erasing the current input values
  const eraseCurrentValues = () => {
    setDate(new Date());
    setInitialMass([0, 0, 0]);
    setAfterMass([0, 0, 0]);
    setLeakTightnessTest(0);
    setAspiratorFlow(0);
    setAspiratedGases(0);
  };

  // Derived state used for displaying the curren scrubber masses.
  const afterMassDisplayValue = useMemo(
    () => afterMass[scrubberIndex],
    [afterMass, scrubberIndex],
  );
  // useMemo makes a derived state out of some other state. In the case below the derived state
  // is the currently showing mass value depending on the number of the 'płuczka' that is currently showing.
  // syntax of use memo: useMemo(() => <expression-for-the-derived-state>, [state arguments from which the target state is derived]);
  const initialMassShowingValue = useMemo(
    () => initialMass[scrubberIndex],
    [initialMass, scrubberIndex],
  );

  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: defaultGap,
        }}>
        <DataBar label={'Numer Pomiaru'}>
          <Text>{dataIndex + 1}</Text>
        </DataBar>
        <TimeSelector
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
          date={date}
          setDate={setDate}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          // Value parameter controlls what is displayed in the component
          value={leakTightnessTest}
          onChangeText={text => setLeakTightnessTest(parseFloat(text))}
          label={'Próba szczelności:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          value={aspiratorFlow}
          onChangeText={text => setAspiratorFlow(parseFloat(text))}
          label={'Przepływ przez aspirator:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          value={aspiratedGases}
          onChangeText={text => setAspiratedGases(parseFloat(text))}
          label={'Ilość zaaspirowanych gazów:'}
        />
        <SelectorBar
          label={'Numer płuczki: '}
          selections={['1', '2', '3']}
          onSelect={(selectedItem: string, _index: number) => {
            setScrubberIndex(parseFloat(selectedItem));
          }}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          onChangeText={text => {
            setInitialMass(
              initialMass.map((mass, index) =>
                index == scrubberIndex ? parseFloat(text) : mass,
              ),
            );
          }}
          value={initialMassShowingValue}
          label={'Masa początkowa płuczki:'}
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="g"
          value={afterMassDisplayValue}
          onChangeText={text => {
            setAfterMass(
              afterMass.map((mass, index) =>
                index == scrubberIndex ? parseFloat(text) : mass,
              ),
            );
          }}
          label={'Masa płuczki po pomiarze:'}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: colors.secondaryBlue,
            padding: defaultPadding,
            alignSelf: 'stretch',
            gap: defaultGap,
          }}>
          <TouchableOpacity
            style={{
              borderRadius: defaultBorderRadius,
              flexDirection: 'row',
              margin: defaultGap,
              paddingHorizontal: defaultPadding,
              backgroundColor: colors.secondaryBlue,
              height: 40,
            }}
            onPress={() => {
              if (dataIndex > 0) {
                loadMeasurement(measurements[dataIndex - 1]);
                setDataIndex(dataIndex - 1);
              }
            }}>
            <Icon
              name="arrow-left-circle"
              style={{marginTop: 10}}
              size={20}
              color={colors.buttonBlue}
            />
          </TouchableOpacity>
          {dataIndex < measurements.length && (
            <TouchableOpacity
              style={{
                borderRadius: defaultBorderRadius,
                flexDirection: 'row',
                margin: defaultGap,
                paddingHorizontal: defaultPadding,
                backgroundColor: colors.secondaryBlue,
                height: 40,
              }}
              onPress={
                // Here save the current state as the new saved measurement.
                () => {
                  measurements.map(measurement => {
                    if (measurement.id == dataIndex) {
                      return storeCurrentValuesAsMeasurement();
                    } else {
                      return measurement;
                    }
                  });
                }
              }>
              <Icon
                name="content-save"
                style={{marginTop: 10}}
                size={20}
                color={colors.buttonBlue}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              borderRadius: defaultBorderRadius,
              flexDirection: 'row',
              margin: defaultGap,
              paddingHorizontal: defaultPadding,
              backgroundColor: colors.secondaryBlue,
              height: 40,
            }}
            onPress={
              // Here save the current state as the new saved measurement.
              () => {
                setMeasurements(
                  measurements.concat(storeCurrentValuesAsMeasurement()),
                );
                setDataIndex(dataIndex + 1);
                eraseCurrentValues();
                setScrubberIndex(0);
              }
            }>
            <Icon
              name="plus"
              style={{marginTop: 10}}
              size={20}
              color={colors.buttonBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: defaultBorderRadius,
              flexDirection: 'row',
              margin: defaultGap,
              paddingHorizontal: defaultPadding,
              backgroundColor: colors.secondaryBlue,
              height: 40,
            }}
            // Here we need to set the current measurement counte +1 modulo number of measurements (or cap it)
            onPress={() => {
              if (dataIndex < measurements.length - 1) {
                loadMeasurement(measurements[dataIndex + 1]);
                setDataIndex(dataIndex + 1);
              }
            }}>
            <Icon
              name="arrow-right-circle"
              style={{marginTop: 10}}
              size={20}
              color={colors.buttonBlue}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
