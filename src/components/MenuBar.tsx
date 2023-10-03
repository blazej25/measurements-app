import React, {useState} from 'react';
import {Button, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {NavigationButton} from '../components/buttons';
import {CommonDataSchema, Screens} from '../constants';
import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  largeBorderRadius,
  styles,
} from '../styles/common-styles';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export const MenuBar = ({navigation}: {navigation: any}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
          gap: defaultGap,
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
    </>
  );
};