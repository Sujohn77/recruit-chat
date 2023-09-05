import React, { FC, useState } from "react";

import * as S from "./styles";
import {
  ChatHeader,
  MessageInput,
  MessagesList,
  ViewJob,
} from "./chatComponents";
import { Login } from "./chatComponents/Login";
import { Logout } from "./chatComponents/Logout";
interface IChatProps {
  isShowChat: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({ isShowChat }) => {
  const [height, setHeight] = useState(480);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  return (
    <S.Wrapper isOpened={isShowChat}>
      <ChatHeader
        setShowConfirmLogout={setShowConfirmLogout}
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
      />
      <MessagesList
        setShowLoginScreen={setShowLoginScreen}
        resultsHeight={height}
      />

      <Login
        showLoginScreen={showLoginScreen}
        setShowLoginScreen={setShowLoginScreen}
      />

      <Logout
        showLogoutScreen={showConfirmLogout}
        setShowConfirmLogout={setShowConfirmLogout}
      />

      <ViewJob setShowLoginScreen={setShowLoginScreen} />
      <MessageInput setHeight={setHeight} />
    </S.Wrapper>
  );
};
