/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';

import { ICONS, Status, TextFieldTypes } from 'utils/constants';
import * as S from './styles';

import {
  capitalizeFirstLetter,
  getAccessWriteType,
  getFormattedLocations,
  getInputType,
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

export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const { category, triggerAction, searchLocations, status, locations, requisitions, lastActionType, setError, error } =
    useChatMessanger();

  // State
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [isShowResults, setIsShowResults] = useState(false);
  const formattedLocations = getFormattedLocations(locations);
  const { searchItems, placeHolder, headerName } = useTextField({
    locations: formattedLocations,
    requisitions,
    category,
    lastActionType,
  });

  useEffect(() => {
    if (lastActionType === CHAT_ACTIONS.REFINE_SEARCH) {
      setIsShowResults(true);
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
      setIsShowResults(false);
      setDraftMessage(null);

      if (lastActionType === CHAT_ACTIONS.APPLY_EMAIL) {
        const age = Number(draftMessage);
        if (age < 15 || age > 80) {
          setError('Incorrect age');
          return null;
        } else {
          setError('');
        }
      }

      const isNoMatches =
        isResultsType(lastActionType) &&
        !!draftMessage &&
        !searchItems.find((s) => s.toLowerCase() === draftMessage.toLowerCase());
      const type = getNextActionType(lastActionType, isNoMatches);

      if (type === CHAT_ACTIONS.SEND_LOCATIONS) {
        triggerAction({
          type,
          payload: { items: searchLocations },
        });
      } else if (type === CHAT_ACTIONS.SET_LOCATIONS && !isNoMatches) {
        const location = formattedLocations.find((l) => l.toLowerCase() === draftMessage?.toLowerCase());
        triggerAction({
          type,
          payload: { items: [location] },
        });
      } else {
        triggerAction({
          type,
          payload: { item: draftMessage },
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
    setIsShowResults(false);
  };

  const renderInput = (type: TextFieldTypes) => {
    const inputProps = {
      type,
      headerName: headerName,
      matchedItems: matchedPositions.map((m) => m.slice(draftMessage?.length, m.length)),
      matchedPart:
        matchedPositions.length && draftMessage?.length ? matchedPositions[0].slice(0, draftMessage.length) : '',
      value: draftMessage || '',
      placeHolder: placeHolder || botTypingTxt,
      setIsShowResults,
      isShowResults,
      setInputValue: (value: string) => setDraftMessage(value),
    };
    if (type === TextFieldTypes.MultiSelect && status !== Status.PENDING) {
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

  const onClick = () => {
    if (file) {
      sendFile(file);
    } else {
      sendMessage(draftMessage);
    }
  };

  const botTypingTxt = i18n.t('placeHolders:bot_typing');

  const inputType = getInputType({ lastActionType, category });

  const isWriteAccess = getAccessWriteType(lastActionType) && (file || draftMessage || !!searchLocations.length);
  const offset = status !== Status.PENDING && !!searchLocations.length ? S.inputOffset : '0';

  return (
    <S.MessagesInput offset={offset}>
      <BurgerMenu />

      {renderInput(inputType)}

      {isWriteAccess && <S.PlaneIcon src={ICONS.INPUT_PLANE} width="16" onClick={onClick} />}
    </S.MessagesInput>
  );
};
