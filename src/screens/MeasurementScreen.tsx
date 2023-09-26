import React from 'react';
import {Button, Text, View} from 'react-native';

export const MeasurementScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Próba</Text>
      <Button title="Powrót" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};
