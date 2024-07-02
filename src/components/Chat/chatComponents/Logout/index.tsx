import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
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
import { Loader } from "components/Layout";

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
  const [loading, setLoading] = useState(false);

  const logoutHandle = useCallback(async () => {
    const refreshChatbot = () => {
      postMessToParent(EventIds.RefreshChatbot);
      localStorage.clear();
      localStorage.setItem(hostname + "status", "close"); // to close chatbot in other tabs
    };
    if (candidateId && flowId && subscriberWorkflowId) {
      const payload = createSendMessPayload({
        candidateId,
        flowId,
        subscriberWorkflowId,
        directionId: 1,
        localId: generateLocalId(),
        isOwn: true,
        message: "q",
      });

      if (payload) {
        try {
          setLoading(true);
          // TODO: delete after adding a new endpoint for chat terminating !!!
          if (payload) {
            await apiInstance.sendMessage(payload);
          }
        } catch (error) {
        } finally {
          setLoading(false);
          refreshChatbot();
        }
      } else {
        refreshChatbot();
      }
    } else {
      refreshChatbot();
    }
    // -------------------------------------------------------------------------- //
  }, [candidateId, flowId, subscriberWorkflowId, hostname]);

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
            {loading ? (
              <Loader showLoader absolutePosition={false} />
            ) : (
              <>
                <DarkButton onClick={logoutHandle}>
                  {t("labels:yes")}
                </DarkButton>
                <DarkButton onClick={() => setShowConfirmLogout(false)}>
                  {t("labels:cancel")}
                </DarkButton>
              </>
            )}
          </S.ButtonsWrapper>
        </S.Wrapper>
      </PopUp>
    )
  ) : null;
};
