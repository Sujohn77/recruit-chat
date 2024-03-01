import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

import * as S from "./styles";
import { ButtonsOptions, IRequisition } from "utils/types";
import { DarkButton } from "components/Layout/styles";

interface IJobOfferProps {
  isLastMess: boolean;
  jobOffer: IRequisition;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const JobOffer: React.FC<IJobOfferProps> = ({
  isLastMess,
  jobOffer,
  setSelectedReferralJobId,
}) => {
  const { t } = useTranslation();
  const { setViewJob, isReferralEnabled, chooseButtonOption } =
    useChatMessenger();

  const handleReadMore = useCallback(() => setViewJob(jobOffer), []);

  const referFriendHandle = useCallback(() => {
    jobOffer.id && setSelectedReferralJobId(+jobOffer.id);
    setViewJob(null);
    localStorage.removeItem("viewJob");
    chooseButtonOption(ButtonsOptions.MAKE_REFERRAL, t("buttons:refer_friend"));
  }, [jobOffer.id]);

  return (
    <S.JobOfferWrapper>
      <S.OfferTitle>{jobOffer.title}</S.OfferTitle>

      <S.Description>{parse(jobOffer.description)}</S.Description>

      {isReferralEnabled ? (
        <S.ButtonsWrapper>
          <DarkButton disabled={!isLastMess} onClick={handleReadMore}>
            {t("chat_item_description:read_more")}
          </DarkButton>
          <DarkButton
            disabled={!isLastMess}
            onClick={referFriendHandle}
            fontWeight={700}
          >
            {t("buttons:refer_friend")}
          </DarkButton>
        </S.ButtonsWrapper>
      ) : (
        <DarkButton
          disabled={!isLastMess}
          onClick={handleReadMore}
          style={{ margin: "0px auto" }}
        >
          {t("chat_item_description:read_more")}
        </DarkButton>
      )}
    </S.JobOfferWrapper>
  );
};
