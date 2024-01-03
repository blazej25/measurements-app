import React, {useLayoutEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import {colors, styles} from '../styles/common-styles';

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
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginBottom: 5,
      }}>
      <Text style={{...styles.defaultHeader, alignSelf: 'flex-start'}}> {t('userInterface:changeLanguage')}</Text>
      {languages.map((currentLang, i) => {
        const isLanguageSelected = currentLang.code === currentLanguageCode;
        return (
          <Text
            key={i}
            onPress={() => {
              changeLanguage(currentLang.code);
              i18n.changeLanguage(currentLang.code); // it will change the language through out the app.
            }}
            style={{
              color: isLanguageSelected ? colors.buttonBlue : 'black',
              padding: 10,
              fontSize: 18,
              fontWeight: isLanguageSelected ? 'bold' : 'normal',
            }}>
            {currentLang.label}
          </Text>
        );
      })}
    </View>
  );
};
