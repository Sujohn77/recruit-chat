/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "contexts/MessengerContext";
import { FC, memo, useCallback } from "react";

import * as S from "../styles";
import { getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage, MessageType } from "utils/types";

interface IButtonMessageProps {
  message: ILocalMessage;
}

export const ButtonMessage: FC<IButtonMessageProps> = memo(({ message }) => {
  const { chooseButtonOption, messages } = useChatMessenger();

  const onClick = useCallback(() => {
    if (
      message?.content.subType === MessageType.BUTTON &&
      message?.content?.text
    ) {
      chooseButtonOption(message.content.text as ButtonsOptions);
    }
  }, [messages.length]);

  return (
    <S.MessageButton onClick={onClick} {...getMessageProps(message)}>
      {message?.content?.text && (
        <S.MessageText>{message?.content?.text}</S.MessageText>
      )}
    </S.MessageButton>
  );
});
