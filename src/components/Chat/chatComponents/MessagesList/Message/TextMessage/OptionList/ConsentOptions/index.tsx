import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import map from "lodash/map";

import * as S from "../styles";
import { IMessageOption } from "services/types";
import { ILocalMessage } from "utils/types";
import { getChatActionMessages } from "utils/constants";
import { getParsedMessages } from "utils/helpers";

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
  } = useChatMessenger();

  const onSelectOption = useCallback(
    (option: IMessageOption) => {
      const optId = option.id;
      switch (optId) {
        case 1:
          const newTab = window.open(`${PPLinkUrl}`, "_blank");
          newTab?.focus();
          break;
        case 2:
          if (isLastMess) {
            setChatConsent(true);
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
            setMessages((prev) => [...responseMessages, ...prev]);
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
