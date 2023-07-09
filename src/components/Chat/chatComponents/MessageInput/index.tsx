/* eslint-disable react-hooks/exhaustive-deps */
import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import React, {
  FC,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import uniq from "lodash/uniq";
import "../../../../services/firebase/config";

import * as S from "./styles";
import { ICONS } from "assets";
import { Status, TextFieldTypes } from "utils/constants";
import {
  getAccessWriteType,
  getFormattedLocations,
  getInputType,
  getMatchedItem,
  getMatchedItems,
  getNextActionType,
  isResults,
  isResultsType,
  validateEmail,
  validateEmailOrPhone,
} from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";
import { useTextField } from "utils/hooks";
import { MultiSelectInput, Autocomplete, BurgerMenu } from "components/Layout";
import firebase from "firebase";
import "firebase/auth";

interface IMessageInputProps {
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

export const MessageInput: FC<IMessageInputProps> = ({ setHeight }) => {
  const { t } = useTranslation();
  const { file, setNotification, showJobTitles } = useFileUploadContext();
  const {
    category,
    dispatch,
    searchLocations,
    status,
    locations,
    currentMsgType,
    setError,
    error,
    requisitions,
    chooseButtonOption,
    isChatLoading,
    alertCategories,
    isAlreadyPassEmail,
    chatBotToken,
  } = useChatMessenger();

  useEffect(() => {
    if (chatBotToken) {
      console.log("====================================");
      console.log("chatBotToken", chatBotToken);
      console.log("====================================");
      // reinitializeAppWithoutLongPolling().then(() => {
      firebase
        .auth()
        .signInWithCustomToken(chatBotToken)
        .then((response) => {
          console.log("====================================");
          console.log("SUCCESS SIGN IN", response);
          console.log("====================================");
          return { response };
        })
        .catch((error) => {
          console.log("====================================");
          console.log("Error --->", error?.message, error);
          console.log("====================================");
          return { error };
        });
      // });
    }
  }, [isAlreadyPassEmail, chatBotToken]);

  // ---------------------- State --------------------- //
  const formattedLocations = getFormattedLocations(locations);
  const { searchItems, placeHolder, headerName, subHeaderName } = useTextField({
    locations: formattedLocations,
    requisitions,
    category,
    lastActionType: currentMsgType,
  });
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [isShowResults, setIsShowResults] = useState(false);

  // ------------------------------------------------- //

  useEffect(() => {
    showJobTitles && setIsShowResults(showJobTitles);
  }, [showJobTitles]);

  useEffect(() => {
    if (
      currentMsgType === CHAT_ACTIONS.SET_CATEGORY &&
      (!!draftMessage || !!file)
    ) {
      setIsShowResults(true);
    }
  }, [currentMsgType]);

  const inputType = useMemo(
    () => getInputType({ actionType: currentMsgType, category }),
    [category, currentMsgType]
  );

  const { matchedPart, matchedItems } = useMemo(
    () =>
      getMatchedItems({
        message: draftMessage,
        searchItems,
        searchLocations,
        alertCategories:
          currentMsgType === CHAT_ACTIONS.SET_ALERT_CATEGORIES
            ? alertCategories
            : undefined,
      }),
    [
      searchItems,
      draftMessage,
      searchLocations,
      currentMsgType,
      alertCategories,
    ]
  );

  // Callbacks
  const sendMessage = useCallback(
    (draftMessage: string | null) => {
      const isCategoryOrLocation = isResultsType({
        type: currentMsgType,
        matchedItems,
      });
      const isNoMatches =
        isCategoryOrLocation && !isResults({ draftMessage, searchItems });
      const matchedSearchItem = getMatchedItem({ searchItems, draftMessage });

      if (inputType === TextFieldTypes.MultiSelect) {
        const isSelectedValues = matchedSearchItem || inputValues.length;
        const actionType =
          isSelectedValues && currentMsgType
            ? getNextActionType(currentMsgType)
            : CHAT_ACTIONS.NO_MATCH;
        const payload = {
          items: !!matchedSearchItem
            ? uniq([...inputValues, matchedSearchItem])
            : uniq(inputValues),
        };

        actionType &&
          dispatch({
            type: actionType,
            payload,
          });
      } else {
        dispatch({
          type:
            isNoMatches || !currentMsgType
              ? CHAT_ACTIONS.NO_MATCH
              : currentMsgType,
          payload: { item: draftMessage },
        });
      }

      setDraftMessage(null);
    },
    [currentMsgType, matchedItems.length, searchLocations.length, inputValues]
  );

  // Effects
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const isWriteAccess = getAccessWriteType(currentMsgType) || file;
      if (event.key === "Enter" && isWriteAccess) {
        event.preventDefault();
        onSendMessage();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [draftMessage, sendMessage]);

  useEffect(() => {
    if (currentMsgType === CHAT_ACTIONS.SEND_LOCATIONS) {
      setInputValues([]);
    }
  }, [currentMsgType]);

  // Callbacks
  const onChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setError(null);

    if (error) {
      if (currentMsgType === CHAT_ACTIONS.APPLY_AGE && error) {
        // TODO: test

        const age = Number(value);
        if (age < 15 || age > 80) {
          setError(null);
        }
      } else if (currentMsgType === CHAT_ACTIONS.GET_USER_NAME) {
        const isPhone = currentMsgType === CHAT_ACTIONS.GET_USER_NAME;
        const isError = isPhone
          ? validateEmailOrPhone(value)
          : validateEmail(value);
        !isError.trim() && setError(null);
      }
    }

    setDraftMessage(value);
    setNotification(null);
  };

  const onChangeAutocomplete = (
    e: ChangeEvent<HTMLInputElement>,
    values: string[]
  ) => {
    const newLocation = e?.currentTarget?.textContent;
    let newValues = values.filter(Boolean);

    if (newLocation) {
      const lastLocation = newValues[newValues.length - 1];
      const numberOfCharacters = newLocation.length - lastLocation?.length;

      // it needs to be because of a bug. If you enter a value in the search box and select a location,
      // the location will be listed without the characters entered in the input box
      if (newLocation?.substring(numberOfCharacters) === lastLocation) {
        if (newValues.length > 1) {
          newValues = [
            ...newValues.slice(0, newValues.length - 1),
            newLocation,
          ];
        } else {
          newValues = [];
        }
      }

      if (!newValues.some((location) => location === newLocation))
        newValues = [...newValues, newLocation];
    }

    if (currentMsgType) {
      setInputValues(uniq(newValues));
      setDraftMessage(null);
      dispatch({
        type: currentMsgType,
        payload: { items: uniq(newValues) },
      });
    }
  };

  const onSendMessage = async () => {
    if (!isChatLoading) {
      if (currentMsgType !== CHAT_ACTIONS.SET_CATEGORY || requisitions.length) {
        sendMessage(draftMessage);
        setIsShowResults(false);
      }

      if (currentMsgType === CHAT_ACTIONS.ASK_QUESTION) {
        draftMessage && chooseButtonOption(draftMessage);
      }
    }
  };

  const isWriteAccess =
    getAccessWriteType(currentMsgType) &&
    (file || draftMessage || !!inputValues.length);

  const marginTop =
    status !== Status.PENDING && inputType === TextFieldTypes.MultiSelect
      ? "-30px"
      : "0px";

  const inputProps = {
    type: inputType,
    headerName: headerName,
    subHeaderName,
    matchedItems,
    matchedPart,
    value: draftMessage || "",
    placeHolder: placeHolder || t("placeHolders:bot_typing"),
    setIsShowResults,
    isShowResults,
    setHeight,
    setInputValue: (value: string) => {
      setError(null);
      setDraftMessage(value);
    },
  };

  return (
    <S.MessagesInput marginTop={marginTop}>
      <BurgerMenu setIsShowResults={setIsShowResults} />

      {inputType === TextFieldTypes.MultiSelect ? (
        <MultiSelectInput
          {...inputProps}
          values={inputValues}
          onChange={onChangeAutocomplete}
        />
      ) : (
        <Autocomplete {...inputProps} onChange={onChangeCategory} />
      )}

      {isWriteAccess && (
        <S.PlaneIcon
          onClick={onSendMessage}
          disabled={isChatLoading}
          src={ICONS.INPUT_PLANE}
          width="16"
        />
      )}
    </S.MessagesInput>
  );
};
