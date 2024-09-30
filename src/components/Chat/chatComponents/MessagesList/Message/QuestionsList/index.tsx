import { FC, useCallback, useEffect, useState } from "react";
import { Height } from "react-animate-height";

import * as S from "./styles";
import { MessageBox } from "../styles";
import { ILocalMessage } from "utils/types";
import { getMessageProps } from "utils/helpers";
import { useChatMessenger } from "contexts/MessengerContext";
import { useAksQuestion, useConnectToLiveChat } from "contexts/hooks";
import { ToggleButton } from "components/Chat/ChatComponents/ToggleButton";

const ANIMATION_ID = "ANIMATION_ID_Q";
const DEF_HEIGHT = 135;

interface IProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const QuestionsList: FC<IProps> = ({ message }) => {
  const { chatId, chatQueueId, QNA } = useChatMessenger();
  const connectToLiveChat = useConnectToLiveChat(chatId, chatQueueId);
  const { askQuestionHandler } = useAksQuestion();

  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<Height>(DEF_HEIGHT);

  useEffect(() => {
    setHeight(isOpen ? "auto" : DEF_HEIGHT);
  }, [isOpen]);

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

  return (
    <MessageBox
      isOwn={false}
      style={{ background: "transparent" }}
      aria-expanded={height !== 0}
      aria-controls={ANIMATION_ID}
      {...getMessageProps(message)}
      maxWidth={310}
      padding="0px"
      isWarningMess
      nextMessFromSameSender
      marginTop={6}
    >
      <S.HeightWrapper id={ANIMATION_ID} duration={500} height={height}>
        <S.ButtonsWrapper>
          {QNA.questions.map((question) => (
            <S.Question
              isOpen={height === "auto"}
              key={question}
              onClick={() => onClick(question)}
            >
              {question}
            </S.Question>
          ))}
        </S.ButtonsWrapper>
      </S.HeightWrapper>

      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </MessageBox>
  );
};
