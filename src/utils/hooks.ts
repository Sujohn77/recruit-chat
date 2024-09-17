import { ISearchRequisition } from "contexts/types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import browserStorage from "store";
import firebase from "firebase";
import map from "lodash/map";
import "firebase/auth";

import { CHAT_ACTIONS, ILocalMessage } from "./types";
import { getFormattedLocations, postMessToParent } from "./helpers";
import { useChatMessenger } from "contexts/MessengerContext";
import { IRequisitionType, useIsTabActive } from "services/hooks";
import i18n from "services/localization";
import {
  ChatScreens,
  EventIds,
  isMobile,
  REFRESH_TOKEN_TIMEOUT,
} from "./constants";
import isNull from "lodash/isNull";

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
    }
  }, [firebaseToken]);
};

export const useDetectCountry = (
  lowerCase = true,
  isReferralEnabled = false
): string => {
  const [country, setCountry] = useState<string>(
    localStorage.getItem("country_code") || "us"
  );

  useEffect(() => {
    if (isReferralEnabled) {
      fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data: { country_code?: string }) => {
          if (data.country_code) {
            setCountry(data.country_code);
            localStorage.setItem("country_code", data.country_code);
          }
        });
    }
  }, [isReferralEnabled]);

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

      const stateType = typeof initialState;

      // If the store exists, overwrite the state with the store's data.
      // Otherwise if the store doesn't exist then "initialState" remains our default value.
      if (storageKey === hostname + "requisitions") {
        // @ts-ignore
        setInternalState(JSON.parse(storageInBrowser) as IRequisitionType[]);
      } else if (storageInBrowser) {
        switch (stateType) {
          case "string":
            setInternalState(storageInBrowser);
            break;
          case "boolean":
            if (typeof storageInBrowser === "string") {
              // @ts-ignore
              setInternalState(storageInBrowser === "true");
            }
            break;
          case "number":
            // @ts-ignore
            setInternalState(Number(storageInBrowser));
            break;
          default:
            break;
        }
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

export const useChatbotSideEffects = (isSelectedOption: boolean) => {
  const firstTime = useRef<Date>(new Date());
  const { chatScreen, setIsApplyJobFlow } = useChatMessenger();

  useEffect(() => {
    // for parent iframe height size
    window.parent.postMessage(
      JSON.parse(
        JSON.stringify({
          event_id: EventIds.IFrameHeight,
          isSelectedOption: isSelectedOption,
          isMobile: isMobile,
        })
      ),
      "*"
    );
  }, [isSelectedOption]);

  useEffect(() => {
    if (chatScreen !== ChatScreens.FindAJob) {
      setIsApplyJobFlow(false);
    }
  }, [chatScreen]);

  useEffect(() => {
    // REFRESH TOKEN
    let timeout: NodeJS.Timeout | undefined;
    let interval: NodeJS.Timer | undefined;

    // the candidate may not initiate the chatbot for a long time (not selected anything in init screen)
    // in this case do not start the interval for token refresh
    if (!isNull(chatScreen)) {
      const currentTime = new Date();
      const difference = currentTime.getTime() - firstTime.current.getTime(); // difference in milliseconds
      let resultInMinutes = Math.round(difference / 60000);

      // when the candidate selects one of the chatbot options (ask a question or find a job)
      // then check how much time the token has left
      // and if it has expired then immediately refresh the token
      // and start an interval that will refresh the token after 29 minutes.

      if (resultInMinutes === 0) {
        // candidate chose the option immediately
        interval = setInterval(() => {
          postMessToParent(EventIds.RefreshToken);
        }, REFRESH_TOKEN_TIMEOUT);
      } else if (resultInMinutes > 28) {
        // if token exp.
        postMessToParent(EventIds.RefreshToken);
        interval = setInterval(() => {
          postMessToParent(EventIds.RefreshToken);
        }, REFRESH_TOKEN_TIMEOUT);
      } else {
        // otherwise we calculate how much time is left and start a timeout with the remaining time as prop.
        // and in the same timeout start an interval that will update the token every 29 min.

        const minutes = !!resultInMinutes ? 28 - resultInMinutes : 1;

        console.log(
          `%c no token expired soon -> refresh token (timeout ms: ${
            minutes * 60 * 1000
          }, min: ${minutes} ) + add interval for refresh token`,
          "background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 1em; padding: 5px;"
        );

        timeout = setTimeout(() => {
          postMessToParent(EventIds.RefreshToken);
          sessionStorage.clear();

          interval = setInterval(() => {
            postMessToParent(EventIds.RefreshToken);
          }, REFRESH_TOKEN_TIMEOUT);
        }, minutes * 60 * 1000);
      }

      firstTime.current = new Date();
    }

    return () => {
      timeout && clearTimeout(timeout);
      interval && clearInterval(interval);
    };
  }, [chatScreen]);
};
