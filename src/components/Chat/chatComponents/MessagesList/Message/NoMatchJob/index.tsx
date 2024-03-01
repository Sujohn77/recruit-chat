import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { COLORS } from "utils/colors";
import { CHAT_ACTIONS } from "utils/types";

export const NoMatchJob: FC = () => {
  const { t } = useTranslation();
  const { dispatch, isReferralEnabled } = useChatMessenger();

  return (
    <S.Wrapper>
      <S.Text>{t("messages:noMatchMessage")}</S.Text>

      {!isReferralEnabled && (
        <S.SetJobAlert
          style={{ backgroundColor: COLORS.WHITE }}
          onClick={() => dispatch({ type: CHAT_ACTIONS.SET_JOB_ALERT })}
        >
          {t("buttons:set_job_alert")}
        </S.SetJobAlert>
      )}

      <S.RefineJobSearch
        onClick={() => dispatch({ type: CHAT_ACTIONS.REFINE_SEARCH })}
      >
        {t("buttons:refine_search")}
      </S.RefineJobSearch>
    </S.Wrapper>
  );
};
