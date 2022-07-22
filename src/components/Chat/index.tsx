import React, { FC, useEffect } from "react";

import { HeadLine } from "./HeadLine";
import * as S from "./styles";

import { MessagesBody } from "./MessagesBody";

import { FirebaseSocketReactivePagination } from "redux/socket";
import { IMessage } from "saga/types";
import { SocketCollectionPreset } from "redux/socket.options";

import { useUpdateChatRoomMessagesCallback } from "redux/hooks";

import chatsActionTypes from "redux/actions";
import { dispatch } from "redux/store";
import { MessageInput } from "./MessageInput";

type PropsType = {
  children?: React.ReactNode | React.ReactNode[];
};

export const chatId = 213123;

export const Chat: FC<PropsType> = ({ children }) => {
  const onUpdateMessages = useUpdateChatRoomMessagesCallback(dispatch, chatId);

  /* ------ Socket Connection ------ */
  const messagesSocketConnection = React.useRef(
    new FirebaseSocketReactivePagination<IMessage>(
      SocketCollectionPreset.Messages,
      chatId
    )
  );

  useEffect(() => {
    dispatch({ type: chatsActionTypes.INIT_CHAT });

    const savedSocketConnection = messagesSocketConnection.current;
    savedSocketConnection.subscribe(onUpdateMessages);
    return () => savedSocketConnection?.unsubscribe();
  }, [onUpdateMessages]);

  // const onLoadNextMessagesPage = useCallback(() => {
  //   // messagesSocketConnection.current?.loadNextPage(onUpdateMessages);
  // }, [onUpdateMessages]);

  /* ------------------------------- */

  return (
    <S.Wrapper>
      <HeadLine />
      <MessagesBody />
      <MessageInput />
    </S.Wrapper>
  );
};
