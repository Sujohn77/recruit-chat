import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

import * as S from "./styles";
import { ButtonsOptions } from "utils/types";
import { getFormattedDate } from "utils/helpers";
import { DarkButton } from "components/Layout/styles";

interface IRefViewJobProps {
  setJobId: React.Dispatch<React.SetStateAction<number>>;
}

export const ReferralViewJob: FC<IRefViewJobProps> = ({ setJobId }) => {
  const { viewJob, chooseButtonOption, setViewJob } = useChatMessenger();
  const { t } = useTranslation();

  const referFriendHandle = useCallback(() => {
    viewJob?.id && setJobId(+viewJob.id);
    setViewJob(null);
    chooseButtonOption(ButtonsOptions.MAKE_REFERRAL, t("buttons:refer_friend"));
    localStorage.removeItem("viewJob");
  }, [viewJob]);

  return !viewJob ? null : (
    <S.ViewBody>
      <S.ViewShortInfo>
        <S.TextHeaderTitle>{viewJob.title}</S.TextHeaderTitle>

        <S.ShortItems>
          <S.InfoItem>{viewJob.location.city}</S.InfoItem>
          <S.InfoItem>{getFormattedDate(viewJob.datePosted!)}</S.InfoItem>
          <S.InfoItem>{viewJob.hiringType}</S.InfoItem>
        </S.ShortItems>

        <S.ButtonsWrapper>
          <DarkButton onClick={referFriendHandle} fontWeight={700}>
            {t("buttons:refer_friend")}
          </DarkButton>
        </S.ButtonsWrapper>
      </S.ViewShortInfo>

      <S.ViewText>
        {viewJob.company && (
          <p>
            <b>{t("labels:company")}</b>
            {viewJob.company}
          </p>
        )}

        {viewJob?.status && (
          <p>
            <b>{t("labels:status")} </b>
            {viewJob.status}
          </p>
        )}
      </S.ViewText>
      <S.TextTitle>{t("labels:job_description")} </S.TextTitle>
      <S.ViewDescription>{parse(viewJob.description)}</S.ViewDescription>
    </S.ViewBody>
  );
};
