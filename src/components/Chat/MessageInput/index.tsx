/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useMemo,
} from 'react';

import { ICONS, locations as searchLocations } from 'utils/constants';
import * as S from './styles';

import {
  capitalizeFirstLetter,
  getAccessWriteType,
  getMatchedItems,
  getNextActionType,
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
import { INPUT_TYPES } from 'components/Layout/Input/types';

type PropsType = {};
interface IRenderInputProps {
  type:
    | CHAT_ACTIONS.SET_CATEGORY
    | CHAT_ACTIONS.SET_LOCATIONS
    | CHAT_ACTIONS.SET_ALERT_CATEGORY;
}
// TODO: utils
export const isResultsType = (type: CHAT_ACTIONS | null) => {
  return (
    !type ||
    type === CHAT_ACTIONS.FIND_JOB ||
    type === CHAT_ACTIONS.ASK_QUESTION ||
    type === CHAT_ACTIONS.SET_JOB_ALERT ||
    type === CHAT_ACTIONS.SET_CATEGORY ||
    type === CHAT_ACTIONS.GET_USER_EMAIL ||
    type === CHAT_ACTIONS.SET_ALERT_EMAIL ||
    type === CHAT_ACTIONS.SUCCESS_UPLOAD_CV ||
    type === CHAT_ACTIONS.REFINE_SEARCH ||
    type === CHAT_ACTIONS.ANSWER_QUESTIONS
  );
};
export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const {
    category,
    triggerAction,
    locations,
    categories,
    lastActionType,
    alertCategory,
    setError,
    error,
  } = useChatMessanger();
  // State
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const { searchItems, placeHolder, headerName } = useTextField({
    searchLocations,
    categories,
    category,
    lastActionType,
  });

  const matchedPositions = useMemo(() => {
    return draftMessage
      ? getMatchedItems({
          message: draftMessage,
          searchItems,
        })
      : searchItems;
  }, [searchItems, draftMessage]);

  // Callbacks
  const sendMessage = useCallback(
    (draftMessage: string) => {
      setIsFocus(false);
      setDraftMessage(null);

      if (lastActionType === CHAT_ACTIONS.APPLY_EMAIL) {
        const age = Number(draftMessage);
        if (age < 15 || age > 80) {
          setError('Incorrect age');
          return null;
        }
      }
      // TODO: matchedPositions[0] = "" = (!matchedPositions[0])
      const isNoJobMacthes =
        isResultsType(lastActionType) && matchedPositions[0] !== '';
      const actionType = getNextActionType(lastActionType, isNoJobMacthes);
      if (actionType) {
        triggerAction({
          type: actionType,
          payload: { item: draftMessage },
        });
      }
    },
    [lastActionType, matchedPositions.length]
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

  // Callbacks
  const onChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setDraftMessage(event.currentTarget.value);

    if (lastActionType === CHAT_ACTIONS.APPLY_EMAIL && error) {
      const age = Number(value);
      if (age < 15 || age > 80) {
        setError('');
      }
    }
    // TODO: refactor
    if (error) {
      const isEmailAndPhoneError =
        lastActionType === CHAT_ACTIONS.GET_USER_NAME;

      const updatedError = isEmailAndPhoneError
        ? validateEmailOrPhone(event.currentTarget.value)
        : validateEmail(event.currentTarget.value);

      !updatedError && setError(updatedError);
    }

    setNotification(null);
  };

  const onChangeLocations = (event: any, locations: string[]) => {
    triggerAction({
      type: CHAT_ACTIONS.SET_LOCATIONS,
      payload: { items: locations },
    });
    setIsFocus(false);
  };

  const renderInput = ({ type }: IRenderInputProps) => {
    const inputProps = {
      type,
      headerName: headerName,
      matchedItems: matchedPositions,
      matchedPart: capitalizeFirstLetter(draftMessage || ''),
      value: draftMessage || '',
      placeHolder: placeHolder || botTypingTxt,
      setIsFocus,
      isFocus,
      setInputValue: (value: string) => setDraftMessage(value),
    };
    if (type === CHAT_ACTIONS.SET_LOCATIONS) {
      return (
        <MultiSelectInput
          {...inputProps}
          type={CHAT_ACTIONS.SET_LOCATIONS}
          options={searchItems}
          onChange={onChangeLocations}
          values={locations}
        />
      );
    }
    return <Autocomplete {...inputProps} onChange={onChangeCategory} />;
  };

  // TODO: refactor
  const onClick = () => {
    if (file) {
      sendFile(file);
    } else if (draftMessage) {
      sendMessage(draftMessage);
    } else if (locations.length) {
      const items = locations;
      triggerAction({ type: CHAT_ACTIONS.SEND_LOCATIONS, payload: { items } });
    }
  };

  const botTypingTxt = i18n.t('placeHolders:bot_typing');
  // TODO: refactor
  const inputType =
    lastActionType === CHAT_ACTIONS.SET_JOB_ALERT
      ? CHAT_ACTIONS.SET_ALERT_CATEGORY
      : category
      ? CHAT_ACTIONS.SET_LOCATIONS
      : CHAT_ACTIONS.SET_CATEGORY;

  // TODO: refactor
  const isWriteAccess =
    getAccessWriteType(lastActionType) &&
    (file || draftMessage || !!locations.length);

  return (
    <S.MessagesInput
      isOffset={inputType === CHAT_ACTIONS.SET_LOCATIONS && !!locations.length}
    >
      <BurgerMenu />

      {renderInput({ type: inputType })}

      {isWriteAccess && (
        <S.PlaneIcon src={ICONS.INPUT_PLANE} width="16" onClick={onClick} />
      )}
    </S.MessagesInput>
  );
};
