import React from 'react';
import {Button, Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {Screens} from '../constants';

export const HomeScreen = ({navigation}: {navigation: any}) => {
  const {t} = useTranslation();
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginTop: 5,
        }}>
        <NavigationButton
          navigation={navigation}
          destinationScreen={Screens.settings}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>
          {t('translation:welcome')}
        </Text>
        <MeasurementTypeSelector navigation={navigation} />
      </View>
    </>
  );
};

const MeasurementTypeSelector = ({navigation}: {navigation: any}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 5,
      }}>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.flows}
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.aspiration}
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.H2O}
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.dust}
      />
    </View>
  );
};
