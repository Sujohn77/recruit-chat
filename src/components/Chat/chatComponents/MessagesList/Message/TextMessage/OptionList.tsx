import { FC, useCallback } from "react";

import { IMessageOptionItem, IMessageOptions } from "services/types";
import { useChatMessenger } from "contexts/MessengerContext";
import * as S from "./styles";

interface IOptionListProps {
  optionList: IMessageOptions;
  chatItemId?: number;
  isLastMessage?: boolean;
  index?: number;
}

export const OptionList: FC<IOptionListProps> = ({
  optionList,
  chatItemId,
  isLastMessage,
  index,
}) => {
  const { sendPreScreenMessage } = useChatMessenger();

  const onSelectOption = useCallback(async (option: IMessageOptionItem) => {
    if (
      option.text &&
      typeof index === "number" &&
      (index === 0 || index === 1)
    ) {
      try {
        await sendPreScreenMessage(option.text, option.id, chatItemId);
      } catch (error) {
        // TODO: add error handler
      }
    }
  }, []);

  return (
    <S.OptionList>
      {optionList.options.map((option) => (
        <S.Option
          isLast={!!index && index > 1}
          onClick={() => onSelectOption(option)}
          key={option.id}
        >
          <S.Text>{option.text}</S.Text>
        </S.Option>
      ))}
    </S.OptionList>
  );
};
