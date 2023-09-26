import React from 'react';
import {Button, Text, View} from 'react-native';

export const EquipmentBaseScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Baza Sprzętowa</Text>
      <Button title="Powrót" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};
