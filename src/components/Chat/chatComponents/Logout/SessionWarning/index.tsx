import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { PopUp } from "../../PopUp";
import { IMAGES } from "assets";
import { DarkButton } from "components/Layout/styles";

interface ISessionWarningProps {
  logoutHandle: () => void;
  onContinueSession: () => void;
}

export const SessionWarning: FC<ISessionWarningProps> = ({
  logoutHandle: logoutHandler,
  onContinueSession,
}) => {
  const { t } = useTranslation();

  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return minutes > 0
      ? `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      : "0:00";
  };

  return (
    <PopUp>
      <S.Wrapper>
        <S.Title>Session warning</S.Title>

        <S.TextWrapper>
          <S.ClockImg src={IMAGES.CLOCK} alt="" />
          <S.Text>You session is about to expire in</S.Text>
          <S.Timer>{formatTime(seconds)}</S.Timer>
          <S.Text>
            Please choose an option below or you will be automatically logged
            out.
          </S.Text>
        </S.TextWrapper>

        <S.ButtonsWrapper>
          <DarkButton onClick={onContinueSession}>
            {t("labels:continue")}
          </DarkButton>
          <DarkButton onClick={logoutHandler}>{t("labels:log_out")}</DarkButton>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </PopUp>
  );
};
