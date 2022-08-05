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

import { capitalizeFirstLetter, getMatchedItems } from 'utils/helpers';
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
    addMessage,
    category,
    triggerAction,
    locations,
    setLastActionType,
    categories,
    lastActionType,
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
  const onClick = useCallback(
    (draftMessage: string) => {
      addMessage({
        text: draftMessage,
        isCategory:
          !!matchedPositions.length &&
          matchedPositions.findIndex((m) => m === '') !== -1,
      });

      setDraftMessage(null);
      setIsFocus(false);
      setLastActionType(CHAT_ACTIONS.SEND_MESSAGE);
    },
    [matchedPositions, addMessage, setLastActionType]
  );

  // Effects
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        draftMessage && onClick(draftMessage);
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [draftMessage, onClick]);

  // Callbacks
  const onChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.currentTarget.value);
    setNotification(null);
  };

  const onChangeLocations = (event: any, locations: string[]) => {
    triggerAction({
      type: CHAT_ACTIONS.SET_LOCATIONS,
      payload: { items: locations },
    });
    setIsFocus(false);
  };

  const renderInput = (
    type:
      | CHAT_ACTIONS.SET_CATEGORY
      | CHAT_ACTIONS.SET_LOCATIONS
      | CHAT_ACTIONS.SET_ALERT_CATEGORY
  ) => {
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

  const botTypingTxt = i18n.t('placeHolders:bot_typing');
  const type =
    lastActionType === CHAT_ACTIONS.SET_JOB_ALERT
      ? CHAT_ACTIONS.SET_ALERT_CATEGORY
      : category
      ? CHAT_ACTIONS.SET_LOCATIONS
      : CHAT_ACTIONS.SET_CATEGORY;

  return (
    <S.MessagesInput position="static">
      <BurgerMenu />

      {renderInput(type)}

      {(draftMessage || file || !!locations.length) && (
        <S.PlaneIcon
          src={ICONS.INPUT_PLANE}
          width="16"
          onClick={() => {
            if (file) {
              sendFile(file);
            } else if (draftMessage) {
              onClick(draftMessage);
            } else if (locations) {
              triggerAction({ type: CHAT_ACTIONS.SEND_LOCATIONS });
            }
          }}
        />
      )}
    </S.MessagesInput>
  );
};
