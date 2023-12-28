import React, { useState } from 'react';
import { Button, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { Screens } from '../constants';
import { TextInput } from 'react-native';

export const FlowsScreen = ({navigation}: {navigation: any}) => {
  const [liczbaKroccow, setLiczbaKroccow] = useState(0)
  const [iloscPunktow, setIloscPunktow] = useState(0)

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text> Przepływy </Text>
      <TextInput 
      onChangeText={text => setLiczbaKroccow(parseInt(text))}
      style={{color: 'black'}}
      defaultValue={'0'}
      />
      <TextInput 
      onChangeText={text => setIloscPunktow(parseInt(text))}
      style={{color: 'black'}}
      defaultValue={'0'}
      />
      <Button
      onPress={() => {console.log(liczbaKroccow, iloscPunktow)}}
      title={'Press me'}
      />
    </View>
  );
};
