import React from 'react';
import {Button, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {colors, defaultGap} from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import {styles} from '../styles/common-styles';
import {MenuBar} from '../components/MenuBar';
import { t } from 'i18next';
import { InputRow } from '../components/InputRow';

export const DustScreen = ({navigation}: {navigation: any}) => {
  const [numberOfMeasurements, setNumberOfMeasurements] = React.useState('Useless Text');
  const [end, setEnd] = React.useState('Useless Text');
  const [time, setTime] = React.useState('Useless Text');
  const [volume, setVolume] = React.useState('Useless Text');
  const [filter, setFilter] = React.useState('Useless Text');
  const [water, setWater] = React.useState('Useless Text');
  return (
    <>
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        gap: defaultGap,
      }}>
      <InputRow
        onChangeText={setNumberOfMeasurements}
        label={'Ilość pomiarów'}
      />
      <InputRow
        onChangeText={setEnd}
        label={'Rodzaj końcówki'}
      />
      <InputRow
        onChangeText={setTime}
        label={'Godzina Przyjazdu'}
      />
      <InputRow
        onChangeText={setVolume}
        label={'Objętość zaaspirowana'}
      />
      <InputRow
        onChangeText={setFilter}
        label={'Filtr'}
      />
      <InputRow
        onChangeText={setWater}
        label={'Woda'}
      />
      </View>
    </>
  );
};
