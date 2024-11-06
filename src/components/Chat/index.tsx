import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback, useEffect, useState } from "react";
import isNull from "lodash/isNull";

import * as S from "./styles";
import {
  ChatHeader,
  ChatInput,
  MessagesList,
  ReferralViewJob,
  ViewJob,
  Login,
  Logout,
} from "./СhatComponents";
import { CHAT_ACTIONS } from "utils/types";
import { postMessToParent } from "utils/helpers";
import {
  EventIds,
  REFRESH_APP_TIMEOUT,
  SESSION_WARNING_TIMEOUT,
  isMobile,
} from "utils/constants";
import { useChatbotHeight } from "contexts/hooks";

interface IChatProps {
  setShowIcon: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IChatWrapperProps {
  isChatOpen: boolean;
  children: React.ReactNode;
}

export const ChatWrapper: FC<IChatWrapperProps> = ({
  isChatOpen,
  children,
}) => {
  const chatbotHeight = useChatbotHeight();
  return (
    <S.Wrapper
      isOpened={isChatOpen}
      chatbotHeigh={chatbotHeight}
      isMobile={isMobile}
    >
      {children}
    </S.Wrapper>
  );
};

export const Chat: FC<IChatProps> = ({ setShowIcon, setIsClosed }) => {
  const { isReferralEnabled, currentMsgType, messages, chatScreen } =
    useChatMessenger();

  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [isCanceledLogout, setIsCanceledLogout] = useState(false);
  // Referral
  const [selectedReferralJobId, setSelectedReferralJobId] = useState<number>();

  useEffect(() => {
    // REFRESH CHATBOT
    let timeout: NodeJS.Timeout | undefined;

    if (!isNull(chatScreen)) {
      timeout = setTimeout(() => {
        sessionStorage.clear();
        localStorage.clear();
        postMessToParent(EventIds.RefreshChatbot);
      }, REFRESH_APP_TIMEOUT);
    }

    return () => timeout && clearTimeout(timeout);
  }, [chatScreen, messages.length, isCanceledLogout]);

  useEffect(() => {
    // If live chat and the user is not interacting with the app
    // then display a notification that the chatbot will be reloaded soon
    let timeout: NodeJS.Timeout | undefined;

    if (currentMsgType === CHAT_ACTIONS.LIVE_CHAT) {
      timeout = setTimeout(() => {
        setShowSessionWarning(true);
        setShowConfirmLogout(true);
      }, SESSION_WARNING_TIMEOUT);
    }

    return () => timeout && clearTimeout(timeout);
  }, [currentMsgType, messages.length, isCanceledLogout]);

  const onContinueSession = useCallback(() => {
    setShowConfirmLogout(false);
    setShowSessionWarning(false);
    setIsCanceledLogout((prev) => !prev);
  }, []);

  return (
    <>
      <ChatHeader
        setShowConfirmLogout={setShowConfirmLogout}
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
        setShowIcon={setShowIcon}
      />

      <MessagesList setSelectedReferralJobId={setSelectedReferralJobId} />

      <Login
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
      />
      <Logout
        showSessionWarning={showSessionWarning}
        onContinueSession={onContinueSession}
        showLogoutScreen={showConfirmLogout}
        setShowConfirmLogout={setShowConfirmLogout}
        setIsClosed={setIsClosed}
        setShowIcon={setShowIcon}
      />

      {isReferralEnabled ? (
        <ReferralViewJob setJobId={setSelectedReferralJobId} />
      ) : (
        <ViewJob setShowLoginScreen={setShowLoginScreen} />
      )}

      <ChatInput
        selectedReferralJobId={selectedReferralJobId}
        setSelectedReferralJobId={setSelectedReferralJobId}
      />
    </>
  );
};
