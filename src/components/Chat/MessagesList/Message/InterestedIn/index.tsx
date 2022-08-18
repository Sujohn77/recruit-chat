import { useChatMessanger } from 'contexts/MessangerContext';
import React, { FC } from 'react';

import { getMessageProps } from 'utils/helpers';
import { ILocalMessage } from 'utils/types';

import { MessageBox } from '../styles';
import * as S from './styles';

interface IProps {
  message: ILocalMessage;
}
export const InterestedIn: FC<IProps> = ({
  message,
}: {
  message: ILocalMessage;
}) => {
  const { prefferedJob } = useChatMessanger();
  const messageProps = { ...getMessageProps(message) };

  if (!prefferedJob) {
    return null;
  }

  return (
    <MessageBox {...messageProps}>
      <S.InterestedInText>I’m interested</S.InterestedInText>
      <S.InterestedInTitle>{prefferedJob.title}</S.InterestedInTitle>
      <S.MessageJobItem>{prefferedJob.location}</S.MessageJobItem>
      <S.MessageJobItem>{prefferedJob.postedDate}</S.MessageJobItem>
      <S.MessageJobItem>{prefferedJob.fullTime}</S.MessageJobItem>
    </MessageBox>
  );
};
