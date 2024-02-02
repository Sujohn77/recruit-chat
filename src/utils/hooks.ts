/* eslint-disable react-hooks/exhaustive-deps */
import { ISearchRequisition } from "contexts/types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";
import firebase from "firebase";
import "firebase/auth";

import { CHAT_ACTIONS } from "./types";
import { searchAlertCategories } from "components/Chat/mockData";
import { useChatMessenger } from "contexts/MessengerContext";

interface IUseTextField {
  lastActionType: CHAT_ACTIONS | null;
  locations: string[];
  category: string | null;
  requisitions: ISearchRequisition[];
}

// TODO: refactor/test
export const useTextField = ({
  lastActionType,
  requisitions,
  locations,
  category,
}: IUseTextField) => {
  const { t } = useTranslation();

  const getTextFieldProps = useCallback(
    ({ lastActionType, requisitions, locations }: IUseTextField) => {
      if (lastActionType === CHAT_ACTIONS.SET_ALERT_CATEGORIES) {
        return {
          searchItems: searchAlertCategories,
          placeHolder: t("placeHolders:alert_category"),
          headerName: t("chat_item_description:all_categories"),
          subHeaderName: null,
        };
      }

      if (
        lastActionType === CHAT_ACTIONS.SET_LOCATIONS ||
        lastActionType === CHAT_ACTIONS.SET_ALERT_JOB_LOCATIONS
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
          lastActionType === CHAT_ACTIONS.SET_CATEGORY
            ? t("placeHolders:message")
            : lastActionType === CHAT_ACTIONS.ANSWER_QUESTIONS
            ? t("placeHolders:startTyping")
            : t("placeHolders:default"),
        // TODO: add translation =)
        subHeaderName:
          "We have processed your resume and found the following jobs",
      };
    },
    []
  );

  const inputProps = getTextFieldProps({
    lastActionType,
    requisitions,
    locations,
    category,
  });

  return inputProps;
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

export const useDetectCountry = (): string => {
  const [country, setCountry] = useState<string>("US");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data: { country_code?: string }) => {
        data.country_code && setCountry(data.country_code);
      });
  }, []);

  return country;
};
