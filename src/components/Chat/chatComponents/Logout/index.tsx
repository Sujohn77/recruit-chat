import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { SessionWarning } from "./SessionWarning";
import { PopUp } from "..";
import { EventIds } from "utils/constants";
import {
  createSendMessPayload,
  generateLocalId,
  postMessToParent,
} from "utils/helpers";
import { DarkButton } from "components/Layout/styles";
import { useChatMessenger } from "contexts/MessengerContext";
import { apiInstance } from "services/api";

interface ILogoutProps {
  showSessionWarning: boolean;
  showLogoutScreen: boolean;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
  onContinueSession: () => void;
}

export const Logout: FC<ILogoutProps> = ({
  showSessionWarning,
  showLogoutScreen,
  setShowConfirmLogout,
  onContinueSession,
}) => {
  const { t } = useTranslation();
  const { candidateId, hostname, flowId, subscriberWorkflowId } =
    useChatMessenger();

  const logoutHandle = useCallback(async () => {
    if (candidateId && flowId && subscriberWorkflowId) {
      try {
        const payload = createSendMessPayload({
          candidateId,
          flowId,
          subscriberWorkflowId,
          directionId: 1,
          localId: generateLocalId(),
          isOwn: true,
          message: "q",
        });
        // TODO: delete after adding a new endpoint for chat terminating !!!
        if (payload) {
          await apiInstance.sendMessage(payload);
        }
      } catch (error) {
      } finally {
        postMessToParent(EventIds.RefreshChatbot);
        localStorage.clear();
        localStorage.setItem(hostname + "status", "close"); // to close chatbot in other tabs
      }
    }
    // -------------------------------------------------------------------------- //
  }, [candidateId, flowId, subscriberWorkflowId]);

  return showLogoutScreen ? (
    showSessionWarning ? (
      <SessionWarning
        logoutHandle={logoutHandle}
        onContinueSession={onContinueSession}
      />
    ) : (
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
    )
  ) : null;
};
