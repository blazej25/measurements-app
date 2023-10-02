import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity} from 'react-native';
import { styles } from '../styles/common-styles';
/**
 * A reusable navigation button. It depends on the navigation object to navigate to
 * the required screen. The buttonTitle prop needs to be present in the localization
 * config so that it can be translated based on the language settings.
 */
export const NavigationButton = ({
  navigation,
  buttonTitle,
  destinationScreen: destination,
}: {
  navigation: any;
  buttonTitle: string;
  destinationScreen: string;
}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(destination)}
      style={styles.roundedButton1}>
      <Text style={{color: 'white'}}>{t(`translation:${buttonTitle}`)}</Text>
    </TouchableOpacity>
  );
};
