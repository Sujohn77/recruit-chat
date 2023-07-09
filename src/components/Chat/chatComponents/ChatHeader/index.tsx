import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTheme } from "styled-components";

import * as S from "./styles";
import { BackButton } from "../ViewJob/styles";
import { ICONS } from "assets";
import { colors } from "utils/colors";
import { ThemeType } from "utils/theme/default";
import { Flex, IntroImage } from "screens/Intro/styles";
import { ChatStatuses, useAppStore } from "store/app.store";

interface IChatHeaderProps {
  showLoginScreen: boolean;
  setShowLoginScreen: (show: boolean) => void;
  title?: string;
}

const defaultTitle = "Recruit bot";

export const ChatHeader: FC<IChatHeaderProps> = ({
  title = defaultTitle,
  showLoginScreen,
  setShowLoginScreen,
}) => {
  const theme = useTheme() as ThemeType;
  const { viewJob, setViewJob } = useChatMessenger();
  const { setChatStatus } = useAppStore();

  const handleBackButton = () => {
    if (showLoginScreen) {
      setShowLoginScreen(false);
    } else {
      setViewJob(null);
    }
  };

  const onCloseChat = () => setChatStatus(ChatStatuses.Default);

  return (
    <S.ChatHeaderWrapper>
      {viewJob && (
        <Flex>
          <BackButton onClick={handleBackButton} />
          <S.ViewTitle>{title}</S.ViewTitle>
        </Flex>
      )}

      {!viewJob && (
        <>
          <IntroImage
            src={theme?.imageUrl || ICONS.LOGO}
            size="20px"
            alt="rob-face"
          />
          <S.Title>{title}</S.Title>
          <S.CloseChat onClick={onCloseChat} color={colors.black} />
        </>
      )}
    </S.ChatHeaderWrapper>
  );
};
