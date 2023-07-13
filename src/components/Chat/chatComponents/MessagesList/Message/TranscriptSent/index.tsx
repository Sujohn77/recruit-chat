import { FC } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";

export const TranscriptSent: FC = () => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.Title>{t("chat_item_description:transcript_sent")}</S.Title>
      <S.Avatar />
    </S.Wrapper>
  );
};
