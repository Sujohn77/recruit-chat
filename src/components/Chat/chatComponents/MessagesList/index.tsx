import { useChatMessenger } from "contexts/MessengerContext";
import { useSocketContext } from "contexts/SocketContext";
import { useFileUploadContext } from "contexts/FileUploadContext";
import { FC, useEffect, useRef } from "react";
import map from "lodash/map";

import { Loader } from "components/Layout/Loader";
import { InfiniteScrollView } from "components";
import { infiniteScrollStyle } from "./styles";
import { Message } from "./Message";
import * as S from "./styles";
import { MessageType } from "utils/types";

const MESSAGE_SCROLL_LIST_DIV_ID = "message-scroll-list";

interface IMessagesListProps {
  resultsHeight: number;
  setShowLoginScreen: (show: boolean) => void;
}

export const MessagesList: FC<IMessagesListProps> = ({
  resultsHeight,
  setShowLoginScreen,
}) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  const { isFileDownloading, isJobSearchingLoading } = useFileUploadContext();
  const { onLoadNextMessagesPage } = useSocketContext();
  const { messages, currentMsgType, status, nextMessages, isChatLoading } =
    useChatMessenger();

  useEffect(() => {
    if (currentMsgType !== null && !nextMessages.length) {
      scrollToBottom();
    }
  }, [messages.length, currentMsgType, nextMessages]); // TODO: test scroll

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const onLoadMore = () => onLoadNextMessagesPage?.();

  const showLoader =
    isFileDownloading || isJobSearchingLoading || isChatLoading;

  return (
    <S.MessagesArea>
      <S.MessageListContainer
        resultsHeight={resultsHeight}
        id={MESSAGE_SCROLL_LIST_DIV_ID}
        ref={messagesRef}
      >
        <InfiniteScrollView
          scrollableParentId={MESSAGE_SCROLL_LIST_DIV_ID}
          onLoadMore={onLoadMore}
          style={infiniteScrollStyle}
          inverse
        >
          {map(messages, (message, index) => {
            let withoutMargin = undefined;
            const isNextMessCVFile =
              messages[index - 1] &&
              messages[index - 1].content?.subType === MessageType.UPLOADED_CV;
            if (
              message.content.subType === MessageType.UPLOAD_CV &&
              isNextMessCVFile
            ) {
              withoutMargin = true;
            }
            return (
              <Message
                setShowLoginScreen={setShowLoginScreen}
                key={`${message.localId}-${message.dateCreated}`}
                message={message}
                isLastMessage={index === 0}
                withoutMargin={withoutMargin}
              />
            );
          })}
        </InfiniteScrollView>
      </S.MessageListContainer>

      <Loader showLoader={showLoader} />
    </S.MessagesArea>
  );
};
