import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { renderSendingTime } from "..";
import * as S from "../styles";
import { generateLocalId, getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage, MessageType } from "utils/types";
import { DarkButton } from "components/Layout/styles";
import { getValidationRefResponse } from "components/Chat/ChatComponents/ChatInput/data";

interface IMakeReferralProps {
  message: ILocalMessage;
  isLastMessage: boolean;
}

export const MakeReferralMess: FC<IMakeReferralProps> = ({
  message,
  isLastMessage,
}) => {
  const { t } = useTranslation();
  const {
    chooseButtonOption,
    _setMessages,
    refLastName,
    employeeId,
    employeeJobCategory,
    employeeFullName,
  } = useChatMessenger();

  const onMakeReferral = () => {
    if (employeeId) {
      const resMess = getValidationRefResponse(
        employeeJobCategory,
        employeeFullName || refLastName,
        false
      );
      const makeRefMess: ILocalMessage = {
        _id: generateLocalId(),
        localId: generateLocalId(),
        isOwn: true,
        content: {
          subType: MessageType.TEXT,
          text: t("buttons:make_referral"),
        },
      };

      _setMessages((prevMessages) => [resMess, makeRefMess, ...prevMessages]);
    } else {
      chooseButtonOption(
        ButtonsOptions.MAKE_REFERRAL,
        t("buttons:make_referral")
      );
    }
  };

  return (
    <S.MessageBox {...getMessageProps(message)}>
      <S.MessageContent withOptions>
        <S.MessageText>{message?.content?.text}</S.MessageText>
        <DarkButton
          width="100%"
          onClick={onMakeReferral}
          disabled={!isLastMessage}
        >
          {t("buttons:make_referral")}
        </DarkButton>
      </S.MessageContent>

      {renderSendingTime(message)}
    </S.MessageBox>
  );
};
