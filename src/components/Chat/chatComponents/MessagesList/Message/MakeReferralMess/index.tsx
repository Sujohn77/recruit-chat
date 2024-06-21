import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { renderSendingTime } from "..";
import * as S from "../styles";
import { createTextMess, getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage } from "utils/types";
import { DarkButton } from "components/Layout/styles";
import { getValidationRefResponse } from "components/Chat/ChatComponents/ChatInput/data";

interface IMakeReferralProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const MakeReferralMess: FC<IMakeReferralProps> = ({
  message,
  isLastMess,
}) => {
  const { t } = useTranslation();
  const {
    chooseButtonOption,
    setMessages,
    refLastName,
    employeeId,
    employeeJobCategory,
    employeeFullName,
    sendNewMessage,
  } = useChatMessenger();

  const onMakeReferral = () => {
    if (employeeId) {
      const resMess = getValidationRefResponse(
        employeeJobCategory,
        employeeFullName || refLastName,
        false
      );
      const makeRefMess = createTextMess({
        isOwn: true,
        text: t("buttons:make_referral"),
        i18n: "buttons:make_referral",
      });
      sendNewMessage({
        isOwn: false,
        message: resMess.content.text,
        localId: resMess.localId,
      });
      setMessages((prevMessages) => [resMess, makeRefMess, ...prevMessages]);
    } else {
      sendNewMessage({
        message: t("buttons:make_referral"),
        isOwn: true,
        localId: null,
      });
      chooseButtonOption(
        ButtonsOptions.MAKE_REFERRAL,
        t("buttons:make_referral"),
        "buttons:make_referral"
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
          disabled={!isLastMess}
        >
          {t("buttons:make_referral")}
        </DarkButton>
      </S.MessageContent>

      {renderSendingTime(message)}
    </S.MessageBox>
  );
};
