import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import map from "lodash/map";

import * as S from "./styles";
import { optionWithReferral, defOptions, askQuestionOption } from "./data";
import { DefaultThemeType } from "utils/theme/default";
import { IScreenOption } from "utils/types";
import { useSearchJobFromParentSite } from "contexts/hooks";

export const Initialization: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as DefaultThemeType;
  const {
    dispatch,
    isReferralEnabled,
    setChatScreen,
    currentLanguage,
    sendNewMessage,
    withFindJob,
    parentPathname,
  } = useChatMessenger();
  const searchJob = useSearchJobFromParentSite();

  useEffect(() => {
    if (parentPathname.includes("job")) {
      searchJob();
    }
  }, [parentPathname]);

  const onSelectOption = useCallback(
    async ({ type, screen, i18n, i18nProps }: IScreenOption) => {
      setChatScreen(screen);
      dispatch({
        type,
        payload: { item: t(i18n), isChatMessage: true },
        i18nProps: i18nProps,
        i18n: i18n,
      });

      await sendNewMessage({
        message: t(i18n),
      });
    },
    []
  );

  const isFr = currentLanguage === "fr";
  const question = t(
    `messages:${
      isReferralEnabled
        ? "refInitialMessage"
        : withFindJob
        ? "initialMessage"
        : "initialMessage2"
    }`
  );

  const list = isReferralEnabled
    ? optionWithReferral
    : withFindJob
    ? defOptions
    : askQuestionOption;

  return (
    <S.Wrapper isFrench={isFr}>
      {isFr ? (
        <S.InfoContent>
          <S.Header>
            <S.IntroImage isFrench src={theme?.imageUrl} size="34px" alt="" />
            <S.Question isFrench={isFr}>{question}</S.Question>
          </S.Header>
          <S.Options isFrench>
            {map(list, (opt, index) => (
              <S.Message
                key={`chat-option-${index}`}
                isFrench={isFr}
                onClick={() => onSelectOption(opt)}
              >
                <S.Image src={opt.icon} size={opt.size} alt={""} />
                <S.Text>{t(opt.i18n)}</S.Text>
              </S.Message>
            ))}
          </S.Options>
        </S.InfoContent>
      ) : (
        <>
          <S.IntroImage src={theme?.imageUrl} size="34px" alt="" />
          <S.InfoContent>
            <S.Question isFrench={isFr}>{question}</S.Question>

            <S.Options isFrench={false}>
              {map(list, (opt, index) => (
                <S.Message
                  key={`chat-option-${index}`}
                  isFrench={isFr}
                  onClick={() => onSelectOption(opt)}
                >
                  <S.Image src={opt.icon} size={opt.size} alt={""} />
                  <S.Text>{t(opt.i18n)}</S.Text>
                </S.Message>
              ))}
            </S.Options>
          </S.InfoContent>
        </>
      )}
    </S.Wrapper>
  );
};
