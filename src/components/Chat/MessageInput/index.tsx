import React, { FC, useState, useEffect, ChangeEvent } from "react";

import {
  botTypingTxt,
  categoryHeaderName,
  ICONS,
  locationHeaderName,
  locations as searchLocations,
} from "utils/constants";
import * as S from "./styles";

import { capitalizeFirstLetter, getMatchedItems } from "utils/helpers";
import { useChatMessanger } from "contexts/MessangerContext";
import { CHAT_ACTIONS } from "utils/types";
import { useFileUploadContext } from "contexts/FileUploadContext";
import { MultiSelectInput } from "components/Layout/Input/MultiSelectInput";
import { Autocomplete } from "components/Layout/Input/Autocomplete";
import BurgerMenu from "components/Layout/BurgerMenu";

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
  } = useChatMessanger();
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
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

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        draftMessage && onClick(draftMessage);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftMessage]);

  const { searchItems, placeHolder, headerName } = category
    ? {
        searchItems: searchLocations,
        placeHolder: "Reply to choose location...",
        headerName: locationHeaderName,
      }
    : {
        searchItems: categories,
        headerName: categoryHeaderName,
        placeHolder: null,
      };

  const matchedPositions = draftMessage
    ? getMatchedItems({
        message: draftMessage,
        searchItems,
      })
    : searchItems;

  const onClick = (draftMessage: string) => {
    addMessage({ text: draftMessage });
    setDraftMessage(null);
    setIsFocus(false);
    setLastActionType(CHAT_ACTIONS.SEND_MESSAGE);
  };

  const renderInput = (
    type: CHAT_ACTIONS.SET_CATEGORY | CHAT_ACTIONS.SET_LOCATIONS
  ) => {
    const inputProps = {
      type,
      headerName: headerName,
      matchedItems: matchedPositions,
      matchedPart: capitalizeFirstLetter(draftMessage || ""),
      value: draftMessage || "",
      placeHolder: placeHolder || botTypingTxt,
      setIsFocus,
      isFocus,
      setInputValue: (value: string) => setDraftMessage(value),
    };
    if (inputProps.type === CHAT_ACTIONS.SET_LOCATIONS) {
      return (
        <MultiSelectInput
          {...inputProps}
          options={searchItems}
          onChange={onChangeLocations}
          values={locations}
        />
      );
    }
    return <Autocomplete {...inputProps} onChange={onChangeCategory} />;
  };

  const type = category
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
