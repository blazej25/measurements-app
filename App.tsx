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
import {SettingsScreen} from './src/screens/SettingsScreen';
import {useTranslation} from 'react-i18next';
import { Screens } from './src/constants';

const Stack = createNativeStackNavigator();


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const {t} = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={Screens.home}
          component={HomeScreen}
          options={{title: t(`translation:${Screens.home}`)}}
        />
        <Stack.Screen
          name={Screens.measurements}
          component={MeasurementsScreen}
          options={{title: t(`translation:${Screens.measurements}`)}}
        />
        <Stack.Screen
          name={Screens.flows}
          component={FlowsScreen}
          options={{title: t(`translation:${Screens.flows}`)}}
        />
        <Stack.Screen
          name={Screens.aspiration}
          component={AspirationScreen}
          options={{title: t(`translation:${Screens.aspiration}`)}}
        />
        <Stack.Screen
          name={Screens.dust}
          component={DustScreen}
          options={{title: t(`translation:${Screens.dust}`)}}
        />
        <Stack.Screen
          name={Screens.H2O}
          component={H2O_14790_Screen}
          options={{title: t(`translation:${Screens.H2O}`)}}
        />
        <Stack.Screen
          name={Screens.gasAnalyzerCheck}
          component={GasAnalyzerScreen}
          options={{title: t(`translation:${Screens.gasAnalyzerCheck}`)}}
        />
        <Stack.Screen
          name={Screens.utilities}
          component={UtilitiesScreen}
          options={{title: t(`translation:${Screens.utilities}`)}}
        />
        <Stack.Screen
          name={Screens.equipmentBase}
          component={EquipmentBaseScreen}
          options={{title: t(`translation:${Screens.equipmentBase}`)}}
        />
        <Stack.Screen
          name={Screens.settings}
          component={SettingsScreen}
          options={{title: t(`translation:${Screens.settings}`)}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
