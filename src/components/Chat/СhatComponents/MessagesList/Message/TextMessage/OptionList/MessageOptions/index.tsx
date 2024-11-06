import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { IMessageOption } from "services/types";
import { ILocalMessage } from "utils/types";
import * as S from "../styles";
import { generateLocalId } from "utils/helpers";

type SelectedOptions = {
  selectedOptionText?: string;
  isSelected: boolean;
};

interface IOptionListProps {
  message: ILocalMessage;
  isLastMess: boolean;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const MessageOptions: FC<IOptionListProps> = ({
  message,
  isLastMess,
  setSelectedReferralJobId,
}) => {
  const { t, i18n } = useTranslation();
  const { sendNewMessage, currentLanguage } = useChatMessenger();
  const selectedOptionRef = useRef<SelectedOptions>({ isSelected: false });

  const onSelectOption = useCallback(
    async ({ text, id }: IMessageOption) => {
      if (text && isLastMess && !selectedOptionRef.current.isSelected) {
        setSelectedReferralJobId(undefined);
        try {
          await sendNewMessage({
            message: text,
            optionId: id,
            chatItemId: message.chatItemId,
            isOwn: true,
            localId: generateLocalId(),
          });
        } catch (error) {
        } finally {
          selectedOptionRef.current = {
            isSelected: true,
            selectedOptionText: text,
          };
        }
      }
    },
    [isLastMess]
  );

  const optionList = useMemo(() => {
    return message.optionList?.options.map((o) => {
      const text =
        !!o?.i18nPhrase && i18n.exists(o?.i18nPhrase, o.i18nProps)
          ? t(o.i18nPhrase, o.i18nProps)
          : o.text;

      return (
        <S.MessageOption
          key={o.id}
          isActive={!selectedOptionRef.current.isSelected}
          disabled={selectedOptionRef.current.isSelected}
          onClick={() => onSelectOption(o)}
          isSelected={selectedOptionRef.current.selectedOptionText === text}
        >
          <S.Text>{text}</S.Text>
        </S.MessageOption>
      );
    });
  }, [currentLanguage, isLastMess, onSelectOption]);

  return <S.OptionList>{optionList}</S.OptionList>;
};
