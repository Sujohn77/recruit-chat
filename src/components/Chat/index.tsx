import React, { ChangeEvent, FC, useEffect, useState } from "react";

import { HeadLine } from "./HeadLine";
import { mockData } from "./mockData";
import * as S from "./styles";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { getMessageColorProps } from "utils/helpers";
import { TextField } from "components/Layout/Input";
import { ScenarioType } from "App";
import { Loader } from "components/Layout/Loader";

type PropsType = {
  children?: React.ReactNode | React.ReactNode[];
  scenario: ScenarioType;
};

const botTypingTxt = "Bot is typing...";

export const Chat: FC<PropsType> = ({ children, scenario }) => {
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>(
    scenario.initialOwnMessages
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.currentTarget.value);
  };

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        draftMessage && setMessages([...messages, draftMessage]);
        setDraftMessage(null);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [draftMessage, messages]);

  const ownMessages = messages.map((value, index) => (
    <S.Message
      key={`own-message-${value}-index`}
      {...getMessageColorProps(true)}
    >
      {value}
    </S.Message>
  ));
  const initMessages = scenario.initialMessages.map((value) => (
    <S.Message key={`init-message-${value}-index`} {...getMessageColorProps()}>
      {value}
    </S.Message>
  ));

  // TODO: check if we have last own message
  const isLastOwnMessage = draftMessage !== "" && !!draftMessage;

  return (
    <S.Wrapper>
      <HeadLine />

      <S.MessagesArea>
        <S.InitialMessage>{mockData.initialMessage}</S.InitialMessage>
        {initMessages}
        {ownMessages}

        {isLastOwnMessage && <Loader isShow={isLastOwnMessage} />}
      </S.MessagesArea>

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
        <TextField
          value={draftMessage || ""}
          onChange={onChange}
          placeHolder={botTypingTxt}
        />
      </S.MessagesInput>
    </S.Wrapper>
  );
};
