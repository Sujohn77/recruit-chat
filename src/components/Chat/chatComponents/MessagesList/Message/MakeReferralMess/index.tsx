import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { renderSendingTime } from "..";
import * as S from "../styles";
import { createTextMess, getMessageProps } from "utils/helpers";
import { ButtonsOptions, ILocalMessage } from "utils/types";
import { DarkButton } from "components/Layout/styles";
import { getValidationRefResponse } from "components/Chat/ChatComponents/ChatInput/data";
import { SendingTime } from "../TextMessage/styles";

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
    firstName,
    lastName,
    chatbotName,
  } = useChatMessenger();

  const senderName = useMemo<string>(
    () =>
      message.isOwn
        ? firstName && lastName
          ? `${firstName} ${lastName}`
          : `${message.sender?.firstName || ""} ${
              message.sender?.lastName || ""
            }`
        : message.sender?.firstName
        ? `${message.sender?.firstName || ""} ${message.sender?.lastName || ""}`
        : chatbotName || "",
    [message, firstName, lastName, chatbotName]
  );

  const onMakeReferral = () => {
    const makeRefMess = createTextMess({
      isOwn: true,
      text: t("buttons:make_referral"),
      i18n: "buttons:make_referral",
    });
    if (employeeId) {
      const resMess = getValidationRefResponse(
        employeeJobCategory,
        employeeFullName || refLastName,
        false
      );

      sendNewMessage({
        isOwn: false,
        message: resMess.content.text,
        localId: resMess.localId,
      });
      setMessages((prevMessages) => [resMess, makeRefMess, ...prevMessages]);
    } else {
      sendNewMessage({
        message: makeRefMess.content.text,
        isOwn: true,
        localId: makeRefMess.localId,
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

      <SendingTime isOwn={message.isOwn}>
        <S.Sender isOwn={!!message.isOwn}>{senderName}</S.Sender>
        {renderSendingTime(message)}
      </SendingTime>
    </S.MessageBox>
  );
};
