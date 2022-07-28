import React, { FC } from "react";
import { ICONS, IMAGES } from "utils/constants";
import { getMessageProps } from "utils/helpers";

import { MessageType, IContent, ILocalMessage } from "utils/types";
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
    case MessageType.INITIAL_MESSAGE:
      return <S.InitialMessage>{message.content.text}</S.InitialMessage>;
    case MessageType.UPLOAD_CV:
      return <BrowseFile />;
    case MessageType.TEXT:
    case MessageType.JOB_POSITIONS:
    case MessageType.BUTTON:
    case MessageType.FILE:
    case MessageType.CHAT_CREATED:
      const isFile = subType === MessageType.FILE;
      return (
        <S.MessageBox
          onClick={() => onClick(message.content)}
          {...getMessageProps(message)}
        >
          <S.MessageContent isFile={isFile}>
            {isFile && <Icon src={ICONS.ATTACHED_FILE} />}
            <S.MessageText>{message.content.text}</S.MessageText>
            {!message._id && !message.isOwn && (
              <S.MessageUnsendIcon src={IMAGES.CLOCK} />
            )}
          </S.MessageContent>
        </S.MessageBox>
      );
    // case MessageType.CHAT_CREATED: {
    //   return null;
    // }
    default: {
      console.log("uknown", message);
      return <NoMatchJob />;
    }
  }
};
