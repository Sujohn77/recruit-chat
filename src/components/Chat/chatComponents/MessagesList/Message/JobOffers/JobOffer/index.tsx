import React from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { IJobOfferProps } from "./props";
import { DarkButton } from "components/Layout/styles";

export const JobOffer: React.FC<IJobOfferProps> = ({
  title,
  handleReadMore,
  handleButtonClick,
  category,
}) => {
  const { t } = useTranslation();

  return (
    <S.JobOfferWrapper>
      <S.OfferTitle>{title}</S.OfferTitle>

      <S.ReadMore onClick={handleReadMore}>
        {t("chat_item_description:read_more")}
      </S.ReadMore>

      <DarkButton onClick={handleButtonClick}>
        {t("chat_item_description:interested_in")}
      </DarkButton>
    </S.JobOfferWrapper>
  );
};
