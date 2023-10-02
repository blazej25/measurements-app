import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {Screens} from '../constants';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  return (
    <>
      <View
        style={{
          flex: 0,
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginTop: 5,
        }}>
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.settings}
        />
      </View>
      <View style={{flex: 0, alignItems: 'center', justifyContent: 'flex-start'}}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>
          {t('translation:welcome')}
        </Text>
        <CommonDataInput />
        <MeasurementTypeSelector navigation={navigation} />
      </View>
    </>
  );
};

enum PipeCrossSectionType {
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
}

type Person = {
  name: string;
  surname: string;
};

type CommonMeasurementData = {
  date: Date;
  arrivalTime: string;
  measurementRequestor: string;
  emissionSource: string;
  pipeCrossSectionType: PipeCrossSectionType;
  staffResponsibleForMeasurement: Person[];
  temperature: number;
  pressure: number;
};

const CommonDataInput = () => {
  const [date, setDate] = useState(new Date());
  const [arrivalTime, setArrivalTime] = useState('');
  const [measurementRequestor, setMeasurementRequestor] = useState('');
  const [emissionSource, setEmissionSource] = useState('');
  const [pipeCrossSectionType, setPipeCrossSectionType] = useState(null);
  const [staffResponsibleForMeasurement, setStaffResponsibleForMeasurement] =
    useState([]);
  const [temperature, setTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);

  return (
    <View>
      <InputRow
        placeholder="17:00"
        onChangeText={setArrivalTime}
        label="Data Przyjazdu"
      />
      <InputRow
        placeholder="Jan Kowalski"
        onChangeText={setMeasurementRequestor}
        label="Zleceniodawca"
      />
      <InputRow
        placeholder="some source"
        onChangeText={setEmissionSource}
        label="Źródło Emisji"
      />
      <InputRow
        placeholder="20 ℃ "
        onChangeText={text => setTemperature(parseFloat(text))}
        label="Temperatura"
      />
      <InputRow
        placeholder="1100 hPa"
        onChangeText={text => setPressure(parseFloat(text))}
        label="Ciśnienie atmosferyczne"
      />
    </View>
  );
};

const InputRow = ({
  label,
  placeholder,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View
      style={{
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Text>{label}</Text>
      <TextInput placeholder={placeholder} onChangeText={onChangeText} />
    </View>
  );
};

const MeasurementTypeSelector = ({navigation}: {navigation: any}) => {
  return (
    <>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          marginBottom: 15,
        }}>
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.flows}
        />
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.aspiration}
        />
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.H2O}
        />
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.dust}
        />
      </View>
    </>
  );
};
