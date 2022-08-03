import moment from 'moment';
import React, { FC } from 'react';
import { ICONS, IMAGES } from 'utils/constants';
import { getMessageProps } from 'utils/helpers';

import { MessageType, IContent, ILocalMessage } from 'utils/types';
import { BrowseFile } from '../BrowseFile';
import { EmailForm } from '../EmailForm';
import { JobOffers } from '../JobOffers';

import { NoMatchJob } from '../NoMatchJob';
import { Icon } from '../styles';
import { TranscriptSent } from '../TranscriptSent';

import * as S from './styles';

type PropsType = {
  message: ILocalMessage;
  onClick: (content: IContent) => void;
};

export const MS_1000 = 1000;

export const Message: FC<PropsType> = ({ message, onClick }) => {
  const subType = message.content.subType;
  switch (subType) {
    case MessageType.INITIAL_MESSAGE:
      return <S.InitialMessage>{message.content.text}</S.InitialMessage>;
    case MessageType.UPLOAD_CV:
      return <BrowseFile />;
    case MessageType.EMAIL_FORM: {
      return <JobOffers />;
    }
    case MessageType.TRANSCRIPT: {
      return <TranscriptSent />;
    }
    case MessageType.TEXT:
    case MessageType.JOB_POSITIONS:
    case MessageType.FILE:
    case MessageType.CHAT_CREATED:
      const isFile = subType === MessageType.FILE;
      return (
        <S.MessageBox {...getMessageProps(message)} isText>
          <S.MessageContent isFile={isFile}>
            {isFile && <Icon src={ICONS.ATTACHED_FILE} />}

            <S.MessageText>
              {message.content.text || message.content.subType}
            </S.MessageText>

            {message._id ? (
              <S.TimeText>
                {message.dateCreated?.seconds &&
                  moment(message.dateCreated?.seconds * MS_1000).format(
                    'HH:mm A'
                  )}
              </S.TimeText>
            ) : (
              message.isOwn && <S.MessageUnsendIcon src={IMAGES.CLOCK} />
            )}
          </S.MessageContent>
        </S.MessageBox>
      );
    case MessageType.BUTTON: {
      console.log({ ...getMessageProps(message) });
      return (
        <S.MessageBox
          onClick={() => onClick(message.content)}
          {...getMessageProps(message)}
        >
          <S.MessageText>{message.content.text}</S.MessageText>
        </S.MessageBox>
      );
    }
    case MessageType.REFINE_SERCH: {
      return <NoMatchJob />;
    }
    default: {
      return <NoMatchJob />;
    }
  }
};
