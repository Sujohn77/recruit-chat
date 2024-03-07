import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { PopUp } from "..";
import { EventIds } from "utils/constants";
import { postMessToParent } from "utils/helpers";
import { DarkButton } from "components/Layout/styles";
import { useChatMessenger } from "contexts/MessengerContext";

interface ILogoutProps {
  showLogoutScreen: boolean;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
}

export const Logout: FC<ILogoutProps> = ({
  showLogoutScreen,
  setShowConfirmLogout,
}) => {
  const { t } = useTranslation();
  const { hostname } = useChatMessenger();

  const logoutHandle = useCallback(() => {
    postMessToParent(EventIds.RefreshChatbot);
    localStorage.clear();
    localStorage.setItem(hostname + "status", "close"); // to close chatbot in other tabs
  }, []);

  return showLogoutScreen ? (
    <PopUp>
      <S.Wrapper>
        <S.Text>{t("messages:logout")}</S.Text>

        <S.ButtonsWrapper>
          <DarkButton onClick={logoutHandle}>{t("labels:yes")}</DarkButton>
          <DarkButton onClick={() => setShowConfirmLogout(false)}>
            {t("labels:cancel")}
          </DarkButton>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </PopUp>
  ) : null;
};
