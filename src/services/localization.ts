import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en, fr, ua} from 'assets/languages'
// import { EnvironmentMode } from '../utils/constants';

const resources = {
  en,
  fr,
  ua
};

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
  // debug: process.env.NODE_ENV === EnvironmentMode.Development,
});

export default i18n;
