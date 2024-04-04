import { FC } from "react";

import * as S from "./styles";
import { ICONS } from "assets";
import { ILocalMessage } from "utils/types";
import { useGetMessageText } from "utils/hooks";

interface IUploadedCvProps {
  message: ILocalMessage;
  isLastMessage?: boolean;
}

export const UploadedFile: FC<IUploadedCvProps> = ({ message }) => {
  const messageText = useGetMessageText(message);

  return (
    <S.Notification>
      {message?.content.text && <S.Icon src={ICONS.ATTACHED_FILE} />}

      <S.NotificationText>{messageText}</S.NotificationText>
    </S.Notification>
  );
};
