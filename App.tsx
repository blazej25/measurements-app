import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useColorScheme} from 'react-native';

import {AspirationScreen} from './src/screens/AspirationScreen';
import {DustScreen} from './src/screens/DustScreen';
import {EquipmentBaseScreen} from './src/screens/EquipmentBaseScreen';
import {FlowsScreen} from './src/screens/FlowsScreen';
import {GasAnalyzerScreen} from './src/screens/GasAnalyzerCheckScreen';
import {H2O_14790_Screen} from './src/screens/H20_14790_Screen';
import {MeasurementsScreen} from './src/screens/MeasurementScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {UtilitiesScreen} from './src/screens/UtilitiesScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Measurements" component={MeasurementsScreen} />
        <Stack.Screen name="Flows" component={FlowsScreen} />
        <Stack.Screen name="Aspiration" component={AspirationScreen} />
        <Stack.Screen name="Dust" component={DustScreen} />
        <Stack.Screen name="H2O_14790" component={H2O_14790_Screen} />
        <Stack.Screen name="GasAnalyzerCheck" component={GasAnalyzerScreen} />
        <Stack.Screen name="Utilities" component={UtilitiesScreen} />
        <Stack.Screen name="EquipmentBase" component={EquipmentBaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
