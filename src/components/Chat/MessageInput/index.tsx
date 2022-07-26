import React, { FC, useState, useEffect, ChangeEvent } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "components/Layout/Input";
import { IconButton } from "@mui/material";

import {
  botTypingTxt,
  categoryHeaderName,
  ICONS,
  locationHeaderName,
  locations,
  positions,
} from "utils/constants";
import * as S from "./styles";

import { SearchResults } from "./SearchResults";
import { capitalizeFirstLetter, getMatchedItems } from "utils/helpers";
import { useChatMessanger } from "components/Context/MessangerContext";
import { CHAT_TYPE_MESSAGES } from "utils/types";
import { sendMessage } from "services/hooks";
import { useFileUploadContext } from "components/Context/FileUploadContext";

type PropsType = {};

export const MessageInput: FC<PropsType> = () => {
  const { file, sendFile, setNotification } = useFileUploadContext();
  const { addMessage, jobPosition } = useChatMessanger();
  const [draftMessage, setDraftMessage] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.currentTarget.value);
    setNotification(null);
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (draftMessage) {
          addMessage({ text: draftMessage, subType: CHAT_TYPE_MESSAGES.TEXT });
          setDraftMessage(null);
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftMessage]);

  const { searchItems, placeHolder, headerName } = jobPosition
    ? {
        searchItems: locations,
        placeHolder: "Reply to choose location...",
        headerName: locationHeaderName,
      }
    : {
        searchItems: positions,
        headerName: categoryHeaderName,
        placeHolder: null,
      };

  const matchedPositions = getMatchedItems({
    message: draftMessage,
    searchItems,
  });

  const onClick = (draftMessage: string) => {
    sendMessage(draftMessage);
    setDraftMessage(null);
  };

  return (
    <S.MessagesInput position="static">
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>

      {!!matchedPositions?.length && draftMessage && (
        <SearchResults
          headerName={headerName}
          matchedPositions={matchedPositions}
          matchedPart={capitalizeFirstLetter(draftMessage)}
          setDraftMessage={setDraftMessage}
        />
      )}

      <TextField
        value={draftMessage || ""}
        onChange={onChange}
        placeHolder={placeHolder || botTypingTxt}
      />

      {(draftMessage || file) && (
        <S.PlaneIcon
          src={ICONS.INPUT_PLANE}
          width="16"
          onClick={() => {
            if (draftMessage) {
              onClick(draftMessage);
            } else if (file) {
              sendFile(file);
            }
          }}
        />
      )}
    </S.MessagesInput>
  );
};
