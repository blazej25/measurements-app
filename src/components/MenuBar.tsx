import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {NavigationButton} from '../components/buttons';
import {Screens} from '../constants';
import {
  colors,
  defaultGap,
  defaultPadding,
  styles,
} from '../styles/common-styles';
import {useNavigation} from '@react-navigation/native';

export const MenuBar = () => {
  // We use the useNavigation hook as the menu bar is accessible at the top
  // level and it isn't possible to pass the navigation prop to this component
  // via the stack navigator.
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.secondaryBlue,
        padding: defaultPadding,
        alignSelf: 'stretch',
        gap: defaultGap,
      }}>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.flows}
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.H2O}
        destinationScreenShortLabelName="H2OShort"
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.dust}
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.gasAnalyzerCheck}
        destinationScreenShortLabelName="gasAnalyzerCheckShort"
      />
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.aspiration}
      />
    </View>
  );
};
