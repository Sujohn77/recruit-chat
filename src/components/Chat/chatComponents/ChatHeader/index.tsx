import { useChatMessenger } from "contexts/MessengerContext";
import { Dispatch, FC, SetStateAction } from "react";
import { useTheme } from "styled-components";

import * as S from "./styles";
import { BackButton } from "../ViewJob/styles";
import { ICONS } from "assets";
import { colors } from "utils/colors";
import { ThemeType } from "utils/theme/default";
import { Flex, IntroImage } from "screens/Intro/styles";

interface IChatHeaderProps {
  showLoginScreen: boolean;
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  setShowLoginScreen: (show: boolean) => void;
  title?: string;
}

const defaultTitle = "Recruit bot";

export const ChatHeader: FC<IChatHeaderProps> = ({
  title = defaultTitle,
  setIsSelectedOption,
  showLoginScreen,
  setShowLoginScreen,
}) => {
  const theme = useTheme() as ThemeType;
  const { viewJob, setViewJob } = useChatMessenger();

  const handleBackButton = () => {
    if (showLoginScreen) {
      setShowLoginScreen(false);
    } else {
      setViewJob(null);
    }
  };

  const onCloseChat = () => setIsSelectedOption(false);

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
