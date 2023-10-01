import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

export const en = {
  translation: {
    welcome: 'Welcome',
    aspiration: 'AspirationTest',
    flows: 'Flows',
    dust: 'Dust',
    h20: 'H20',
  },
};

export const pl = {
  welcome: 'Witaj',
  aspiration: 'Aspiracja',
  flows: 'Przepływy',
  dust: 'Pyły',
  h20: 'H20',
};

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code:
// https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  pl: pl,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'pl',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
