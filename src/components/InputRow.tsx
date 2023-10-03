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

export const InputRow = ({
  label,
  placeholder,
  onChangeText,
}: {
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: largeBorderRadius,
        flexDirection: 'row',
        backgroundColor: colors.buttonBlue,
        alignSelf: 'stretch',
        marginHorizontal: defaultGap,
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          ...styles.buttonText1,
          alignSelf: 'center',
          margin: defaultGap,
          marginLeft: defaultPadding,
        }}>
        {label}
      </Text>
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
        }}>
        <TextInput
          placeholderTextColor={'gray'}
          placeholder={placeholder}
          onChangeText={onChangeText}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};