import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useState } from "react";

import * as S from "./styles";
import {
  ChatHeader,
  ChatInput,
  MessagesList,
  ReferralViewJob,
  ViewJob,
} from "./chatComponents";
import { Login } from "./chatComponents/Login";
import { Logout } from "./chatComponents/Logout";
interface IChatProps {
  isShowChat: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({ isShowChat }) => {
  const { isReferralEnabled } = useChatMessenger();

  const [height, setHeight] = useState(480);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // Referral
  const [selectedReferralJobId, setSelectedReferralJobId] = useState<number>();

  return (
    <S.Wrapper isOpened={isShowChat}>
      <ChatHeader
        setShowConfirmLogout={setShowConfirmLogout}
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
      />
      <MessagesList resultsHeight={height} />

      {/* -------------------------- PopUp's -------------------------- */}
      <Login
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
      />
      <Logout
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
