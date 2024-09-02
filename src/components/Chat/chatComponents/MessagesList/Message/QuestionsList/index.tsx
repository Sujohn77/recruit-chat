import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Height } from "react-animate-height";

import * as S from "./styles";
import { MessageBox } from "../styles";
import { ILocalMessage } from "utils/types";
import { getQuestions } from "contexts/data";
import { useChatMessenger } from "contexts/MessengerContext";
import { useAksQuestion, useConnectToLiveChat } from "contexts/hooks";
import { ToggleButton } from "components/Chat/ChatComponents/ToggleButton";
import { getIsNextMsgFromSameSender, getMessageProps } from "utils/helpers";

const ANIMATION_ID = "ANIMATION_ID_Q";
const DEF_HEIGHT = 135;

interface IProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const QuestionsList: FC<IProps> = ({ isLastMess, message }) => {
  const { isReferralEnabled, companyName, messages, chatId, chatQueueId } =
    useChatMessenger();
  const connectToLiveChat = useConnectToLiveChat(chatId, chatQueueId);
  const { askQuestionHandler } = useAksQuestion();

  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<Height>(DEF_HEIGHT);

  const questions = useMemo(
    () => getQuestions(isReferralEnabled, companyName),
    [isReferralEnabled, companyName]
  );
  const messageProps = getMessageProps(message);
  const isNextMessFromSameSender = getIsNextMsgFromSameSender({
    isLastMess,
    currentMess: message,
    messages: messages,
  });

  const onClick = useCallback(
    (question: string) => {
      if (question === "can i speak to someone?") {
        connectToLiveChat();
      } else {
        askQuestionHandler({ question });
      }
    },
    [connectToLiveChat, askQuestionHandler]
  );

  useEffect(() => {
    setHeight(isOpen ? "auto" : DEF_HEIGHT);
  }, [isOpen]);

  return (
    <MessageBox
      isOwn={false}
      style={{ background: "transparent" }}
      aria-expanded={height !== 0}
      aria-controls={ANIMATION_ID}
      {...messageProps}
      maxWidth={310}
      padding="0px"
      isWarningMess
      nextMessFromSameSender
      marginTop={6}
    >
      <S.HeightWrapper id={ANIMATION_ID} duration={500} height={height}>
        <S.ButtonsWrapper>
          {questions.map((q) => (
            <S.Question
              isOpen={height === "auto"}
              key={q.text}
              onClick={() => onClick(q.text)}
            >
              {q.text}
            </S.Question>
          ))}
        </S.ButtonsWrapper>
      </S.HeightWrapper>

      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </MessageBox>
  );
};
