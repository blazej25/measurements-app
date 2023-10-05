import React from 'react';
import {Text, TextInput, TouchableOpacity} from 'react-native';

import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  largeBorderRadius,
  styles,
} from '../styles/common-styles';


export const NumberInputBar = ({
  label,
  placeholder,
  valueUnit,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  valueUnit: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <DataBar label={label}>
      <TextInput
        keyboardType={'numeric'}
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        onChangeText={onChangeText}
        textAlign={'right'}
      />
      <Text style={{textAlignVertical: 'center', color: 'black'}}>
      {valueUnit}
      </Text>
    </DataBar>
  );
};


export const TextInputBar = ({
  label,
  placeholder,
  onChangeText,
}: {
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <DataBar label={label}>
      <TextInput
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </DataBar>
  );
};

export const DataBar = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={{
        borderRadius: largeBorderRadius,
        flexDirection: 'row',
        backgroundColor: colors.buttonBlue,
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
          height: 40,
        }}>
        {children}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
