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
  getMatchedItems,
  validateEmail,
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
  type:
    | CHAT_ACTIONS.SET_CATEGORY
    | CHAT_ACTIONS.SET_LOCATIONS
    | CHAT_ACTIONS.SET_ALERT_CATEGORY;
}
export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const {
    addMessage,
    category,
    triggerAction,
    locations,
    setLastActionType,
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
      const isAlertEmail = lastActionType === CHAT_ACTIONS.SET_ALERT_EMAIL;

      if (!isAlertEmail) {
        addMessage({ text: draftMessage });
      }

      setIsFocus(false);
      setDraftMessage(null);

      const isCategory = matchedPositions.findIndex((m) => m === '') !== -1;
      const actionType = alertCategory
        ? lastActionType!
        : isCategory && CHAT_ACTIONS.SET_CATEGORY;

      if (actionType) {
        triggerAction({
          type: actionType,
          payload: { item: draftMessage },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      matchedPositions,
      addMessage,
      setLastActionType,
      alertCategory,
      lastActionType,
      triggerAction,
    ]
  );

  // Effects
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
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
    setDraftMessage(event.currentTarget.value);
    if (error) {
      const updatedError = validateEmail(event.currentTarget.value);
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

  const onClick = () => {
    if (file) {
      sendFile(file);
    } else if (draftMessage) {
      sendMessage(draftMessage);
    } else if (locations) {
      const items = locations;
      triggerAction({ type: CHAT_ACTIONS.SEND_LOCATIONS, payload: { items } });
    }
  };

  const botTypingTxt = i18n.t('placeHolders:bot_typing');
  const type =
    lastActionType === CHAT_ACTIONS.SET_JOB_ALERT
      ? CHAT_ACTIONS.SET_ALERT_CATEGORY
      : category
      ? CHAT_ACTIONS.SET_LOCATIONS
      : CHAT_ACTIONS.SET_CATEGORY;

  const isEmptyTextField = !draftMessage && !file && !locations.length;
  return (
    <S.MessagesInput
      isOffset={type === CHAT_ACTIONS.SET_LOCATIONS && !!locations.length}
    >
      <BurgerMenu />

      {renderInput({ type })}

      {!isEmptyTextField && (
        <S.PlaneIcon src={ICONS.INPUT_PLANE} width="16" onClick={onClick} />
      )}
    </S.MessagesInput>
  );
};
