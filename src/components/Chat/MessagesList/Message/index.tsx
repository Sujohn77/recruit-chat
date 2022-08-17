import moment from 'moment';
import React, { FC, useContext } from 'react';
import { ICONS, IMAGES } from 'utils/constants';
import { getMessageProps } from 'utils/helpers';

import { MessageType, IContent, ILocalMessage } from 'utils/types';
import { BrowseFile } from './BrowseFile';
import { EmailForm } from './EmailForm';
import { JobOffers } from './JobOffers';

import { NoMatchJob } from './NoMatchJob';
import { Icon } from '../styles';
import { TextWithOptions } from './TextWithOptions';
import { TranscriptSent } from './TranscriptSent';

import * as S from './styles';
import { TextMessage } from './TextMessage';
import { InterestedIn } from './InterestedIn';
import { HiringHelp } from './HiringHelp';
import { SalaryForm } from './SalaryForm';
import { QuestionForm } from './QuestionForm';
import { ThanksMessage } from './ThanksMessage';
import { useThemeContext } from 'contexts/ThemeContext';

type PropsType = {
  message: ILocalMessage;
  onClick: (content: IContent) => void;
};

export const MS_1000 = 1000;
export const Message: FC<PropsType> = ({ message, onClick }) => {
  const { theme } = useThemeContext();
  const subType = message.content.subType;
  const messageProps = { ...getMessageProps(message), theme };

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
      return <TextMessage message={message} />;
    case MessageType.BUTTON: {
      return (
        <S.MessageButton
          onClick={() => onClick(message.content)}
          {...messageProps}
        >
          <S.MessageText>{message.content.text}</S.MessageText>
        </S.MessageButton>
      );
    }
    case MessageType.INTERESTED_IN:
      return <InterestedIn message={message} />;
    case MessageType.TEXT_WITH_CHOICE: {
      return <TextWithOptions text={message.content.text!} {...messageProps} />;
    }
    case MessageType.HIRING_PROCESS: {
      return <HiringHelp message={message} />;
    }
    case MessageType.QUESTION_FORM: {
      return <QuestionForm />;
    }
    case MessageType.SALARY_FORM: {
      return <SalaryForm message={message} />;
    }
    case MessageType.NO_MATCH:
    case MessageType.REFINE_SERCH: {
      return <NoMatchJob isRefineOnly={subType === MessageType.REFINE_SERCH} />;
    }
    case MessageType.THANKS: {
      return <ThanksMessage />;
    }
    default: {
      return null;
    }
  }
};
