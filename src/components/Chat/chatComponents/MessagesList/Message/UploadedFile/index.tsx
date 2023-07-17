import { FC } from "react";

import * as S from "./styles";
import { ICONS } from "assets";
import { ILocalMessage } from "utils/types";

interface IUploadedCvProps {
  message: ILocalMessage;
  isLastMessage?: boolean;
}

export const UploadedFile: FC<IUploadedCvProps> = ({ message }) => (
  <S.Notification>
    {message?.content.text && <S.Icon src={ICONS.ATTACHED_FILE} />}

    <S.NotificationText>{message?.content.text}</S.NotificationText>
  </S.Notification>
);
