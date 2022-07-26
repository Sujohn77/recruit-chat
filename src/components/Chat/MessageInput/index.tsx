import React, { FC, useState, useEffect, ChangeEvent } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "components/Layout/Input";
import { IconButton } from "@mui/material";

import { botTypingTxt, ICONS } from "utils/constants";
import * as S from "./styles";

import { SearchResults } from "./SearchResults";
import { capitalizeFirstLetter } from "utils/helpers";
import { useChatMessanger } from "components/Context/MessangerContext";
import { CHAT_TYPE_MESSAGES } from "utils/types";
import { sendMessage } from "services/hooks";

type PropsType = {};

// TODO: fix mock
const positions = ["Devops", "Developer ios", "Developer backend"];

export const MessageInput: FC<PropsType> = () => {
  const { addMessage } = useChatMessanger();
  const [draftMessage, setDraftMessage] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.currentTarget.value);
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

  const matchedPositions = draftMessage?.length
    ? positions
        .filter((p) => {
          const position = p.toLowerCase();
          const firstWord = p.toLowerCase().split(" ")[0];
          return (
            position.indexOf(draftMessage) !== -1 &&
            firstWord.indexOf(draftMessage) !== -1
          );
        })
        .map((p) => p.slice(draftMessage.length, p.length))
    : [];

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
          matchedPositions={matchedPositions}
          matchedPart={capitalizeFirstLetter(draftMessage)}
          setDraftMessage={setDraftMessage}
        />
      )}

      <TextField
        value={draftMessage || ""}
        onChange={onChange}
        placeHolder={botTypingTxt}
      />

      {draftMessage && (
        <S.PlaneIcon
          src={ICONS.INPUT_PLANE}
          width="16"
          onClick={() => onClick(draftMessage)}
        />
      )}
    </S.MessagesInput>
  );
};
