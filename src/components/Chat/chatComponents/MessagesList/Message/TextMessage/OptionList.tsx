import { FC, useCallback } from "react";

import { IMessageOptionItem, IMessageOptions } from "services/types";
import { useChatMessenger } from "contexts/MessengerContext";
import * as S from "./styles";

interface IOptionListProps {
  optionList: IMessageOptions;
}

export const OptionList: FC<IOptionListProps> = ({ optionList }) => {
  const { sendPreScreenMessage } = useChatMessenger();

  const onSelectOption = useCallback(async (option: IMessageOptionItem) => {
    if (option.text) {
      try {
        await sendPreScreenMessage(option.text);
      } catch (error) {
        // TODO: add error handler
      }
    }
  }, []);

  return (
    <S.OptionList>
      {optionList.options.map((option) => (
        <S.Option onClick={() => onSelectOption(option)} key={option.id}>
          <S.Text>{option.text}</S.Text>
        </S.Option>
      ))}
    </S.OptionList>
  );
};
