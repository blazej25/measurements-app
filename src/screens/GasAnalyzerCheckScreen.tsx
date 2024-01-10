import React from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {NumberInputBar} from '../components/input-bars';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {styles} from '../styles/common-styles';

export const GasAnalyzerScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => 'test'}
        onDelete={() => {}}
        fileContentsHandler={(contents: Object) => {}}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <NumberInputBar
          placeholder="0"
          value={''}
          onChangeText={text => {}}
          label={'Placeholder button'}
        />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
