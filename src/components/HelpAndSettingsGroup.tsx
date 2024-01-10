import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Screens} from '../constants';
import {styles} from '../styles/common-styles';
import {ButtonIcon} from './ButtonIcon';

export const HelpAndSettingsGroup = ({navigation}: {navigation: any}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <HelpModal />
      <SettingsPanel navigation={navigation} />
    </View>
  );
};

const HelpModal = () => {
  return (
    <TouchableOpacity
      style={styles.secondaryNavigationButton}
      onPress={() => {}}>
      <ButtonIcon materialIconName="help" />
    </TouchableOpacity>
  );
};

const SettingsPanel = ({navigation}: {navigation: any}) => {
  return (
    <View
      style={{
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: 5,
        marginRight: 5,
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.language)}
        style={styles.secondaryNavigationButton}>
        <ButtonIcon materialIconName="cog" />
      </TouchableOpacity>
    </View>
  );
};
