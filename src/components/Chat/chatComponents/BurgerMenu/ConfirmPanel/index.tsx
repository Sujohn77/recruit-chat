import { useChatMessenger } from "contexts/MessengerContext";
import { CSSProperties, FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { apiInstance } from "services/api";
import { SlideUpPanel } from "components/Layout";
import { CHAT_ACTIONS, NextMsgType } from "utils/types";
import { createSendMessPayload, generateLocalId } from "utils/helpers";

interface IConfirmPanelProps {
  showPopUp: boolean;
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  nxtMsgType: NextMsgType | null;
  setNxtMsgType: React.Dispatch<React.SetStateAction<NextMsgType | null>>;
  contentStyle?: CSSProperties;
}

export const ConfirmPanel: FC<IConfirmPanelProps> = ({
  showPopUp,
  setShowPopUp,
  nxtMsgType,
  setNxtMsgType,
  contentStyle,
}) => {
  const { t } = useTranslation();
  const {
    dispatch,
    setIsApplyJobFlow,
    setIsApplyJobSuccessfully,
    flowId,
    candidateId,
    subscriberWorkflowId,
    setIsLiveChat,
    setFlowId,
    setSubscriberWorkflowId,
  } = useChatMessenger();

  const [isLoading, setIsLoading] = useState(false);

  const onYes = useCallback(async () => {
    if (!isLoading) {
      setIsApplyJobFlow(false);
      setIsApplyJobSuccessfully(false);
      setNxtMsgType(null);
      setIsLiveChat(false);
      setFlowId(undefined);
      setSubscriberWorkflowId(undefined);

      // TODO: delete after adding a new endpoint for chat terminating !!!
      if (candidateId && flowId && subscriberWorkflowId) {
        try {
          setIsLoading(true);
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
            await apiInstance.sendMessage(payload);
          }
        } catch (error) {
        } finally {
          setShowPopUp(false);
          setIsLoading(false);
        }
      }
      // -------------------------------------------------------------------------- //

      if (nxtMsgType) {
        setShowPopUp(false);
        const text =
          nxtMsgType === CHAT_ACTIONS.ASK_QUESTION
            ? t("chat_menu:ask_question")
            : nxtMsgType === CHAT_ACTIONS.FIND_JOB
            ? t("chat_menu:find_job")
            : t("buttons:make_referral");

        dispatch({
          type: nxtMsgType,
          payload: { item: text, isChatMessage: true },
          i18nProps: null,
        });
      }
    }
  }, [nxtMsgType, isLoading, flowId, subscriberWorkflowId, candidateId]);

  const onNo = useCallback(() => {
    if (!isLoading) {
      setShowPopUp(false);
      setNxtMsgType(null);
    }
  }, [isLoading]);

  return (
    <SlideUpPanel
      isOpen={showPopUp}
      setIsOpen={setShowPopUp}
      contentStyle={contentStyle}
    >
      <S.Wrapper>
        <S.TextWrapper>
          <S.Text>{t("labels:terminate_process")}</S.Text>
        </S.TextWrapper>

        <S.ButtonsWrapper>
          <S.Button disabled={isLoading} onClick={onYes}>
            {t("labels:yes")}
          </S.Button>
          <S.Button disabled={isLoading} onClick={onNo}>
            {t("labels:cancel")}
          </S.Button>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </SlideUpPanel>
  );
};
