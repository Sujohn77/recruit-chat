import { ISearchRequisition } from "contexts/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";
import firebase from "firebase";
import "firebase/auth";

import { CHAT_ACTIONS } from "./types";
import { getFormattedLocations } from "./helpers";
import { searchAlertCategories } from "components/Chat/mockData";
import { useChatMessenger } from "contexts/MessengerContext";
import i18n from "services/localization";

interface IUseTextField {
  currentMsgType: CHAT_ACTIONS | null;
  locations: string[];
  category: string | null;
  requisitions: ISearchRequisition[];
}

export const useTextField = () => {
  const { t } = useTranslation();
  const { category, currentMsgType, requisitions, locations } =
    useChatMessenger();

  const getTextFieldProps = useCallback(
    ({ currentMsgType, requisitions, locations }: IUseTextField) => {
      if (currentMsgType === CHAT_ACTIONS.SET_ALERT_CATEGORIES) {
        return {
          searchItems: searchAlertCategories,
          placeHolder: t("placeHolders:alert_category"),
          headerName: t("chat_item_description:all_categories"),
          subHeaderName: null,
        };
      }

      if (
        currentMsgType === CHAT_ACTIONS.SET_LOCATIONS ||
        currentMsgType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS
      ) {
        return {
          searchItems: locations,
          placeHolder: t("placeHolders:chooseLocation"),
          headerName: t("chat_item_description:locations_title"),
          subHeaderName: null,
        };
      }

      return {
        searchItems: map(requisitions, (r) => r.title),
        headerName: t("chat_item_description:categories_title"),
        placeHolder:
          currentMsgType === CHAT_ACTIONS.SET_CATEGORY
            ? t("placeHolders:message")
            : currentMsgType === CHAT_ACTIONS.ANSWER_QUESTIONS
            ? t("placeHolders:startTyping")
            : t("placeHolders:default"),
        subHeaderName: i18n.t("messages:processed_your_resume"),
      };
    },
    []
  );

  return getTextFieldProps({
    currentMsgType,
    requisitions,
    locations: getFormattedLocations(locations),
    category,
  });
};

export const useApiKey = () => {
  const url: any = new URL(window.location.href);
  let apiKey: undefined | string = undefined;

  for (const p of url.searchParams.entries()) {
    const [key, value] = p;

    if (key === "apikey") {
      apiKey = value;
      break;
    }
  }

  return apiKey;
};

export const useFirebaseSignIn = () => {
  const { firebaseToken, setIsAuthInFirebase } = useChatMessenger();

  useEffect(() => {
    if (firebaseToken) {
      // reinitializeAppWithoutLongPolling().then(() => {
      firebase
        .auth()
        .signInWithCustomToken(firebaseToken)
        .then((response) => {
          console.log("(Firebase) SUCCESS SIGN IN", response);
          setIsAuthInFirebase(true);
          return { response };
        })
        .catch((error) => {
          console.log("(Firebase) SIGN IN Error --->", error?.message, error);
          return { error };
        });
      // });
    }
  }, [firebaseToken]);
};

export const useDetectCountry = (lowerCase = true): string => {
  const [country, setCountry] = useState<string>("us");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data: { country_code?: string }) => {
        data.country_code && setCountry(data.country_code);
      });
  }, []);

  return lowerCase ? country.toLowerCase() : country;
};
