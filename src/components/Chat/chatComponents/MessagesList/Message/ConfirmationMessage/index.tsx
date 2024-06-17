import { FC, useCallback, useState } from "react";

import * as S from "./style";
import { MessageBox } from "../styles";
import { CHAT_ACTIONS, ILocalMessage } from "utils/types";
import { useChatMessenger } from "contexts/MessengerContext";
import { useTranslation } from "react-i18next";
import { createTextMess, getMessageProps } from "utils/helpers";

interface IConfirmationMessageProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const ConfirmationMessage: FC<IConfirmationMessageProps> = ({
  message,
}) => {
  const { t } = useTranslation();
  const {
    dispatch,
    setMessages,
    sendNewMessage,
    setIsApplyJobFlow,
    setIsApplyJobSuccessfully,
  } = useChatMessenger();

  const [isSelected, setIsSelected] = useState(false);

  const messageProps = { ...getMessageProps(message) };

  const onConfirm = useCallback(() => {
    const userMess = createTextMess({ text: "Yes", isOwn: true });
    setMessages((prev) => [userMess, ...prev]);

    sendNewMessage({ isOwn: false, message: message.content.text });
    sendNewMessage({ isOwn: true, message: "Yes" });

    setIsSelected(true);
    setIsApplyJobFlow(false);
    setIsApplyJobSuccessfully(false);

    const nextType = message.content.nextMsgType;
    if (nextType) {
      const text =
        nextType === CHAT_ACTIONS.ASK_QUESTION
          ? t("chat_menu:ask_question")
          : nextType === CHAT_ACTIONS.FIND_JOB
          ? t("chat_menu:find_job")
          : t("buttons:make_referral");

      dispatch({
        type: nextType,
        payload: { item: text, isChatMessage: true },
        i18nProps: null,
      });
    }
  }, []);

  const onCancelling = useCallback(
    () => setMessages((prev) => prev.filter((msg) => msg._id !== message._id)),
    []
  );

  return (
    <S.MessWrapper>
      <MessageBox {...messageProps}>
        {"Do you want to terminate the current process ?"}

        {!isSelected && (
          <S.BtnWrapper>
            <S.Button onClick={onConfirm}>Yes</S.Button>
            <S.Button onClick={onCancelling}>No</S.Button>
          </S.BtnWrapper>
        )}
      </MessageBox>
    </S.MessWrapper>
  );
};
