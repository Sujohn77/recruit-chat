import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import browserStorage from "store";

import * as S from "./styles";
import { SessionWarning } from "./SessionWarning";
import { PopUp } from "..";
import { EventIds } from "utils/constants";
import {
  createSendMessPayload,
  generateLocalId,
  LOG,
  postMessToParent,
} from "utils/helpers";
import { DarkButton } from "components/Layout/styles";
import { useChatMessenger } from "contexts/MessengerContext";
import { apiInstance } from "services/api";
import { Loader } from "components/Layout";
import { ApiResponse } from "apisauce";
import { IFollowingResponse } from "services/types";

interface ILogoutProps {
  showSessionWarning: boolean;
  showLogoutScreen: boolean;
  setShowConfirmLogout: Dispatch<SetStateAction<boolean>>;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
  setShowIcon: React.Dispatch<React.SetStateAction<boolean>>;
  onContinueSession: () => void;
}

export const Logout: FC<ILogoutProps> = ({
  showSessionWarning,
  showLogoutScreen,
  setShowConfirmLogout,
  onContinueSession,
  setIsClosed,
  setShowIcon,
}) => {
  const { t } = useTranslation();
  const {
    candidateId,
    hostname,
    flowId,
    subscriberWorkflowId,
    parentPathname,
  } = useChatMessenger();
  const [loading, setLoading] = useState(false);

  const logoutHandle = useCallback(async () => {
    const refreshChatbot = () => {
      setTimeout(() => {
        localStorage.clear();
        postMessToParent(EventIds.RefreshChatbot);
        localStorage.setItem(hostname + "status", "close"); // to close chatbot in other tabs
        setLoading(false);

        if (parentPathname.includes("job")) {
          // close chatbot and show chatbot icon
          browserStorage.set(hostname + "isClosed", true);
          browserStorage.set(hostname + "show_icon", true);
          setIsClosed(true);
          setShowIcon(true);
        }
      }, 1500);
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
          LOG(payload);
          // TODO: delete after adding a new endpoint for chat terminating !!!
          if (payload) {
            const res: ApiResponse<IFollowingResponse> =
              await apiInstance.sendMessage(payload);

            LOG(res, "LOGOUT response");
            refreshChatbot();
          }
        } catch (error) {
          LOG(error, "logout error");
          refreshChatbot();
        } finally {
          LOG("finally");
          refreshChatbot();
        }
      }
    } else {
      refreshChatbot();
    }
    // -------------------------------------------------------------------------- //
  }, [candidateId, flowId, subscriberWorkflowId, hostname, parentPathname]);

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
                <DarkButton disabled={loading} onClick={logoutHandle}>
                  {t("labels:yes")}
                </DarkButton>
                <DarkButton
                  disabled={loading}
                  onClick={() => setShowConfirmLogout(false)}
                >
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
