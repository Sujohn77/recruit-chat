/* eslint-disable react-hooks/exhaustive-deps */
import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import {
  FC,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";

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

export const MessageInput: FC = () => {
  const { t } = useTranslation();
  const { file, setNotification } = useFileUploadContext();
  const {
    category,
    triggerAction,
    searchLocations,
    status,
    locations,
    currentMsgType,
    setError,
    error,
    requisitions,
  } = useChatMessenger();

  // State
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
  const [isLoading, setIsLoading] = useState(false);

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
      }),
    [searchItems, draftMessage, searchLocations]
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
            ? [...inputValues, matchedSearchItem]
            : inputValues,
        };

        actionType &&
          triggerAction({
            type: actionType,
            payload,
          });
      } else {
        triggerAction({
          type:
            isNoMatches || !currentMsgType
              ? CHAT_ACTIONS.NO_MATCH
              : currentMsgType,
          payload: { item: draftMessage },
        });
      }

      // setIsShowResults(false);
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
        draftMessage && sendMessage(draftMessage);
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
      if (!newValues.some((location) => location === newLocation))
        newValues = [...newValues, newLocation];
    }

    if (currentMsgType) {
      setInputValues(newValues);
      triggerAction({
        type: currentMsgType,
        payload: { items: newValues },
      });
    }
  };

  const onClick = async () => {
    if (
      (currentMsgType !== CHAT_ACTIONS.SET_CATEGORY || requisitions.length) &&
      !isLoading
    ) {
      sendMessage(draftMessage);
      setIsShowResults(false);
    }

    if (currentMsgType === CHAT_ACTIONS.ASK_QUESTION && !isLoading) {
      sendMessage(draftMessage);
      setIsShowResults(false);
    }
  };

  const isWriteAccess =
    getAccessWriteType(currentMsgType) &&
    (file || draftMessage || !!inputValues.length);

  const offset =
    status !== Status.PENDING && inputType === TextFieldTypes.MultiSelect
      ? S.inputOffset
      : "0";

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
    setInputValue: (value: string) => {
      setError(null);
      setDraftMessage(value);
    },
  };

  return (
    <S.MessagesInput offset={offset}>
      <BurgerMenu />

      {inputType === TextFieldTypes.MultiSelect ? (
        <MultiSelectInput
          {...inputProps}
          onChange={onChangeAutocomplete}
          values={inputValues}
        />
      ) : (
        <Autocomplete {...inputProps} onChange={onChangeCategory} />
      )}

      {isWriteAccess && (
        <S.PlaneIcon
          onClick={onClick}
          disabled={isLoading}
          src={ICONS.INPUT_PLANE}
          width="16"
        />
      )}
    </S.MessagesInput>
  );
};
