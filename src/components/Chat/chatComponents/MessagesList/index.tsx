import { useChatMessenger } from "contexts/MessengerContext";
import { useFileUploadContext } from "contexts/FileUploadContext";
import { FC, useEffect, useRef } from "react";
import map from "lodash/map";

import * as S from "./styles";
import { Message } from "./Message";
import { infiniteScrollStyle } from "./styles";
import { InfiniteScrollView } from "components";
import { isMobile } from "utils/constants";
import { Loader } from "components/Layout/Loader";

const MESSAGE_SCROLL_LIST_DIV_ID = "message-scroll-list";

interface IMessagesListProps {
  resultsHeight: number;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const MessagesList: FC<IMessagesListProps> = ({
  resultsHeight,
  setSelectedReferralJobId,
}) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  const { isFileDownloading, isJobSearchingLoading } = useFileUploadContext();
  const {
    messages,
    currentMsgType,
    nextMessages,
    isChatLoading,
    footerPrivacyLink,
  } = useChatMessenger();

  useEffect(() => {
    if (currentMsgType !== null && !nextMessages.length) {
      scrollToBottom();
    }
  }, [messages.length, currentMsgType, nextMessages]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const showLoader =
    isFileDownloading || isJobSearchingLoading || isChatLoading;

  return (
    <S.MessagesArea withPPLink={!!footerPrivacyLink?.enabled}>
      <S.MessageListContainer
        ref={messagesRef}
        id={MESSAGE_SCROLL_LIST_DIV_ID}
        isLoading={showLoader}
      >
        <InfiniteScrollView
          scrollableParentId={MESSAGE_SCROLL_LIST_DIV_ID}
          onLoadMore={() => {}}
          style={infiniteScrollStyle}
          inverse
        >
          {map(messages, (message) => (
            <Message
              key={`${message?.localId}-${message?._id}-${message.dateCreated}-${message.sender?.firstName}`}
              message={message}
              setSelectedReferralJobId={setSelectedReferralJobId}
            />
          ))}
        </InfiniteScrollView>
      </S.MessageListContainer>

      <Loader showLoader={showLoader} />
    </S.MessagesArea>
  );
};
