import React, { FC, memo } from 'react';
import { getMessageProps, getNextActionType, getParsedMessage } from 'utils/helpers';

import { MessageType, IContent, ILocalMessage } from 'utils/types';
import { BrowseFile } from './BrowseFile';
import { EmailForm } from './EmailForm';
import { JobOffers } from './JobOffers';

import { NoMatchJob } from './NoMatchJob';
import { TextWithOptions } from './TextWithOptions';
import { TranscriptSent } from './TranscriptSent';

import * as S from './styles';
import { TextMessage } from './TextMessage';
import { InterestedIn } from './InterestedIn';
import { HiringHelp } from './HiringHelp';
import { SalaryForm } from './SalaryForm';
import { QuestionForm } from './QuestionForm';
import { ThanksMessage } from './ThanksMessage';
import { ButtonMessage } from './ButtonMessage';
import { SubmitFileMessage } from './SubmitFileMessage';
import { useChatMessenger } from '../../../../contexts/MessangerContext';
import i18n from '../../../../services/localization';

// import { useThemeContext } from 'contexts/ThemeContext';

type PropsType = {
    message: ILocalMessage;
    isLastMessage: boolean;
    // onClick: (content: IContent) => void;
    // handleOfferSubmit: ((id: string | number) => void) | undefined;
};

export const MS_1000 = 1000;
export const Message: FC<PropsType> = memo(({ message, isLastMessage }) => {
    const { triggerAction, currentMsgType, resumeName } = useChatMessenger();
    const subType = message.content.subType;
    const messageProps = { ...getMessageProps(message) };

    const triggerNextAction = () => {
        const type = getNextActionType(currentMsgType);
        type && triggerAction({ type, payload: { item: resumeName } });
    };

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
            return <TextMessage message={message} isLastMessage={isLastMessage} />;
        case MessageType.BUTTON: {
            return <ButtonMessage message={message} />;
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
        case MessageType.SUBMIT_FILE:
            return (
                <SubmitFileMessage
                    message={message}
                    isLastMessage={isLastMessage}
                    onClick={triggerNextAction}
                    buttonTxt={i18n.t('buttons:searchJobs')}
                />
            );
        case MessageType.THANKS: {
            return <ThanksMessage />;
        }
        default: {
            return null;
        }
    }
});
