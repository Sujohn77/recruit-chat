import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import moment from "moment";

import * as S from "./styles";
import { MS_1000 } from "utils/constants";
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
import { SalaryForm } from "./SalaryForm";
import { ButtonMessage } from "./ButtonMessage";
import { SearchJob } from "./SearchJob";
import { UploadedFile } from "./UploadedFile";
import { TryAgain } from "./TryAgain";
import { MakeReferralMess } from "./MakeReferralMess";

interface IMessageProps {
  message: ILocalMessage;
  withoutMargin?: boolean;
  index?: number;
}

export const Message: FC<IMessageProps> = ({
  message,
  withoutMargin,
  index,
}) => {
  const { messages } = useChatMessenger();
  const subType = message?.content?.subType;
  const messageProps = { ...getMessageProps(message) };
  const messageIndex = messages.findIndex((m) => m.localId === message.localId);
  const isLastMess = messageIndex === 0;

  switch (subType) {
    case MessageType.INITIAL_MESSAGE:
      return <S.InitialMessage>{message?.content?.text}</S.InitialMessage>;
    case MessageType.UPLOAD_CV:
      return <UploadCV withoutMargin={withoutMargin} />;
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
      return <TextMessage index={index} message={message} />;
    case MessageType.BUTTON: {
      return <ButtonMessage message={message} />;
    }
    case MessageType.INTERESTED_IN:
      return <InterestedIn message={message} />;
    case MessageType.TEXT_WITH_CHOICE: {
      return (
        <TextWithOptions text={message?.content.text!} {...messageProps} />
      );
    }
    case MessageType.HIRING_PROCESS: {
      // return <HiringHelp message={message} />; // for phase 2
      return null;
    }
    case MessageType.QUESTION_FORM: {
      return null;
      // return <QuestionForm />; // for phase 2
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
      return <SearchJob message={message} />;
    case MessageType.UPLOADED_CV:
      return <UploadedFile message={message} />;
    case MessageType.TRY_AGAIN:
      return <TryAgain message={message} isLastMessage={isLastMess} />;
    case MessageType.REFERRAL:
      return <MakeReferralMess message={message} isLastMessage={isLastMess} />;
    default: {
      return null;
    }
  }
};

export const renderSendingTime = (message: ILocalMessage) => {
  const createdAt = moment(message.dateCreated?.seconds! * MS_1000).format(
    "HH:mm A"
  );
  if (message?.localId !== message._id && message.isOwn) {
    if (message._id) {
      return (
        <S.TimeText>{message.dateCreated?.seconds && createdAt}</S.TimeText>
      );
    }
    return null;
  }

  return null;
};
