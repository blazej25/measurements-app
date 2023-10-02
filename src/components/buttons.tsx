import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity} from 'react-native';
import { styles } from '../styles/common-styles';

/**
 * A reusable navigation button. It depends on the navigation object to navigate to
 * the required screen. The destinationScreen prop needs to correspond to the name
 * of the screen as defined in constants.ts.
 * */
export const NavigationButton = ({
  navigation,
  destinationScreen,
}: {
  navigation: any;
  destinationScreen: string,
}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(destinationScreen)}
      style={styles.roundedButton1}>
      <Text style={styles.buttonText1}>{t(`translation:${destinationScreen}`)}</Text>
    </TouchableOpacity>
  );
};
