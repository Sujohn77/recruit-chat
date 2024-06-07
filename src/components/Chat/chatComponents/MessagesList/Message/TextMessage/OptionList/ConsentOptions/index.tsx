import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "../styles";
import { IMessageOption } from "services/types";
import { getChatActionMessages } from "utils/constants";
import { CHAT_ACTIONS, ILocalMessage } from "utils/types";
import { createTextMess, getParsedMessages } from "utils/helpers";

interface IConsentOptionsProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const ConsentOptions: FC<IConsentOptionsProps> = ({
  message,
  isLastMess,
}) => {
  const {
    currentMsgType,
    setChatConsent,
    PPLinkUrl,
    setMessages,
    inlineDisclaimer,
    messages,
    consentOptIn,
    sendNewMessage,
  } = useChatMessenger();
  const { t } = useTranslation();

  const onSelectOption = useCallback(
    async (option: IMessageOption) => {
      const optId = option.id;
      switch (optId) {
        case 1:
          const newTab = window.open(`${PPLinkUrl}`, "_blank");
          newTab?.focus();
          break;
        case 2:
          if (isLastMess) {
            sendNewMessage({
              message: message.content.text,
              isOwn: false,
            });
            sendNewMessage({
              message: option.text,
              isOwn: true,
            });

            setChatConsent(true);
            switch (currentMsgType) {
              case CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE:
                const resMess = createTextMess({
                  text: t("messages:apply_job_provide_firstname"),
                  i18n: "messages:apply_job_provide_firstname",
                });

                sendNewMessage({
                  isOwn: false,
                  message: resMess.content.text,
                });
                setMessages((prev) => [resMess, ...prev]);
                break;

              default:
                const responseMessages = getParsedMessages(
                  getChatActionMessages({
                    chatConsent: true,
                    referralCompanyName: "",
                    withReferralFlow: false,
                    type: currentMsgType,
                    inlineDisclaimer,
                    consentOptIn,
                    messages,
                  })
                );
                responseMessages.forEach(
                  (mess) =>
                    !mess.isOwn &&
                    sendNewMessage({
                      isOwn: false,
                      message: mess.content.text,
                    })
                );

                setMessages((prev) => {
                  const text = option.text;
                  const userMess = createTextMess({
                    text: text || "",
                    isOwn: true,
                  });
                  return !text
                    ? [...responseMessages, ...prev]
                    : [...responseMessages, userMess, ...prev];
                });
                break;
            }
          }
          break;
        default:
          break;
      }
    },
    [
      currentMsgType,
      isLastMess,
      messages,
      inlineDisclaimer,
      PPLinkUrl,
      consentOptIn,
      sendNewMessage,
    ]
  );

  return (
    <S.ReferralOptionList>
      {map(message.optionList?.options, (o) => (
        <S.ConsentOptionButton
          onClick={() => onSelectOption(o)}
          isSelected={!isLastMess && o.id === 2}
        >
          {o.text}
        </S.ConsentOptionButton>
      ))}
    </S.ReferralOptionList>
  );
};
