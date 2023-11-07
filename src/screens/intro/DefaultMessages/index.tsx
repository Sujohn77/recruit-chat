import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "./styles";
import { defMessages } from "./data";
import { ChatScreens, useAppStore } from "store/app.store";
import { CHAT_ACTIONS } from "utils/types";
import { LocalStorage } from "utils/constants";
import { ThemeType } from "utils/theme/default";

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

  const onClick = useCallback((option: IOption) => {
    const { message: item, type } = option;
    setChatScreen(
      ChatScreens[type === CHAT_ACTIONS.FIND_JOB ? "FindAJob" : "QnA"]
    );
    dispatch({ type, payload: { item, isChatMessage: true } });
    localStorage.setItem(LocalStorage.InitChatActionType, JSON.stringify(type));
  }, []);

  return (
    <S.Wrapper>
      <S.IntroImage src={theme?.imageUrl} size="34px" alt="" isRounded />

      <S.InfoContent>
        <S.Question>{t("messages:initialMessage")}</S.Question>
        <S.Options>
          {map(defMessages.options, (opt, index) => (
            <S.Message
              key={`chat-option-${index}`}
              onClick={() => onClick(opt)}
            >
              {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={""} />}
              <S.Text>{opt.message}</S.Text>
            </S.Message>
          ))}
        </S.Options>
      </S.InfoContent>
    </S.Wrapper>
  );
};
