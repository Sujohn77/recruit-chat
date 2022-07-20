import { Loader } from "components/Layout/Loader";
import { db } from "firebase/config";

import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, pushMessage } from "redux/slices";
import { CHAT_TYPE_MESSAGES, IState } from "redux/slices/types";
import { getChatResponseOnMessage, getMessageColorProps } from "utils/helpers";
import { mockData } from "../mockData";
import { BrowseFile } from "./BrowseFile";
import { NoMatchJob } from "./NoMatchJob";
import * as S from "./styles";
import firebaseApp from "firebase";
type PropsType = {
  draftMessage: string | null;
  setDraftMessage: Dispatch<SetStateAction<string | null>>;
};

export const MessagesBody: FC<PropsType> = ({
  draftMessage,
  setDraftMessage,
}) => {
  const dispatch = useDispatch();
  const { messages } = useSelector<IState, IState>((state) => state);

  // TODO: fix simulating timeout
  useEffect(() => {
    const lastMessage =
      messages.length && messages[messages.length - 1]?.content.text;
    if (lastMessage) {
      setTimeout(() => {
        const message = getChatResponseOnMessage(lastMessage);
        dispatch(pushMessage(message));
      }, 500);
    }

    const getChats = async () => {
      const messages = await firebaseApp.firestore().collection("chats");
      console.log(messages);
      // .doc(selectedQueueChat?.queueId)
      // .collection("chats")
      // .doc(selectedQueueChat?.chatId)
      // .get();
    };

    getChats();
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (draftMessage) {
          dispatch(addMessage(draftMessage));
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

  const chatMessages = useMemo(() => {
    return messages.map((msg, index) => {
      switch (msg.content.subType) {
        case CHAT_TYPE_MESSAGES.BROWSE:
          return <BrowseFile key={`browse-file-${index}`} />;
        case CHAT_TYPE_MESSAGES.TEXT:
          return (
            <S.Message
              key={`own-message-${msg.createdAt}-${index}`}
              {...getMessageColorProps(!msg.isReceived)}
            >
              {msg.content.text}
            </S.Message>
          );
        default: {
          return <NoMatchJob key={`mo-match-job-${index}`} />;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  // TODO: check if we have last own message
  const isLastOwnMessage = !messages[messages.length - 1].isReceived;

  return (
    <S.MessagesArea>
      <S.InitialMessage>{mockData.initialMessage}</S.InitialMessage>
      {chatMessages}

      {isLastOwnMessage && <Loader isShow={isLastOwnMessage} />}
    </S.MessagesArea>
  );
};
