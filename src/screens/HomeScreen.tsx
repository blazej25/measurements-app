import React, {useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {defaultGap} from '../styles/common-styles';
import {
  DateTimeSelectorGroup,
  NumberInputBar,
  SelectorBar,
  TextInputBar,
} from '../components/input-bars';
import {
  CommonMeasurementData,
  CommonMeasurementDataSetters,
  Person,
  PipeCrossSectionType,
} from '../model';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const [date, setDate] = useState(new Date());
  const [measurementRequestor, setMeasurementRequestor] = useState('');
  const [emissionSource, setEmissionSource] = useState('');
  const [pipeCrossSectionType, setPipeCrossSectionType] = useState(
    PipeCrossSectionType.ROUND,
  );
  const emptyPersonArray: Person[] = [];
  const [staffResponsibleForMeasurement, setStaffResponsibleForMeasurement]: [
    Person[],
    React.Dispatch<React.SetStateAction<Person[]>>,
  ] = useState(emptyPersonArray);
  const [temperature, setTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);

  const data: CommonMeasurementData = {
    date: date,
    measurementRequestor: measurementRequestor,
    emissionSource: emissionSource,
    pipeCrossSectionType: pipeCrossSectionType,
    staffResponsibleForMeasurement: staffResponsibleForMeasurement,
    temperature: temperature,
    pressure: pressure,
  };

  const setters: CommonMeasurementDataSetters = {
    setDate: setDate,
    setMeasurementRequestor: setMeasurementRequestor,
    setEmissionSource: setEmissionSource,
    setPipeCrossSectionType: setPipeCrossSectionType,
    setStaffResponsibleForMeasurement: setStaffResponsibleForMeasurement,
    setPressure: setPressure,
    setTemperature: setTemperature,
  };

  return (
    <>
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginTop: 5,
          marginRight: 5,
        }}>
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.settings}
        />
      </View>
      <WelcomeHeader />
      <CommonDataInput data={data} setters={setters} />
      <TouchableOpacity
        onPress={() => console.log(JSON.stringify(data, null, '\t'))}>
        <Text>TEST</Text>
      </TouchableOpacity>
    </>
  );
};

const WelcomeHeader = () => {
  const {t} = useTranslation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 15,
      }}>
      <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
        {t('userInterface:welcome')}
      </Text>
    </View>
  );
};

const CommonDataInput = ({
  data,
  setters,
}: {
  data: CommonMeasurementData;
  setters: CommonMeasurementDataSetters;
}) => {
  const {t} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <DateTimeSelectorGroup
        date={data.date}
        setDate={setters.setDate}
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <TextInputBar
        placeholder="Jan Kowalski"
        onChangeText={setters.setMeasurementRequestor}
        label={
          t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
        }
      />
      <TextInputBar
        placeholder="some source"
        onChangeText={setters.setEmissionSource}
        label={t(`commonDataForm:${CommonDataSchema.emissionSource}`) + ':'}
      />
      <SelectorBar
        label={
          t(`commonDataForm:${CommonDataSchema.pipeCrossSectionType}`) + ':'
        }
        selections={Object.keys(PipeCrossSectionType).map(item =>
          item.toString(),
        )}
        onSelect={(selectedItem: string, _index: number) => {
          setters.setPipeCrossSectionType(PipeCrossSectionType[selectedItem]);
        }}
        selectionToText={selection => t(`pipeCrossSectionTypes:${selection}`)}
      />
      <NumberInputBar
        placeholder="20"
        valueUnit="℃"
        onChangeText={text => setters.setTemperature(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
      />
      <NumberInputBar
        placeholder="1100"
        valueUnit="hPa"
        onChangeText={text => setters.setPressure(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.pressure}`) + ':'}
      />
    </View>
  );
};
