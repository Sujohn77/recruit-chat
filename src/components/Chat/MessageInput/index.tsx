/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useMemo,
} from 'react';

import { ICONS, Status, TextFieldTypes } from 'utils/constants';
import * as S from './styles';

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
} from 'utils/helpers';
import { useChatMessanger } from 'contexts/MessangerContext';
import { CHAT_ACTIONS } from 'utils/types';
import { useFileUploadContext } from 'contexts/FileUploadContext';
import { MultiSelectInput } from 'components/Layout/Input/MultiSelectInput';
import { Autocomplete } from 'components/Layout/Input/Autocomplete';
import BurgerMenu from 'components/Layout/BurgerMenu';
import i18n from 'services/localization';
import { useTextField } from 'utils/hooks';

type PropsType = {};

export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const {
    category,
    triggerAction,
    searchLocations,
    status,
    locations,
    requisitions,
    lastActionType,
    setError,
    error,
  } = useChatMessanger();

  // State
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [isShowResults, setIsShowResults] = useState(false);
  const formattedLocations = getFormattedLocations(locations);
  const { searchItems, placeHolder, headerName } = useTextField({
    locations: formattedLocations,
    requisitions,
    category,
    lastActionType,
  });
  console.log(searchItems);
  const inputType = useMemo(
    () => getInputType({ lastActionType, category }),
    [category, lastActionType]
  );

  useEffect(() => {
    if (lastActionType === CHAT_ACTIONS.REFINE_SEARCH) {
      setIsShowResults(true);
    }
  }, [lastActionType]);

  const { matchedPart, matchedItems } = useMemo(
    () =>
      getMatchedItems({
        message: draftMessage,
        searchItems,
        searchLocations,
      }),
    [searchItems, draftMessage, searchLocations]
  );
  console.log(lastActionType);
  // Callbacks
  const sendMessage = useCallback(
    (draftMessage: string | null) => {
      const type = getNextActionType(lastActionType);
      const isCategoryOrLocation = isResultsType(lastActionType);
      const isNoMatches =
        isCategoryOrLocation && !isResults({ draftMessage, searchItems });
      const matchedSearchItem = getMatchedItem({ searchItems, draftMessage });

      if (inputType === TextFieldTypes.MultiSelect) {
        const isSelectedValues = matchedSearchItem || inputValues.length;
        const actionType = isSelectedValues
          ? getNextActionType(lastActionType)
          : CHAT_ACTIONS.NO_MATCH;
        const payload = {
          items: !!matchedSearchItem
            ? [...inputValues, matchedSearchItem]
            : inputValues,
        };

        triggerAction({
          type: actionType,
          payload,
        });
      } else {
        triggerAction({
          type: isNoMatches ? CHAT_ACTIONS.NO_MATCH : type,
          payload: { item: draftMessage },
        });
      }

      setIsShowResults(false);
      setDraftMessage(null);
    },
    [lastActionType, matchedItems.length, searchLocations.length, inputValues]
  );

  // Effects
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const isWriteAccess = getAccessWriteType(lastActionType) || file;
      if (event.key === 'Enter' && isWriteAccess) {
        event.preventDefault();
        draftMessage && sendMessage(draftMessage);
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [draftMessage, sendMessage]);

  useEffect(() => {
    if (lastActionType === CHAT_ACTIONS.SEND_LOCATIONS) {
      setInputValues([]);
    }
  }, [lastActionType]);

  // Callbacks
  const onChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (error) {
      if (lastActionType === CHAT_ACTIONS.APPLY_AGE && error) {
        const age = Number(value);
        if (age < 15 || age > 80) {
          setError(null);
        }
      } else if (lastActionType === CHAT_ACTIONS.GET_USER_NAME) {
        const isPhone = lastActionType === CHAT_ACTIONS.GET_USER_NAME;
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
    const type =
      lastActionType !== CHAT_ACTIONS.SET_LOCATIONS &&
      lastActionType !== CHAT_ACTIONS.SET_ALERT_CATEGORIES
        ? getNextActionType(lastActionType)
        : lastActionType;
    const newValues = values.filter(Boolean);
    if (type && newValues.length) {
      setInputValues(newValues);
      triggerAction({
        type,
        payload: { items: values },
      });
    }

    setIsShowResults(false);
  };

  const renderInput = (type: TextFieldTypes) => {
    const inputProps = {
      type,
      headerName: headerName,
      matchedItems,
      matchedPart,
      value: draftMessage || '',
      placeHolder: placeHolder || botTypingTxt,
      setIsShowResults,
      isShowResults,
      setInputValue: (value: string) => setDraftMessage(value),
    };
    console.log(
      'is multi select ',
      status,
      type === TextFieldTypes.MultiSelect && status !== Status.PENDING
    );
    if (type === TextFieldTypes.MultiSelect && status !== Status.PENDING) {
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
    if (file) {
      sendFile(file);
    } else {
      sendMessage(draftMessage);
    }
  };

  const botTypingTxt = i18n.t('placeHolders:bot_typing');

  const isWriteAccess =
    getAccessWriteType(lastActionType) &&
    (file || draftMessage || !!inputValues.length);
  const offset =
    status !== Status.PENDING && !!searchLocations.length ? S.inputOffset : '0';

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
