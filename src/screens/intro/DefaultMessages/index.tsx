import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import map from "lodash/map";

import * as S from "./styles";
import { optionWithReferral, options } from "./data";
import { ThemeType } from "utils/theme/default";
import { IScreenOption } from "utils/types";

export const DefaultMessages: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { dispatch, isReferralEnabled, setChatScreen } = useChatMessenger();

  const onSelectOption = useCallback(
    ({ message, type, screen }: IScreenOption) => {
      setChatScreen(screen);
      dispatch({ type, payload: { item: message, isChatMessage: true } });
    },
    []
  );

  return (
    <S.Wrapper>
      <S.IntroImage src={theme?.imageUrl} size="34px" alt="" isRounded />

      <S.InfoContent>
        <S.Question>{t("messages:initialMessage")}</S.Question>

        <S.Options>
          {map(
            isReferralEnabled ? optionWithReferral : options,
            (opt, index) => (
              <S.Message
                key={`chat-option-${index}`}
                onClick={() => onSelectOption(opt)}
              >
                <S.Image src={opt.icon} size={opt.size} alt={""} />
                <S.Text>{opt.message}</S.Text>
              </S.Message>
            )
          )}
        </S.Options>
      </S.InfoContent>
    </S.Wrapper>
  );
};
