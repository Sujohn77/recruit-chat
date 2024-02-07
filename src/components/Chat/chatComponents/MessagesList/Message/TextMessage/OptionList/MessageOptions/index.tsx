import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";

import { IMessageOption } from "services/types";
import { ILocalMessage } from "utils/types";
import * as S from "../styles";

interface IOptionListProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const MessageOptions: FC<IOptionListProps> = ({
  message,
  isLastMess,
}) => {
  const { sendPreScreenMessage } = useChatMessenger();

  const onSelectOption = useCallback(
    async ({ text, id }: IMessageOption) => {
      if (text && isLastMess) {
        try {
          await sendPreScreenMessage(text, id, message.chatItemId);
        } catch (error) {
          // TODO: add error handler
        }
      }
    },
    [isLastMess]
  );

  return (
    <S.OptionList>
      {message.optionList?.options.map((option) => (
        <S.Option
          key={option.id}
          isActive={isLastMess}
          disabled={!isLastMess}
          onClick={() => onSelectOption(option)}
        >
          <S.Text>{option.text}</S.Text>
        </S.Option>
      ))}
    </S.OptionList>
  );
};
