import React from 'react';
import {Button, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { Screens } from '../constants';
import { colors } from '../styles/common-styles';
import {useTranslation} from 'react-i18next';
import {styles} from '../styles/common-styles';

export const DustScreen = ({navigation}: {navigation: any}) => {
  const [text, onChangeText] = React.useState('Useless Text');
  const [isVisible, setVisible] = React.useState(false);
  return (
    <>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TextInput
        style={{color: 'black'}}
        onChangeText={onChangeText}
        value={text}
      />
      <TouchableOpacity
        onPress={() => setVisible(!isVisible)}
        style={styles.roundedButton1}>
        <Text style={styles.buttonText1}>
          Show input
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => console.log(text)}
        style={styles.roundedButton1}>
        <Text style={styles.buttonText1}>
          Submit
        </Text>
      </TouchableOpacity>
      {isVisible && <Text
        style={{color: 'black'}}
      > {text} </Text>}
    </View>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text> Pyły </Text>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.home}
      />
    </View>
    </>
  );
};
