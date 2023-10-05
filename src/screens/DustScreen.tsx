import React from 'react';
import {View} from 'react-native';
import { TextInputBar } from '../components/input-bars';
import {defaultGap} from '../styles/common-styles';

export const DustScreen = ({navigation}: {navigation: any}) => {
  const [numberOfMeasurements, setNumberOfMeasurements] =
    React.useState('Useless Text');
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
        <TextInputBar
          onChangeText={setNumberOfMeasurements}
          label={'Ilość pomiarów'}
        />
        <TextInputBar onChangeText={setEnd} label={'Rodzaj końcówki'} />
        <TextInputBar onChangeText={setTime} label={'Godzina Przyjazdu'} />
        <TextInputBar onChangeText={setVolume} label={'Objętość zaaspirowana'} />
        <TextInputBar onChangeText={setFilter} label={'Filtr'} />
        <TextInputBar onChangeText={setWater} label={'Woda'} />
      </View>
    </>
  );
};
