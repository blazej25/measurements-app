import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles/common-styles';

/**
 * A reusable navigation button. It depends on the navigation object to navigate to
 * the required screen. The destinationScreen prop needs to correspond to the name
 * of the screen as defined in constants.ts.
 * */

export const NavigationButton = ({
  navigation,
  destinationScreen,
  destinationScreenShortLabelName,
  style,
  textStyle,
}: {
  navigation: any;
  destinationScreen: string;
  destinationScreenShortLabelName?: string;
  style?: any;
  textStyle?: any;
}) => {
  const {t} = useTranslation();

  // When the name of the screen is long we need to use a short label so that
  // the navigation buttons fit at the bottom of the screen.
  const labelName = destinationScreenShortLabelName
    ? destinationScreenShortLabelName
    : destinationScreen;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(destinationScreen)}
      style={style ? style : styles.roundedButton1}>
      <Text style={textStyle? textStyle: styles.buttonText1}>{t(`userInterface:${labelName}`)}</Text>
    </TouchableOpacity>
  );
};
