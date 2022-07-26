import React, { FC } from "react";
import { ICONS } from "utils/constants";
import { getMessageProps } from "utils/helpers";

import { CHAT_TYPE_MESSAGES, IContent, ILocalMessage } from "utils/types";
import { BrowseFile } from "../BrowseFile";

import { NoMatchJob } from "../NoMatchJob";
import { Icon } from "../styles";

import * as S from "./styles";

type PropsType = {
  message: ILocalMessage;
  onClick: (content: IContent) => void;
};

export const Message: FC<PropsType> = ({ message, onClick }) => {
  const subType = message.content.subType;
  switch (subType) {
    case CHAT_TYPE_MESSAGES.UPLOAD_CV:
      return <BrowseFile />;
    case CHAT_TYPE_MESSAGES.TEXT:
    case CHAT_TYPE_MESSAGES.JOB_POSITIONS:
    case CHAT_TYPE_MESSAGES.BUTTON:
    case CHAT_TYPE_MESSAGES.FILE:
      const isFile = subType === CHAT_TYPE_MESSAGES.FILE;
      return (
        <S.MessageBox
          onClick={() => onClick(message.content)}
          {...getMessageProps(message)}
        >
          <S.MessageContent isFile={isFile}>
            {isFile && <Icon src={ICONS.ATTACHED_FILE} />}
            <S.MessageText>{message.content.text}</S.MessageText>
          </S.MessageContent>
        </S.MessageBox>
      );

    default: {
      return <NoMatchJob />;
    }
  }
};
