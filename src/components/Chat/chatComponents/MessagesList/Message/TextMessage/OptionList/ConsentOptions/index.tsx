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
    sendNewChatbotMessage,
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
            if (option.text) {
              await sendNewMessage({
                message: option.text,
              });
            }
            setChatConsent(true);
            switch (currentMsgType) {
              case CHAT_ACTIONS.APPLY_JOB_FROM_PARENT_SITE:
                const resMess = createTextMess({
                  text: t("messages:apply_job_provide_firstname"),
                  i18n: "messages:apply_job_provide_firstname",
                });

                sendNewChatbotMessage(resMess.content.text);
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
                    !mess.isOwn && sendNewChatbotMessage(mess.content.text)
                );
                setMessages((prev) => [...responseMessages, ...prev]);
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
