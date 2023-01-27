/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from 'contexts/MessangerContext';
import React, { FC, memo, useCallback } from 'react';

import { getMessageProps } from 'utils/helpers';
import { IContent, ILocalMessage, MessageType } from 'utils/types';

import * as S from '../styles';

interface IProps {
  message: ILocalMessage;
}
export const ButtonMessage: FC<IProps> = memo(({ message }) => {
  const { chooseButtonOption, messages } = useChatMessenger();
  const messageProps = { ...getMessageProps(message) };

  const onClick = useCallback(
    (content: IContent) => {
      if (content.subType === MessageType.BUTTON) {
        content.text && chooseButtonOption(content.text);
      }
    },
    [messages.length]
  );

  return (
    <S.MessageButton onClick={() => onClick(message.content)} {...messageProps}>
      <S.MessageText>{message.content.text}</S.MessageText>
    </S.MessageButton>
  );
});
