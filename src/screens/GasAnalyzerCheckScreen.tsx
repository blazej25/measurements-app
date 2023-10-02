import React from 'react';
import {Button, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { Screens } from '../constants';

export const GasAnalyzerScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text> Sprawdzenie Analizatora Gazów </Text>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.home}
      />
    </View>
  );
};
