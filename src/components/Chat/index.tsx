import { useChatMessenger } from "contexts/MessengerContext";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

import {
  ChatHeader,
  MessageInput,
  MessagesList,
  ViewJob,
} from "./chatComponents";
import * as S from "./styles";
import { ThemeType } from "utils/theme/default";
import { Login } from "./chatComponents/Login";
interface IChatProps {
  isSelectedOption: boolean;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
}

export const Chat: FC<IChatProps> = ({
  isSelectedOption,
  setIsSelectedOption,
}) => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { viewJob } = useChatMessenger();

  const [height, setHeight] = useState(480);
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  const title = viewJob
    ? t("chat_item_description:view_job_title")
    : theme.chatbotName || t("chat_item_description:title");

  return (
    <S.Wrapper isOpened={!!isSelectedOption}>
      <ChatHeader
        showLoginScreen={showLoginScreen}
        title={title}
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

      <ViewJob setShowLoginScreen={setShowLoginScreen} />
      <MessageInput setHeight={setHeight} />
    </S.Wrapper>
  );
};
