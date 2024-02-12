import { FC } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { DarkButton } from "components/Layout/styles";
import { ILocalMessage } from "utils/types";
import { COLORS } from "utils/colors";

interface ITryAgainProps {
  message: ILocalMessage;
  isLastMessage: boolean;
}

export const TryAgain: FC<ITryAgainProps> = ({ message, isLastMessage }) => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.MessageText>{message.content.text}</S.MessageText>
      <DarkButton
        onClick={() => message.onClickTryAgain?.(message)}
        disabled={!isLastMessage}
        width="35%"
        fontWeight={500}
        fontColor={COLORS.WHITE}
        backgroundColor={COLORS.VIVID_TANGERINE}
      >
        {t("buttons:try_again")}
      </DarkButton>
    </S.Wrapper>
  );
};
