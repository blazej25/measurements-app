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
import {Screens} from './src/constants';
import { MenuBar } from './src/components/MenuBar';
import { TutorialMainScreen } from './src/tutorials/TutorialMainScreen';
import { NavigationButton } from './src/components/buttons';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const {t} = useTranslation();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={Screens.home}
            component={HomeScreen}
            options={{title: t(`userInterface:${Screens.home}`)}}
          />
          <Stack.Screen
            name={Screens.measurements}
            component={MeasurementsScreen}
            options={{title: t(`userInterface:${Screens.measurements}`)}}
          />
          <Stack.Screen
            name={Screens.flows}
            component={FlowsScreen}
            options={{title: t(`userInterface:${Screens.flows}`)}}
          />
          <Stack.Screen
            name={Screens.aspiration}
            component={AspirationScreen}
            options={{title: t(`userInterface:${Screens.aspiration}`)}}
          />
          <Stack.Screen
            name={Screens.dust}
            component={DustScreen}
            options={{title: t(`userInterface:${Screens.dust}`)}}
          />
          <Stack.Screen
            name={Screens.H2O}
            component={H2O_14790_Screen}
            options={{title: t(`userInterface:${Screens.H2O}`)}}
          />
          <Stack.Screen
            name={Screens.gasAnalyzerCheck}
            component={GasAnalyzerScreen}
            options={{title: t(`userInterface:${Screens.gasAnalyzerCheck}`)}}
          />
          <Stack.Screen
            name={Screens.utilities}
            component={UtilitiesScreen}
            options={{title: t(`userInterface:${Screens.utilities}`)}}
          />
          <Stack.Screen
            name={Screens.equipmentBase}
            component={EquipmentBaseScreen}
            options={{title: t(`userInterface:${Screens.equipmentBase}`)}}
          />
          <Stack.Screen
            name={Screens.settings}
            component={SettingsScreen}
            options={{title: t(`userInterface:${Screens.settings}`)}}
          />
          <Stack.Screen
            name={"Tutorial Screen"}
            component={TutorialMainScreen}
            options={{title: "Tutorial"}}
          />
        </Stack.Navigator>
      <MenuBar/>
      </NavigationContainer>
    </>
  );
}

export default App;
