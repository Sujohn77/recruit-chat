import { useChatMessanger } from 'contexts/MessangerContext';
import { map } from 'lodash';
import moment from 'moment';
import React, { FC } from 'react';
import { ICONS, IMAGES } from 'utils/constants';
import { getMessageProps } from 'utils/helpers';

import {
  MessageType,
  IContent,
  ILocalMessage,
  CHAT_ACTIONS,
} from 'utils/types';
import { BrowseFile } from '../BrowseFile';
import { EmailForm } from '../EmailForm';
import { JobOffers } from '../JobOffers';

import { NoMatchJob } from '../NoMatchJob';
import { Icon } from '../styles';
import { TranscriptSent } from '../TranscriptSent';

import * as S from './styles';

export const getMessageOptions = (type: CHAT_ACTIONS) => {
  switch (type) {
    case CHAT_ACTIONS.SET_JOB_ALERT:
      return ['Daily', 'Weekly', 'Monthly'];
    default:
      return [];
  }
};

type PropsType = {
  message: ILocalMessage;
  onClick: (content: IContent) => void;
};

export const MS_1000 = 1000;

// TODO: refactor switch
export const Message: FC<PropsType> = ({ message, onClick }) => {
  const { lastActionType } = useChatMessanger();
  const subType = message.content.subType;
  const messageProps = { ...getMessageProps(message) };
  switch (subType) {
    case MessageType.INITIAL_MESSAGE:
      return <S.InitialMessage>{message.content.text}</S.InitialMessage>;
    case MessageType.UPLOAD_CV:
      return <BrowseFile />;
    case MessageType.EMAIL_FORM: {
      return <EmailForm />;
    }
    case MessageType.JOB_POSITIONS: {
      return <JobOffers />;
    }
    case MessageType.TRANSCRIPT: {
      return <TranscriptSent />;
    }
    case MessageType.TEXT:
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
      return (
        <S.MessageBox
          onClick={() => onClick(message.content)}
          {...getMessageProps(message)}
        >
          <S.MessageText>{message.content.text}</S.MessageText>
        </S.MessageBox>
      );
    }
    case MessageType.TEXT_WITH_CHOICE: {
      return (
        <>
          <S.MessageBox {...messageProps} isText>
            <S.MessageText>{message.content.text}</S.MessageText>
          </S.MessageBox>
          {lastActionType &&
            map(getMessageOptions(lastActionType), (opt) => {
              return <S.Option {...messageProps}>{opt}</S.Option>;
            })}
        </>
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
