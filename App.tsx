/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {AspirationScreen} from './src/screens/AspirationScreen';
import { DustScreen } from './src/screens/DustScreen';
import {EquipmentBaseScreen} from './src/screens/EquipmentBaseScreen';
import {FlowsScreen} from './src/screens/FlowsScreen';
import {GasAnalyzerCheckScreen} from './src/screens/GasAnalyzerCheckScreen';
import {H2O_14790_Screen} from './src/screens/H20_14790_Screen';
import {MeasurementScreen as MeasurementsScreen} from './src/screens/MeasurementScreen';
import {UtilitiesScreen} from './src/screens/UtilitiesScreen';

import Localization from 'expo-localization'
import {I18n} from 'i18n-js'
import {en, pl} from './src/i18n/supportedLanguages'

I18n.enableFallback = true;
I18n.translations = { en, pl };
I18n.locale = Localization.locale;

const Stack = createNativeStackNavigator();


const MeasurementTypeButtonSection = ({navigation}: {navigation: any}) => {
  return (
      <View
        style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end'}}>
        <Button title="Flows" onPress={() => navigation.navigate('Flows')} />
        <Button
          title={('aspiration')}
          onPress={() => navigation.navigate('Aspiration')}
        />
        <Button
          title="H2O_14790"
          onPress={() => navigation.navigate('H2O_14790')}
        />
        <Button
          title="Dust"
          onPress={() => navigation.navigate('Dust')}
        />
      </View>);
  };

const HomeScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Welcome to the Measurements App!</Text>
      <MeasurementTypeButtonSection navigation={navigation}/>
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

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Measurements" component={MeasurementsScreen} />
        <Stack.Screen name="Flows" component={FlowsScreen} />
        <Stack.Screen name="Aspiration" component={AspirationScreen} />
        <Stack.Screen name="Dust" component={DustScreen} />
        <Stack.Screen name="H2O_14790" component={H2O_14790_Screen} />
        <Stack.Screen
          name="GasAnalyzerCheck"
          component={GasAnalyzerCheckScreen}
        />
        <Stack.Screen name="Utilities" component={UtilitiesScreen} />
        <Stack.Screen name="EquipmentBase" component={EquipmentBaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
