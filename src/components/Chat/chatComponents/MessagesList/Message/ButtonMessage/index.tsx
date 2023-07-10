/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "contexts/MessengerContext";
import { FC, memo, useCallback } from "react";

import * as S from "../styles";
import { getMessageProps } from "utils/helpers";
import { ILocalMessage, MessageType } from "utils/types";
import { questions } from "components/ChatContent/data";
import { useChatStore } from "store/chat.store";
import { ChatScreens, useAppStore } from "store/app.store";

interface IButtonMessageProps {
  message: ILocalMessage;
}

export const ButtonMessage: FC<IButtonMessageProps> = memo(({ message }) => {
  const { chooseButtonOption, messages } = useChatMessenger();
  const { askAQuestion } = useChatStore();
  const { chatScreen: chatStatus } = useAppStore();

  const onClick = useCallback(() => {
    if (message.content.subType === MessageType.BUTTON) {
      message.content.text && chooseButtonOption(message.content.text);

      if (
        chatStatus === ChatScreens.QnA &&
        message.content.text &&
        questions.some((q) => q.text === message.content.text)
      ) {
        askAQuestion(message.content.text);
      }
    }
  }, [messages.length, chatStatus]);

  return (
    <S.MessageButton onClick={onClick} {...getMessageProps(message)}>
      <S.MessageText>{message.content.text}</S.MessageText>
    </S.MessageButton>
  );
});
