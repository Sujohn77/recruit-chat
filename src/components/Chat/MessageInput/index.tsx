import React, { FC, useState, useEffect, ChangeEvent } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "components/Layout/Input";
import { IconButton } from "@mui/material";

import {
  botTypingTxt,
  categoryHeaderName,
  ChannelName,
  ICONS,
  locationHeaderName,
  locations as searchLocations,
  positions,
} from "utils/constants";
import * as S from "./styles";

import { SearchResults } from "./SearchResults";
import {
  capitalizeFirstLetter,
  generateLocalId,
  getMatchedItems,
} from "utils/helpers";
import { useChatMessanger } from "contexts/MessangerContext";
import { CHAT_ACTIONS, MessageType } from "utils/types";
import { sendMessage } from "services/hooks";
import { useFileUploadContext } from "contexts/FileUploadContext";
import { MultiSelectInput } from "components/Layout/Input/MultiSelectInput";
import { Autocomplete } from "components/Layout/Input/Autocomplete";

type PropsType = {};

export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const { addMessage, category, triggerAction, locations, setLastActionType } =
    useChatMessanger();
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
        searchItems: positions,
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
    const localId = generateLocalId();
    // TODO: fix when backend is ready
    const message = {
      channelName: ChannelName.SMS,
      candidateId: 49530690,
      contextId: null,
      msg: draftMessage,
      images: [],
      localId,
    };
    sendMessage(message);
    addMessage({ text: draftMessage, localId });
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
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 1 }}
      >
        <svg viewBox="0 0 100 80" width="30" height="30">
          <rect x="25" y="20" width="53.3" height="5.66" rx="5.5"></rect>
          <rect x="25" y="40" width="53.3" height="5.66" rx="5.5"></rect>
          <rect x="25" y="60" width="53.3" height="5.66" rx="5.5"></rect>
        </svg>
      </IconButton>

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
