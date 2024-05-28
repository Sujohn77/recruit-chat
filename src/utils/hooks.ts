import { ISearchRequisition } from "contexts/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import browserStorage from "store";
import firebase from "firebase";
import map from "lodash/map";
import "firebase/auth";

import { CHAT_ACTIONS, ILocalMessage } from "./types";
import { getFormattedLocations } from "./helpers";
import { useChatMessenger } from "contexts/MessengerContext";
import { IRequisitionType, useIsTabActive } from "services/hooks";
import i18n from "services/localization";

interface IUseTextField {
  currentMsgType: CHAT_ACTIONS | null;
  locations: string[];
  category: string | null;
  requisitions: ISearchRequisition[];
}

export const useTextField = () => {
  const { t } = useTranslation();
  const {
    category,
    currentMsgType,
    requisitions,
    locations,
    categoriesForAlert,
  } = useChatMessenger();

  const getTextFieldProps = useCallback(
    ({ currentMsgType, requisitions, locations }: IUseTextField) => {
      if (currentMsgType === CHAT_ACTIONS.SET_ALERT_CATEGORIES) {
        return {
          searchItems: categoriesForAlert,
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
    [categoriesForAlert]
  );

  return getTextFieldProps({
    currentMsgType,
    requisitions,
    locations: getFormattedLocations(locations),
    category,
  });
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
          console.log(
            "(Firebase) signInWithCustomToken SUCCESS SIGN IN",
            response
          );
          setIsAuthInFirebase(true);
          return { response };
        })
        .catch((error) => {
          console.log(
            "(Firebase) signInWithCustomToken Error --->",
            error?.message,
            error
          );
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

export const useGetMessageText = (mess: ILocalMessage) => {
  const { currentLanguage } = useChatMessenger();
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    if (mess.content.i18n && i18n.exists(mess.content.i18n)) {
      return mess.content.i18nProps
        ? t(mess.content.i18n, mess.content.i18nProps)
        : t(mess.content.i18n);
    } else if (mess?.content?.text) {
      return mess?.content?.text;
    } else return null;
  }, [currentLanguage]);
};

// This hook receives two parameters:
// storageKey: This is the name of our storage that gets used when we retrieve/save our persistent data.
// initialState: This is our default value, but only if the store doesn't exist, otherwise it gets overwritten by the store.
export const usePersistStore = <StateType>(
  storageKey: string,
  initialState: StateType,
  hostname: string
): [
  state: StateType,
  setState: React.Dispatch<React.SetStateAction<StateType>>
] => {
  const isTabActive = useIsTabActive();
  // Initiate the internal state.
  const [state, setInternalState] = useState<StateType>(initialState);

  // Only on our initial load, retrieve the data from the store and set the state to that data.
  useEffect(() => {
    if (isTabActive) {
      // Retrieve the data from the store.
      const storageInBrowser = browserStorage.get(storageKey);
      //if StateType includes null

      // If the store exists, overwrite the state with the store's data.
      // Otherwise if the store doesn't exist then "initialState" remains our default value.
      if (storageKey === hostname + "requisitions") {
        // @ts-ignore
        setInternalState(JSON.parse(storageInBrowser) as IRequisitionType[]);
      } else if (storageInBrowser) {
        setInternalState(storageInBrowser);
      }
    }
  }, [isTabActive]);

  // Create a replacement method that will set the state like normal, but that also saves the new state into the store.
  const setState = useCallback(
    (newState: StateType) => {
      if (isTabActive) {
        browserStorage.set(storageKey, newState);
        setInternalState(newState);
      }
    },
    [isTabActive]
  );

  return [state, setState];
};
