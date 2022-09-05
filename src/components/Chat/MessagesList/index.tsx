import React, { FC, useCallback, useEffect, useRef } from 'react';

import { Loader } from 'components/Layout/Loader';

import * as S from './styles';
import { useChatMessanger } from 'contexts/MessangerContext';
import { MessageType, IContent, CHAT_ACTIONS } from 'utils/types';
import { useSocketContext } from 'contexts/SocketContext';
import { InfiniteScrollView } from 'components/InfiniteScrollView';
import { infiniteScrollStyle } from './styles';
import { Message } from './Message';
import { map } from 'lodash';
import { Status } from 'utils/constants';

type PropsType = {};

const MESSAGE_SCROLL_LIST_DIV_ID = 'message-scroll-list';

export const MessagesList: FC<PropsType> = () => {
  const { messages, lastActionType, status, nextMessages } = useChatMessanger();
  const { onLoadNextMessagesPage } = useSocketContext();
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastActionType !== null && !nextMessages.length) {
      scrollToBottom();
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const onLoadMore = () => {
    onLoadNextMessagesPage?.();
  };

  return (
    <S.MessagesArea>
      <S.MessageListContainer id={MESSAGE_SCROLL_LIST_DIV_ID} ref={messagesRef}>
        <InfiniteScrollView
          scrollableParentId={MESSAGE_SCROLL_LIST_DIV_ID}
          onLoadMore={onLoadMore}
          style={infiniteScrollStyle}
          loader={<Loader />}
          inverse
        >
          {messages.map((message, index) => (
            <Message key={`${message.localId}-${index}`} message={message} />
          ))}
        </InfiniteScrollView>
      </S.MessageListContainer>
      {status === Status.PENDING && <Loader />}
    </S.MessagesArea>
  );
};
