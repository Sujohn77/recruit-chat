import React, { Dispatch, FC, SetStateAction } from "react";

import { ChatHeader } from "./ChatHeader";
import * as S from "./styles";

import { MessageInput } from "./MessageInput";
import { useFileUploadContext } from "components/Context/FileUploadContext";
import { MessagesList } from "./MessagesList";
import { ICONS } from "utils/constants";
import { Close } from "screens/intro/styles";

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
};

export const chatId = 2433044;

// TODO: refactor notification's part
export const Chat: FC<PropsType> = ({ setIsSelectedOption, children }) => {
  const { file, notification, resetFile } = useFileUploadContext();
  return (
    <S.Wrapper>
      <ChatHeader setIsSelectedOption={setIsSelectedOption} />
      <MessagesList />

      {(file || notification) && (
        <S.Notification>
          {file?.name && <S.Icon src={ICONS.ATTACHED_FILE} />}
          <S.NotificationText>{file?.name || notification}</S.NotificationText>
          {file?.name && <Close onClick={() => resetFile()} />}
        </S.Notification>
      )}
      <MessageInput />
    </S.Wrapper>
  );
};
