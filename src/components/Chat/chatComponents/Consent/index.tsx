import { FC, useCallback } from "react";

import * as S from "./styles";
import { PopUp } from "../PopUp";
import { CHAT_ACTIONS } from "utils/types";
import { DarkButton } from "components/Layout/styles";
import { useChatMessenger } from "contexts/MessengerContext";

export const Consent: FC = () => {
  const {
    chatConsent,
    setChatConsent,
    consentOptIn,
    consentOptInContinueLinkInnerText,
    PPLinkInnerText,
    PPLinkUrl,
    currentMsgType,
    currentLanguage,
  } = useChatMessenger();

  // @ts-ignore
  const text = consentOptIn?.[`content_${currentLanguage}`];
  const show =
    text &&
    !chatConsent &&
    consentOptIn?.enabled &&
    (currentMsgType === CHAT_ACTIONS.FIND_JOB ||
      currentMsgType === CHAT_ACTIONS.ASK_QUESTION);

  const openPPLink = useCallback(() => {
    const newTab = window.open(`${PPLinkUrl}`, "_blank");
    newTab?.focus();
  }, [PPLinkUrl]);

  return show ? (
    <PopUp>
      <S.Wrapper>
        <S.Text>{text}</S.Text>

        <S.ButtonsWrapper>
          <DarkButton onClick={openPPLink}>{PPLinkInnerText}</DarkButton>
          <DarkButton onClick={() => setChatConsent(true)}>
            {consentOptInContinueLinkInnerText}
          </DarkButton>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </PopUp>
  ) : null;
};
