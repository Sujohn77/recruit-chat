import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en, fr, ua } from "services/languages";

const resources = {
  en,
  fr,
  ua,
};

i18n.use(initReactI18next).init({
  lng: "en",
  resources,
});

export default i18n;
