import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';


import {useTranslation} from 'react-i18next';
import { NavigationButton } from '../components/buttons';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Welcome to the Measurements App!</Text>
      <MeasurementTypeSelector navigation={navigation} />
      <View
        style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end'}}>
        <Button
          title="Measurements"
          onPress={() => navigation.navigate('Measurements')}
        />
        <Button
          title="GasAnalyzerCheck"
          onPress={() => navigation.navigate('GasAnalyzerCheck')}
        />
        <Button
          title="Utilities"
          onPress={() => navigation.navigate('Utilities')}
        />
        <Button
          title="EquipmentBase"
          onPress={() => navigation.navigate('EquipmentBase')}
        />
      </View>
    </View>
  );
};

const MeasurementTypeSelector = ({navigation}: {navigation: any}) => {
  const {t, i18n} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
      }}>
      <NavigationButton
        navigation={navigation}
        buttonTitle="flows"
        destinationScreen="Flows"
      />
      <NavigationButton
        navigation={navigation}
        buttonTitle="aspiration"
        destinationScreen="Aspiration"
      />
      <NavigationButton
        navigation={navigation}
        buttonTitle="H2O_14790"
        destinationScreen="H2O_14790"
      />
      <NavigationButton
        navigation={navigation}
        buttonTitle="dust"
        destinationScreen="Dust"
      />
    </View>
  );
};
