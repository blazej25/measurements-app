import React, {useState} from 'react';
import {Text, View} from 'react-native';

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
import {PipeCrossSectionType} from '../model';

export const HomeScreen = ({navigation}: {navigation: any}) => {
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
      <CommonDataInput />
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

const CommonDataInput = () => {
  const [date, setDate] = useState(new Date());
  const [measurementRequestor, setMeasurementRequestor] = useState('');
  const [emissionSource, setEmissionSource] = useState('');
  const [pipeCrossSectionType, setPipeCrossSectionType] = useState(null);
  const [staffResponsibleForMeasurement, setStaffResponsibleForMeasurement] =
    useState([]);
  const [temperature, setTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);
  const {t} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <DateTimeSelectorGroup
        date={date}
        setDate={setDate}
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <TextInputBar
        placeholder="Jan Kowalski"
        onChangeText={setMeasurementRequestor}
        label={
          t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
        }
      />
      <TextInputBar
        placeholder="some source"
        onChangeText={setEmissionSource}
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
          setPipeCrossSectionType(PipeCrossSectionType[selectedItem]);
        }}
      />
      <NumberInputBar
        placeholder="20"
        valueUnit="℃"
        onChangeText={text => setTemperature(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
      />
      <NumberInputBar
        placeholder="1100"
        valueUnit="hPa"
        onChangeText={text => setPressure(parseFloat(text))}
        label={t(`commonDataForm:${CommonDataSchema.pressure}`) + ':'}
      />
    </View>
  );
};
