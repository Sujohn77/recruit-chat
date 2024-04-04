/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";

import * as S from "../styles";
import { getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage, MessageType } from "utils/types";
import { useGetMessageText } from "utils/hooks";

interface IButtonMessageProps {
  message: ILocalMessage;
}

export const ButtonMessage: FC<IButtonMessageProps> = ({ message: mess }) => {
  const { chooseButtonOption, messages } = useChatMessenger();
  const messageText = useGetMessageText(mess);

  const onClick = useCallback(() => {
    if (mess?.content.subType === MessageType.BUTTON && mess?.content?.text) {
      chooseButtonOption(mess.content.text as ButtonsOptions);
    }
  }, [messages.length]);

  return (
    <S.MessageButton onClick={onClick} {...getMessageProps(mess)}>
      {messageText}
    </S.MessageButton>
  );
};
