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
  const { messages, chooseButtonOption, lastActionType, status, triggerAction } = useChatMessanger();
  const { onLoadNextMessagesPage } = useSocketContext();
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastActionType !== null) {
      scrollToBottom();
    }
  }, [lastActionType, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const onClick = (content: IContent) => {
    if (content.subType === MessageType.BUTTON) {
      content.text && chooseButtonOption(content.text);
    }
  };

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const onLoadMore = () => {
    onLoadNextMessagesPage?.();
  };

  const handleOfferSubmit = useCallback((id: string | number) => {
    triggerAction({
      type: CHAT_ACTIONS.INTERESTED_IN,
      payload: { item: `${id}` },
    });
  }, []);

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
          {map(messages, (message, index) => (
            <Message
              key={`${message._id}-${index}`}
              handleOfferSubmit={handleOfferSubmit}
              message={message}
              onClick={onClick}
            />
          ))}
        </InfiniteScrollView>
      </S.MessageListContainer>
      {status === Status.PENDING && <Loader />}
    </S.MessagesArea>
  );
};
