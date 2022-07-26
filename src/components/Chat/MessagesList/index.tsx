import React, { FC } from "react";

import { Loader } from "components/Layout/Loader";

import { mockData } from "../mockData";
import * as S from "./styles";
import { useChatMessanger } from "components/Context/MessangerContext";
import { CHAT_TYPE_MESSAGES, IContent } from "utils/types";
import { useSocketContext } from "components/Context/SocketContext";
import { InfiniteScrollView } from "components/InfiniteScrollView";
import { infiniteScrollStyle } from "./styles";
import { Message } from "./Message";
import { map } from "lodash";

type PropsType = {};

const MESSAGE_SCROLL_LIST_DIV_ID = "message-scroll-list";

export const MessagesList: FC<PropsType> = () => {
  const { messages, chooseButtonOption } = useChatMessanger();
  const { onLoadNextMessagesPage } = useSocketContext();

  const onClick = (content: IContent) => {
    if (content.subType === CHAT_TYPE_MESSAGES.BUTTON) {
      content.text && chooseButtonOption(content.text);
    }
  };

  const onLoadMore = () => {
    console.log("onLoadMore");
    onLoadNextMessagesPage?.();
  };

  const isLastOwnMessage = !messages[messages.length - 1]?.isReceived;

  return (
    <S.MessagesArea>
      <S.InitialMessage>{mockData.initialMessage}</S.InitialMessage>
      <S.MessageListContainer id={MESSAGE_SCROLL_LIST_DIV_ID}>
        <InfiniteScrollView
          scrollableParentId={MESSAGE_SCROLL_LIST_DIV_ID}
          onLoadMore={onLoadMore}
          style={infiniteScrollStyle}
          inverse
        >
          {map(messages, (message) => (
            <Message
              key={`message-${message._id}`}
              message={message}
              onClick={onClick}
            />
          ))}
        </InfiniteScrollView>
      </S.MessageListContainer>

      {isLastOwnMessage && <Loader isShow={isLastOwnMessage} />}
    </S.MessagesArea>
  );
};
