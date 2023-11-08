import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import map from "lodash/map";

import * as S from "./styles";
import { messages } from "./data";
import { LocalStorage } from "utils/constants";
import { ThemeType } from "utils/theme/default";
import { CHAT_ACTIONS } from "utils/types";
import { ChatScreens, useAppStore } from "store/app.store";

export interface IOption {
  icon: string;
  message: string;
  type: CHAT_ACTIONS;
  size: string;
}

export const DefaultMessages: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { dispatch } = useChatMessenger();
  const { setChatScreen } = useAppStore();

  const onClick = useCallback(({ message, type }: IOption) => {
    setChatScreen(
      ChatScreens[type === CHAT_ACTIONS.FIND_JOB ? "FindAJob" : "QnA"]
    );
    dispatch({ type, payload: { item: message, isChatMessage: true } });
    localStorage.setItem(LocalStorage.InitChatActionType, JSON.stringify(type));
  }, []);

  return (
    <S.Wrapper>
      <S.IntroImage src={theme?.imageUrl} size="34px" alt="" isRounded />

      <S.InfoContent>
        <S.Question>{t("messages:initialMessage")}</S.Question>

        <S.Options>
          {map(messages.options, (opt, index) => (
            <S.Message
              key={`chat-option-${index}`}
              onClick={() => onClick(opt)}
            >
              <S.Image src={opt.icon} size={opt.size} alt={""} />
              <S.Text>{opt.message}</S.Text>
            </S.Message>
          ))}
        </S.Options>
      </S.InfoContent>
    </S.Wrapper>
  );
};
