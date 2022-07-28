import React, { FC } from "react";

import { Loader } from "components/Layout/Loader";

import * as S from "./styles";
import {
  initialChatMessage,
  useChatMessanger,
} from "components/Context/MessangerContext";
import { MessageType, IContent } from "utils/types";
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
    if (content.subType === MessageType.BUTTON) {
      content.text && chooseButtonOption(content.text);
    }
  };

  const onLoadMore = () => {
    onLoadNextMessagesPage?.();
  };

  const isLastOwnMessage = !messages[messages.length - 1]?.isOwn;
  const chatMessages = [initialChatMessage, ...messages];
  return (
    <S.MessagesArea>
      <S.MessageListContainer id={MESSAGE_SCROLL_LIST_DIV_ID}>
        <InfiniteScrollView
          scrollableParentId={MESSAGE_SCROLL_LIST_DIV_ID}
          onLoadMore={onLoadMore}
          style={infiniteScrollStyle}
          inverse
        >
          {map(chatMessages, (message, index) => (
            <Message
              key={`message-${message._id}-${index}`}
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
