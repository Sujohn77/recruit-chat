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

interface IProps {
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Initialization: FC<IProps> = ({ isClosed, setIsClosed }) => {
  const { t } = useTranslation();
  const theme = useTheme() as DefaultThemeType;
  const {
    dispatch,
    isReferralEnabled,
    setChatScreen,
    currentLanguage,
    withFindJobOption,
    parentPathname,
    welcomeMessage,
  } = useChatMessenger();
  const searchJob = useSearchJobFromParentSite();

  useEffect(() => {
    if (parentPathname.includes("job") && !isClosed && !isReferralEnabled) {
      searchJob();
    }
  }, [parentPathname, isClosed]);

  const onSelectOption = useCallback(
    ({ type, screen, i18n, i18nProps }: IScreenOption) => {
      setChatScreen(screen);
      dispatch({
        type,
        payload: { item: t(i18n), isChatMessage: true },
        i18nProps: i18nProps,
        i18n: i18n,
      });
    },
    []
  );

  const isFr = currentLanguage === "fr";
  // const question = t(
  //   `messages:${
  //     isReferralEnabled
  //       ? "refInitialMessage"
  //       : withFindJobOption
  //       ? "initialMessage"
  //       : "initialMessage2"
  //   }`
  // );

  const list = isReferralEnabled
    ? optionWithReferral
    : withFindJobOption
    ? defOptions
    : askQuestionOption;

  return (
    <S.Wrapper isFrench={isFr}>
      {isFr ? (
        <S.InfoContent>
          <S.Header>
            <S.IntroImage isFrench src={theme?.imageUrl} size="34px" alt="" />
            <S.Question isInitMess isFrench={isFr}>
              {welcomeMessage}
            </S.Question>
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
            <S.Question isInitMess>{welcomeMessage}</S.Question>

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
