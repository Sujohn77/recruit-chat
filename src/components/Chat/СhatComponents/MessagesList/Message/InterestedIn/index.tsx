import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";

import { getMessageProps } from "utils/helpers";
import { ILocalMessage } from "utils/types";
import * as S from "./styles";
import { MessageBox } from "../styles";

interface IInterestedInProps {
  message: ILocalMessage;
}

export const InterestedIn: FC<IInterestedInProps> = ({ message }) => {
  const { prefferedJob } = useChatMessenger();
  const messageProps = { ...getMessageProps(message) };

  if (!prefferedJob) {
    return null;
  }

  return (
    <MessageBox {...messageProps}>
      <S.InterestedInText>I’m interested</S.InterestedInText>
      <S.InterestedInTitle>{prefferedJob.title}</S.InterestedInTitle>
      <S.MessageJobItem>{prefferedJob.location.city}</S.MessageJobItem>
      <S.MessageJobItem>{prefferedJob.datePosted}</S.MessageJobItem>
      <S.MessageJobItem>{prefferedJob.hiringType}</S.MessageJobItem>
    </MessageBox>
  );
};
