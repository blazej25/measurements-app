import React, {useLayoutEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors, defaultBorderRadius, styles} from '../styles/common-styles';

export const LanguageScreen = ({navigation, route}: any) => {
  const {t, i18n} = useTranslation();
  const [language, changeLanguage] = useState('pl');
  const currentLanguageCode = i18n.language;

  const languages = [
    // Language List
    {code: 'en', label: t('userInterface:english')},
    {code: 'pl', label: t('userInterface:polish')},
  ];
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: t('userInterface:settings'),
    });
    return () => {};
  }, [navigation, language]);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
      }}>
      <Text
        style={{
          ...styles.defaultHeader,
          color: colors.buttonBlue,
          marginBottom: 20,
        }}>
        {' '}
        {t('userInterface:changeLanguage')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {languages.map((currentLang, i) => {
          const isLanguageSelected = currentLang.code === currentLanguageCode;
          return (
            <TouchableOpacity
              style={{
                borderRadius: defaultBorderRadius,
                backgroundColor: colors.secondaryBlue,
                margin: 10,
              }}
              key={i}
              onPress={() => {
                changeLanguage(currentLang.code);
                i18n.changeLanguage(currentLang.code); // it will change the language through out the app.
              }}>
              <Text
                style={{
                  padding: 10,
                  color: isLanguageSelected ? colors.buttonBlue : 'gray',
                  fontSize: 18,
                  fontWeight: isLanguageSelected ? 'bold' : 'normal',
                }}>
                {currentLang.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
