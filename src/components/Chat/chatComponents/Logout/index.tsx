import { Dispatch, FC, SetStateAction, useCallback } from "react";

import { PopUp } from "..";
import * as S from "./styles";
import { DarkButton } from "components/Layout/styles";
import { EventIds } from "utils/constants";
import { postMessToParent } from "utils/helpers";
import { useTranslation } from "react-i18next";

interface ILogoutProps {
  showLogoutScreen: boolean;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
}

export const Logout: FC<ILogoutProps> = ({
  showLogoutScreen,
  setShowConfirmLogout,
}) => {
  const { t } = useTranslation();

  return showLogoutScreen ? (
    <PopUp>
      <S.Wrapper>
        <S.Text>{t("messages:logout")}</S.Text>

        <S.ButtonsWrapper>
          <DarkButton onClick={() => postMessToParent(EventIds.RefreshChatbot)}>
            {t("labels:yes")}
          </DarkButton>
          <DarkButton onClick={() => setShowConfirmLogout(false)}>
            {t("labels:cancel")}
          </DarkButton>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </PopUp>
  ) : null;
};
