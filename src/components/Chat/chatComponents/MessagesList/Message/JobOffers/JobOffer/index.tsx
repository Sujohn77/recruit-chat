import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

import * as S from "./styles";
import { IJobOfferProps } from "./props";
import { DarkButton } from "components/Layout/styles";

export const JobOffer: React.FC<IJobOfferProps> = ({ jobOffer }) => {
  const { t } = useTranslation();
  const { setViewJob } = useChatMessenger();

  const handleReadMore = useCallback(() => setViewJob(jobOffer), []);

  return (
    <S.JobOfferWrapper>
      <S.OfferTitle>{jobOffer.title}</S.OfferTitle>

      <S.Description>{parse(jobOffer.description)}</S.Description>

      <DarkButton onClick={handleReadMore} style={{ margin: "0px auto" }}>
        {t("chat_item_description:read_more")}
      </DarkButton>
    </S.JobOfferWrapper>
  );
};
