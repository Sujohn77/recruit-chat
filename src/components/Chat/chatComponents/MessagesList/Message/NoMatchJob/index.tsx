import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { CHAT_ACTIONS } from "utils/types";
import * as S from "./styles";

interface INoMatchJobProps {
  isRefineOnly?: boolean;
}

export const NoMatchJob: FC<INoMatchJobProps> = ({ isRefineOnly = false }) => {
  const { t } = useTranslation();
  const { triggerAction } = useChatMessenger();

  if (isRefineOnly) {
    return (
      <S.Wrapper isRefineOnly>
        <S.Avatar />
        <S.RefineJobSearch
          onClick={() => triggerAction({ type: CHAT_ACTIONS.REFINE_SEARCH })}
        >
          {t("buttons:refine_search")}
        </S.RefineJobSearch>
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title>{t("chat_item_description:no_match")}</S.Title>
      <S.Avatar />

      <S.SetJobAlert
        onClick={() => triggerAction({ type: CHAT_ACTIONS.SET_JOB_ALERT })}
      >
        {t("buttons:set_job_alert")}
      </S.SetJobAlert>

      <S.RefineJobSearch
        onClick={() => triggerAction({ type: CHAT_ACTIONS.REFINE_SEARCH })}
      >
        {t("buttons:refine_search")}
      </S.RefineJobSearch>
    </S.Wrapper>
  );
};
