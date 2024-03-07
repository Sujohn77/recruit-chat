import { useChatMessenger } from "contexts/MessengerContext";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

import * as S from "./styles";
import { BackButton } from "../ViewJob/styles";
import { COLORS } from "utils/colors";
import { ThemeType } from "utils/theme/default";
import { Flex, IntroImage } from "screens/Intro/styles";

interface IChatHeaderProps {
  showLoginScreen: boolean;
  setShowLoginScreen: (show: boolean) => void;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
}

export const ChatHeader: FC<IChatHeaderProps> = ({
  showLoginScreen,
  setShowLoginScreen,
  setShowConfirmLogout,
}) => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { viewJob, setViewJob, hostname } = useChatMessenger();

  const title = viewJob
    ? t("chat_item_description:view_job_title")
    : theme.chatbotName || t("chat_item_description:title");

  const handleBackButton = useCallback(() => {
    if (showLoginScreen) {
      setShowLoginScreen(false);
    } else {
      localStorage.removeItem(hostname + "viewJob");
      setViewJob(null);
    }
  }, [showLoginScreen]);

  const onCloseChat = useCallback(() => setShowConfirmLogout(true), []);

  return (
    <S.ChatHeaderWrapper>
      {viewJob ? (
        <Flex>
          <BackButton onClick={handleBackButton} />
          <S.ViewTitle>{title}</S.ViewTitle>
        </Flex>
      ) : (
        <>
          <IntroImage src={theme?.imageUrl} size="20px" alt="" />
          <S.Title>{title}</S.Title>
          <S.CloseChat onClick={onCloseChat} />
        </>
      )}
    </S.ChatHeaderWrapper>
  );
};
