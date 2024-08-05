import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";

import * as S from "../styles";
import { getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage, MessageType } from "utils/types";
import { useGetMessageText } from "utils/hooks";
import { useConnectToLiveChat } from "contexts/hooks";

interface IButtonMessageProps {
  message: ILocalMessage;
}

export const ButtonMessage: FC<IButtonMessageProps> = ({ message: mess }) => {
  const { chooseButtonOption, chatId, chatQueueId, sendNewMessage, messages } =
    useChatMessenger();
  const messageText = useGetMessageText(mess);
  const connectToLiveChat = useConnectToLiveChat(chatId, chatQueueId);

  const messageIndex = messages.findIndex((m) => m.localId === mess.localId);
  const isLastMess = messageIndex === 0;
  const nextMessFromSameSender =
    !isLastMess && !!messages[messageIndex + 1]?.isOwn === !!mess.isOwn;

  const onClick = useCallback(() => {
    if (mess?.content.subType === MessageType.BUTTON && mess?.content?.text) {
      sendNewMessage({
        message: mess.content.text,
        isOwn: true,
        localId: mess.localId,
      });

      if (mess.content.text === "can i speak to someone?") {
        connectToLiveChat();
      } else {
        chooseButtonOption(mess.content.text as ButtonsOptions);
      }
    }
  }, [sendNewMessage]);

  return (
    <S.MessageButton
      onClick={onClick}
      nextMessFromSameSender={nextMessFromSameSender}
      {...getMessageProps(mess)}
    >
      {messageText}
    </S.MessageButton>
  );
};
