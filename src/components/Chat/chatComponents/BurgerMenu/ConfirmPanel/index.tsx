import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { SlideUpPanel } from "components/Layout";
import { CHAT_ACTIONS, NextMsgType } from "utils/types";

interface IConfirmPanelProps {
  showPopUp: boolean;
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  nxtMsgType: NextMsgType | null;
  setNxtMsgType: React.Dispatch<React.SetStateAction<NextMsgType | null>>;
}

export const ConfirmPanel: FC<IConfirmPanelProps> = ({
  showPopUp,
  setShowPopUp,
  nxtMsgType,
  setNxtMsgType,
}) => {
  const { t } = useTranslation();
  const { dispatch, setIsApplyJobFlow, setIsApplyJobSuccessfully } =
    useChatMessenger();

  const onYes = useCallback(() => {
    setIsApplyJobFlow(false);
    setIsApplyJobSuccessfully(false);
    setShowPopUp(false);
    setNxtMsgType(null);

    if (nxtMsgType) {
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
  }, [nxtMsgType]);

  const onNo = useCallback(() => {
    setShowPopUp(false);
    setNxtMsgType(null);
  }, []);

  return (
    <SlideUpPanel isOpen={showPopUp} setIsOpen={setShowPopUp}>
      <S.Wrapper>
        <S.TextWrapper>
          <S.Text>Do you want to terminate the current process ?</S.Text>
        </S.TextWrapper>

        <S.ButtonsWrapper>
          <S.Button onClick={onYes}>Yes</S.Button>
          <S.Button onClick={onNo}>No</S.Button>
        </S.ButtonsWrapper>
      </S.Wrapper>
    </SlideUpPanel>
  );
};
