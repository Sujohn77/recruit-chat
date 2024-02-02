import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import moment from "moment";

import { MS_1000 } from "..";
import * as S from "../styles";
import { getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage } from "utils/types";
import { DarkButton } from "components/Layout/styles";

interface IMakeReferralProps {
  message: ILocalMessage;
  isLastMessage: boolean;
}

export const MakeReferralMess: FC<IMakeReferralProps> = ({
  message,
  isLastMessage,
}) => {
  const { chooseButtonOption } = useChatMessenger();

  const messageProps = { ...getMessageProps(message) };

  const onMakeReferral = () => chooseButtonOption(ButtonsOptions.MAKE_REFERRAL);

  // TODO: refactor renderSendingTime
  const renderSendingTime = (message: ILocalMessage) => {
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

  return (
    <S.MessageBox {...messageProps}>
      <S.MessageContent withOptions>
        <S.MessageText>{message?.content?.text}</S.MessageText>
        <DarkButton
          width="100%"
          onClick={onMakeReferral}
          disabled={!isLastMessage}
        >
          Make a referral
        </DarkButton>
      </S.MessageContent>

      {renderSendingTime(message)}
    </S.MessageBox>
  );
};
