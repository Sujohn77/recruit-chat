import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { renderSendingTime } from "..";
import * as S from "../styles";
import { getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage } from "utils/types";
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
        true
      );
      _setMessages((prevMessages) => [resMess, ...prevMessages]);
    } else {
      chooseButtonOption(ButtonsOptions.MAKE_REFERRAL);
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
