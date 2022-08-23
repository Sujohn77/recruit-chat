/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';

import { ICONS, Status } from 'utils/constants';
import * as S from './styles';

import {
  capitalizeFirstLetter,
  getAccessWriteType,
  getFormattedLocations,
  getMatchedItems,
  getNextActionType,
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
interface IRenderInputProps {
  type: CHAT_ACTIONS.SET_CATEGORY | CHAT_ACTIONS.SET_LOCATIONS | CHAT_ACTIONS.SET_ALERT_CATEGORY;
}

export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const { category, triggerAction, searchLocations, status, locations, requisitions, lastActionType, setError, error } =
    useChatMessanger();

  // State
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const { searchItems, placeHolder, headerName } = useTextField({
    locations: getFormattedLocations(locations),
    requisitions,
    category,
    lastActionType,
  });

  useEffect(() => {
    if (lastActionType === CHAT_ACTIONS.REFINE_SEARCH) {
      setIsFocus(true);
    }
  }, [lastActionType]);

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
    (draftMessage: string | null) => {
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
      const isNoJobMacthes = isResultsType(lastActionType) && !!draftMessage && searchItems.includes(draftMessage);
      const type = getNextActionType(lastActionType, isNoJobMacthes);

      if (type === CHAT_ACTIONS.SEND_LOCATIONS) {
        triggerAction({
          type,
          payload: { items: searchLocations },
        });
      } else if (type && draftMessage) {
        triggerAction({
          type,
          payload: {
            item: draftMessage,
          },
        });
      }
    },
    [lastActionType, matchedPositions.length, searchLocations.length]
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

    if (lastActionType === CHAT_ACTIONS.APPLY_AGE && error) {
      const age = Number(value);
      if (age < 15 || age > 80) {
        setError('');
      }
    }

    if (error) {
      const isEmailAndPhoneError = lastActionType === CHAT_ACTIONS.GET_USER_NAME;

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
    if (type === CHAT_ACTIONS.SET_LOCATIONS && status !== Status.PENDING) {
      return (
        <MultiSelectInput
          {...inputProps}
          type={CHAT_ACTIONS.SET_LOCATIONS}
          options={getFormattedLocations(locations)}
          onChange={onChangeLocations}
          values={searchLocations}
        />
      );
    }
    return <Autocomplete {...inputProps} onChange={onChangeCategory} />;
  };

  // TODO: refactor
  const onClick = () => {
    if (file) {
      sendFile(file);
    } else {
      sendMessage(draftMessage);
    }
  };

  const botTypingTxt = i18n.t('placeHolders:bot_typing');
  // TODO: refactor
  const inputType =
    lastActionType === CHAT_ACTIONS.SET_JOB_ALERT
      ? CHAT_ACTIONS.SET_ALERT_CATEGORY
      : category && lastActionType !== CHAT_ACTIONS.SEND_LOCATIONS
      ? CHAT_ACTIONS.SET_LOCATIONS
      : CHAT_ACTIONS.SET_CATEGORY;

  const isWriteAccess = getAccessWriteType(lastActionType) && (file || draftMessage || !!searchLocations.length);
  const offset = status !== Status.PENDING && !!searchLocations.length ? S.inputOffset : '0';

  return (
    <S.MessagesInput offset={offset}>
      <BurgerMenu />

      {renderInput({ type: inputType })}

      {isWriteAccess && <S.PlaneIcon src={ICONS.INPUT_PLANE} width="16" onClick={onClick} />}
    </S.MessagesInput>
  );
};
