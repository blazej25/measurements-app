import React from 'react';
import {Button, Text, View} from 'react-native';

export const H2O_14790_Screen = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text> H2O 14790 Screen </Text>
      <Button title="Powrót" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};
