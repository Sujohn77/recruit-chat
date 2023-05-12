import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { CHAT_ACTIONS } from "utils/types";
import { colors } from "utils/colors";
import * as S from "./styles";

export const NotFoundOffer: FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useChatMessenger();

  const setJobAlert = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.SET_JOB_ALERT });
  }, []);

  const refineJobSearch = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.REFINE_SEARCH });
  }, []);

  return (
    <S.Wrapper>
      <S.Title>{t("messages:notFoundJob")}</S.Title>

      <S.SetJobAlert
        style={{ backgroundColor: colors.white }}
        onClick={setJobAlert}
      >
        {t("buttons:set_job_alert")}
      </S.SetJobAlert>

      <S.RefineJobSearch onClick={refineJobSearch}>
        {t("buttons:refine_search")}
      </S.RefineJobSearch>
    </S.Wrapper>
  );
};
