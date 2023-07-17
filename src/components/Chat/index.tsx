import React, { Dispatch, FC, SetStateAction, useState } from "react";

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
  isSelectedOption: boolean;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({
  isSelectedOption,
  setIsSelectedOption,
}) => {
  const [height, setHeight] = useState(480);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  return (
    <S.Wrapper isOpened={!!isSelectedOption}>
      <ChatHeader
        setShowConfirmLogout={setShowConfirmLogout}
        showLoginScreen={showLoginScreen}
        setIsSelectedOption={setIsSelectedOption}
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
        setIsSelectedOption={setIsSelectedOption}
      />

      <ViewJob setShowLoginScreen={setShowLoginScreen} />
      <MessageInput setHeight={setHeight} />
    </S.Wrapper>
  );
};
