/* eslint-disable react-hooks/exhaustive-deps */
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
  const { chooseButtonOption, messages, chatId, chatQueueId, sendNewMessage } =
    useChatMessenger();
  const messageText = useGetMessageText(mess);
  const connectToLiveChat = useConnectToLiveChat(chatId, chatQueueId);

  const onClick = useCallback(async () => {
    if (mess?.content.subType === MessageType.BUTTON && mess?.content?.text) {
      if (mess.content.text === "can i speak to someone?") {
        connectToLiveChat();
      } else {
        chooseButtonOption(mess.content.text as ButtonsOptions);
      }
      await sendNewMessage({
        message: mess.content.text,
      });
    }
  }, [messages.length]);

  return (
    <S.MessageButton onClick={onClick} {...getMessageProps(mess)}>
      {messageText}
    </S.MessageButton>
  );
};
