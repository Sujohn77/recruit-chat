import React, { FC, useMemo } from "react";

import { Loader } from "components/Layout/Loader";
import { BrowseFile } from "./BrowseFile";
import { NoMatchJob } from "./NoMatchJob";

import { getMessageColorProps } from "utils/helpers";
import { mockData } from "../mockData";
import * as S from "./styles";
import { useChatMessanger } from "components/Context/MessangerContext";
import { CHAT_TYPE_MESSAGES } from "utils/types";
import { useSocketContext } from "components/Context/SocketContext";
import { InfiniteScrollView } from "components/InfiniteScrollView";
import { infiniteScrollStyle } from "./styles";

type PropsType = {};
const MESSAGE_SCROLL_LIST_DIV_ID = "message-scroll-list";
export const MessagesBody: FC<PropsType> = () => {
  const { messages, chooseButtonOption } = useChatMessanger();
  const { onLoadNextMessagesPage } = useSocketContext();

  const chatMessages = useMemo(() => {
    return messages.map((msg, index) => {
      switch (msg.content.subType) {
        case CHAT_TYPE_MESSAGES.UPLOAD_CV:
          return <BrowseFile key={`browse-file-${index}`} />;
        case CHAT_TYPE_MESSAGES.TEXT:
        case CHAT_TYPE_MESSAGES.JOB_POSITIONS:
          return (
            <S.Message
              key={`own-message-${msg.content.subType}-${msg.createdAt}-${index}`}
              {...getMessageColorProps(!msg.isReceived)}
            >
              {msg.content.text}
            </S.Message>
          );
        case CHAT_TYPE_MESSAGES.BUTTON:
          return (
            <S.MessageButton
              key={`button-message-${msg.createdAt}-${index}`}
              onClick={() =>
                msg.content.text && chooseButtonOption(msg.content.text)
              }
              {...getMessageColorProps(!msg.isReceived)}
            >
              {msg.content.text}
            </S.MessageButton>
          );
        default: {
          return <NoMatchJob key={`mo-match-job-${index}`} />;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const isLastOwnMessage = !messages[messages.length - 1]?.isReceived;

  return (
    <S.MessagesArea>
      <S.InitialMessage>{mockData.initialMessage}</S.InitialMessage>
      <InfiniteScrollView
        scrollableParentId={MESSAGE_SCROLL_LIST_DIV_ID}
        onLoadMore={() => onLoadNextMessagesPage?.()}
        style={infiniteScrollStyle}
      >
        {chatMessages}
      </InfiniteScrollView>

      {isLastOwnMessage && <Loader isShow={isLastOwnMessage} />}
    </S.MessagesArea>
  );
};
