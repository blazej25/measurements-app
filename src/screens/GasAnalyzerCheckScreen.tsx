import React from 'react';
import {Button, Text, View} from 'react-native';

export const GasAnalyzerScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text> Sprawdzenie Analizatora Gazów </Text>
      <Button title="Powrót" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};
