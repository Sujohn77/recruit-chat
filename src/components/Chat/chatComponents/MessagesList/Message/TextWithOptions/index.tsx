import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import map from "lodash/map";

import { IMessageProps } from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";
import { MessageBox, MessageText } from "../styles";
import * as S from "./styles";

interface ITextWithOptionsProps extends IMessageProps {
  text: string;
}

export const TextWithOptions: FC<ITextWithOptionsProps> = ({
  text,
  ...messageProps
}) => {
  const { dispatch, currentMsgType } = useChatMessenger();

  const onClick = useCallback(
    (opt: string) => {
      if (currentMsgType) {
        dispatch({
          type: currentMsgType,
          payload: { item: opt },
        });
      }
    },
    [currentMsgType]
  );

  const options = currentMsgType && getMessageOptions(currentMsgType);

  const optionItems = map(options, (opt, index) => (
    <S.Option
      {...messageProps}
      key={`option-${currentMsgType}=${index}`}
      onClick={() => onClick(opt)}
    >
      {opt}
    </S.Option>
  ));

  return (
    <div>
      <MessageBox {...messageProps}>
        <MessageText>{text}</MessageText>
      </MessageBox>
      {optionItems && currentMsgType && <S.Options>{optionItems}</S.Options>}
    </div>
  );
};

const getMessageOptions = (type: CHAT_ACTIONS) => {
  switch (type) {
    case CHAT_ACTIONS.SET_WORK_PERMIT:
      return ["Yes", "No"];
    default:
      return [];
  }
};
