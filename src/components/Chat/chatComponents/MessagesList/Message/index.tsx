import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import moment from "moment";

import * as S from "./styles";
import { MS_1000 } from "utils/constants";
import { MessageType, ILocalMessage } from "utils/types";

import { UploadCV } from "./UploadCV";
import { EmailForm } from "./EmailForm";
import { JobOffers } from "./JobOffers";
import { NoMatchJob } from "./NoMatchJob";
import { TranscriptSent } from "./TranscriptSent";
import { TextMessage } from "./TextMessage";
import { InterestedIn } from "./InterestedIn";
import { ButtonMessage } from "./ButtonMessage";
import { SearchJob } from "./SearchJob";
import { UploadedFile } from "./UploadedFile";
import { TryAgain } from "./TryAgain";
import { MakeReferralMess } from "./MakeReferralMess";
import { InlineDisclaimer } from "./InlineDisclaimer";
import { QuestionsList } from "./QuestionsList";

interface IMessageProps {
  message: ILocalMessage;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const Message: FC<IMessageProps> = ({
  message,
  setSelectedReferralJobId,
}) => {
  const { messages } = useChatMessenger();
  const subType = message?.content?.subType;
  const messageIndex = messages.findIndex((m) => m.localId === message.localId);
  const isLastMess = messageIndex === 0;
  const defProps = { isLastMess, message };

  switch (subType) {
    case MessageType.INITIAL_MESSAGE:
      return <S.InitialMessage>{message?.content?.text}</S.InitialMessage>;
    case MessageType.UPLOAD_CV:
      return <UploadCV />;
    case MessageType.EMAIL_FORM:
      return <EmailForm />;
    case MessageType.JOB_POSITIONS:
      return (
        <JobOffers
          isLastMess={isLastMess}
          setSelectedReferralJobId={setSelectedReferralJobId}
        />
      );
    case MessageType.TRANSCRIPT:
      return <TranscriptSent />;
    case MessageType.TEXT:
    case MessageType.FILE:
      return (
        <TextMessage
          {...defProps}
          setSelectedReferralJobId={setSelectedReferralJobId}
        />
      );
    case MessageType.BUTTON:
      return <ButtonMessage {...defProps} />;
    case MessageType.INTERESTED_IN:
      return <InterestedIn {...defProps} />;
    case MessageType.NO_MATCH:
    case MessageType.REFINE_SEARCH:
      return <NoMatchJob />;
    case MessageType.SUBMIT_FILE:
      return <SearchJob {...defProps} />;
    case MessageType.UPLOADED_CV:
      return <UploadedFile {...defProps} />;
    case MessageType.TRY_AGAIN:
      return <TryAgain {...defProps} />;
    case MessageType.REFERRAL:
      return <MakeReferralMess {...defProps} />;
    case MessageType.INLINE_DISCLAIMER:
      return <InlineDisclaimer {...defProps} />;
    case MessageType.QUESTIONS_LIST:
      return <QuestionsList {...defProps} />;
    default: {
      return null;
    }
  }
};

export const renderSendingTime = (message: ILocalMessage) =>
  message._id ? (
    <S.TimeText>
      {message.dateCreated?.seconds &&
        moment(message.dateCreated?.seconds! * MS_1000).format("HH:mm A")}
    </S.TimeText>
  ) : null;
