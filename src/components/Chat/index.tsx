import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { HeadLine } from "./HeadLine";
import * as S from "./styles";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { TextField } from "components/Layout/Input";

import { MessagesBody } from "./MessagesBody";
import { botTypingTxt } from "utils/constants";
import { FirebaseSocketReactivePagination } from "redux/socket";
import { IMessage } from "redux/slices/types";
import { SocketCollectionPreset } from "redux/socket.options";

type PropsType = {
  children?: React.ReactNode | React.ReactNode[];
};

const chatId = "213123";

export const onUpdateMessages = () => {};

export const Chat: FC<PropsType> = ({ children }) => {
  const [draftMessage, setDraftMessage] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.currentTarget.value);
  };

  /* ------ Socket Connection ------ */
  const messagesSocketConnection = useRef(
    new FirebaseSocketReactivePagination<IMessage>(
      SocketCollectionPreset.Messages,
      chatId
    )
  );

  useEffect(() => {
    const savedSocketConnection = messagesSocketConnection.current;
    savedSocketConnection.subscribe(onUpdateMessages);
    return () => savedSocketConnection?.unsubscribe();
  }, [onUpdateMessages]);

  const onLoadNextMessagesPage = useCallback(() => {
    messagesSocketConnection.current?.loadNextPage(onUpdateMessages);
  }, [onUpdateMessages]);
  /* ------------------------------- */

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
