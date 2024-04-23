import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import map from "lodash/map";

import * as S from "./styles";
import { optionWithReferral, options } from "./data";
import { ThemeType } from "utils/theme/default";
import { IScreenOption } from "utils/types";

export const Initialization: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const { dispatch, isReferralEnabled, setChatScreen, currentLanguage } =
    useChatMessenger();

  const onSelectOption = useCallback(
    ({ message, type, screen, i18n, i18nProps }: IScreenOption) => {
      setChatScreen(screen);
      dispatch({
        type,
        payload: { item: message, isChatMessage: true },
        i18nProps: i18nProps,
        i18n: i18n,
      });
    },
    []
  );

  const isFr = currentLanguage === "fr";
  const question = t(
    `messages:${isReferralEnabled ? "refInitialMessage" : "initialMessage"}`
  );

  return (
    <S.Wrapper isFrench={isFr}>
      {isFr ? (
        <S.InfoContent>
          <S.Header>
            <S.IntroImage isFrench src={theme?.imageUrl} size="34px" alt="" />
            <S.Question isFrench={isFr}>{question}</S.Question>
          </S.Header>
          <S.Options isFrench>
            {map(
              isReferralEnabled ? optionWithReferral : options,
              (opt, index) => (
                <S.Message
                  key={`chat-option-${index}`}
                  isFrench={isFr}
                  onClick={() => onSelectOption(opt)}
                >
                  <S.Image src={opt.icon} size={opt.size} alt={""} />
                  <S.Text>{t(opt.i18n)}</S.Text>
                </S.Message>
              )
            )}
          </S.Options>
        </S.InfoContent>
      ) : (
        <>
          <S.IntroImage src={theme?.imageUrl} size="34px" alt="" />
          <S.InfoContent>
            <S.Question isFrench={isFr}>{question}</S.Question>

            <S.Options isFrench={false}>
              {map(
                isReferralEnabled ? optionWithReferral : options,
                (opt, index) => (
                  <S.Message
                    key={`chat-option-${index}`}
                    isFrench={isFr}
                    onClick={() => onSelectOption(opt)}
                  >
                    <S.Image src={opt.icon} size={opt.size} alt={""} />
                    <S.Text>{t(opt.i18n)}</S.Text>
                  </S.Message>
                )
              )}
            </S.Options>
          </S.InfoContent>
        </>
      )}
    </S.Wrapper>
  );
};
