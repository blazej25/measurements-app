import React from 'react';
import {Button, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { Screens } from '../constants';

export const MeasurementsScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Próba</Text>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.home}
      />
    </View>
  );
};
