import React, { ChangeEvent, FC, useState } from "react";

import { HeadLine } from "./HeadLine";
import * as S from "./styles";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "components/Layout/Input";

import { MessagesBody } from "./MessagesBody";
import { botTypingTxt } from "utils/constants";

type PropsType = {
  children?: React.ReactNode | React.ReactNode[];
};

export const Chat: FC<PropsType> = ({ children }) => {
  const [draftMessage, setDraftMessage] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.currentTarget.value);
  };

  return (
    <S.Wrapper>
      <HeadLine />

      <MessagesBody
        draftMessage={draftMessage}
        setDraftMessage={setDraftMessage}
      />

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
