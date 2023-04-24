import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { getMessageProps } from "utils/helpers";
import { MessageType, ILocalMessage } from "utils/types";

import { UploadCV } from "./UploadCV";
import { EmailForm } from "./EmailForm";
import { JobOffers } from "./JobOffers";

import { NoMatchJob } from "./NoMatchJob";
import { TextWithOptions } from "./TextWithOptions";
import { TranscriptSent } from "./TranscriptSent";

import { TextMessage } from "./TextMessage";
import { InterestedIn } from "./InterestedIn";
import { HiringHelp } from "./HiringHelp";
import { SalaryForm } from "./SalaryForm";
import { QuestionForm } from "./QuestionForm";
import { ButtonMessage } from "./ButtonMessage";
import { SubmitFileMessage } from "./SubmitFileMessage";
import { UploadedFile } from "./UploadedFile";

interface IMessageProps {
  message: ILocalMessage;
  isLastMessage: boolean;
  // onClick: (content: IContent) => void;
  // handleOfferSubmit: ((id: string | number) => void) | undefined;
}

export const MS_1000 = 1000;

export const Message: FC<IMessageProps> = memo(({ message, isLastMessage }) => {
  const { t } = useTranslation();
  const subType = message.content.subType;
  const messageProps = { ...getMessageProps(message) };

  // const triggerNextAction = () => {
  //     const type = getNextActionType(currentMsgType);
  //     type && triggerAction({ type, payload: { item: resumeName } });
  // };

  switch (subType) {
    case MessageType.INITIAL_MESSAGE:
      return <S.InitialMessage>{message.content.text}</S.InitialMessage>;
    case MessageType.UPLOAD_CV:
      return <UploadCV />;
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
    case MessageType.REFINE_SEARCH: {
      return (
        <NoMatchJob isRefineOnly={subType === MessageType.REFINE_SEARCH} />
      );
    }
    case MessageType.SUBMIT_FILE:
      return (
        <SubmitFileMessage
          message={message}
          isLastMessage={isLastMessage}
          buttonTxt={t("buttons:searchJobs")}
        />
      );
    case MessageType.UPLOADED_CV:
      return <UploadedFile message={message} />;
    default: {
      return null;
    }
  }
});
