import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './en/common';
import pl from './pl/common';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code:
// https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en,
  pl,
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
