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
import * as S from "./styles";
import { ICONS } from "assets";

type PropsType = {};

export const MessageInput: FC<PropsType> = () => {
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
  const { searchItems, placeHolder, headerName } = useTextField({
    locations: formattedLocations,
    requisitions,
    category,
    lastActionType: currentMsgType,
  });
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [isShowResults, setIsShowResults] = useState(false);

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
        !isError && setError(null);
      }
    }

    setDraftMessage(value);
    setNotification(null);
  };

  const onChangeAutocomplete = (event: any, values: string[]) => {
    const newValues = values.filter(Boolean);
    if (currentMsgType && newValues.length) {
      setInputValues(newValues);
      triggerAction({
        type: currentMsgType,
        payload: { items: values },
      });
    }

    // setIsShowResults(false);
  };

  const renderInput = (type: TextFieldTypes) => {
    const inputProps = {
      type,
      headerName: headerName,
      matchedItems,
      matchedPart,
      value: draftMessage || "",
      placeHolder: placeHolder || t("placeHolders:bot_typing"),
      setIsShowResults,
      isShowResults,
      setInputValue: (value: string) => setDraftMessage(value),
    };

    if (type === TextFieldTypes.MultiSelect) {
      return (
        <MultiSelectInput
          {...inputProps}
          onChange={onChangeAutocomplete}
          values={inputValues}
        />
      );
    }
    return <Autocomplete {...inputProps} onChange={onChangeCategory} />;
  };

  const onClick = () => {
    if (currentMsgType !== CHAT_ACTIONS.SET_CATEGORY || requisitions.length) {
      sendMessage(draftMessage);
    }
  };

  const isWriteAccess =
    getAccessWriteType(currentMsgType) &&
    (file || draftMessage || !!inputValues.length);
  const offset =
    status !== Status.PENDING && inputType === TextFieldTypes.MultiSelect
      ? S.inputOffset
      : "0";

  return (
    <S.MessagesInput offset={offset}>
      <BurgerMenu />

      {renderInput(inputType)}

      {isWriteAccess && (
        <S.PlaneIcon src={ICONS.INPUT_PLANE} width="16" onClick={onClick} />
      )}
    </S.MessagesInput>
  );
};
