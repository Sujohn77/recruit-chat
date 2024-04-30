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
} from "./ChatComponents";
import { Login } from "./ChatComponents/Login";
import { Logout } from "./ChatComponents/Logout";
import { postMessToParent } from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";
import {
  EventIds,
  REFRESH_APP_TIMEOUT,
  SESSION_WARNING_TIMEOUT,
  isMobile,
} from "utils/constants";

interface IChatProps {
  isShowChat: boolean;
  setShowIcon: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({ isShowChat, setShowIcon }) => {
  const { isReferralEnabled, currentMsgType, messages, chatScreen } =
    useChatMessenger();

  const [height, setHeight] = useState(480);
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
    <S.Wrapper isOpened={isShowChat} isMobile={isMobile}>
      <ChatHeader
        setShowConfirmLogout={setShowConfirmLogout}
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
        setShowIcon={setShowIcon}
      />
      <MessagesList
        resultsHeight={height}
        setSelectedReferralJobId={setSelectedReferralJobId}
      />

      {/* -------------------------- PopUp's -------------------------- */}
      <Login
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
      />
      <Logout
        showSessionWarning={showSessionWarning}
        onContinueSession={onContinueSession}
        showLogoutScreen={showConfirmLogout}
        setShowConfirmLogout={setShowConfirmLogout}
      />

      {isReferralEnabled ? (
        <ReferralViewJob setJobId={setSelectedReferralJobId} />
      ) : (
        <ViewJob setShowLoginScreen={setShowLoginScreen} />
      )}
      {/* ------------------------------------------------------------- */}
      <ChatInput
        setHeight={setHeight}
        selectedReferralJobId={selectedReferralJobId}
        setSelectedReferralJobId={setSelectedReferralJobId}
      />
    </S.Wrapper>
  );
};
