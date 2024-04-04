import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { IMessageOption } from "services/types";
import { ILocalMessage } from "utils/types";
import * as S from "../styles";

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
  const { sendPreScreenMessage, currentLanguage } = useChatMessenger();
  const { t, i18n } = useTranslation();

  const onSelectOption = useCallback(
    async ({ text, id, i18nPhrase, i18nProps }: IMessageOption) => {
      if (text && isLastMess) {
        setSelectedReferralJobId(undefined);
        try {
          await sendPreScreenMessage(
            text,
            i18nPhrase,
            id,
            message.chatItemId,
            i18nProps
          );
        } catch (error) {
          // TODO: add error handler
        }
      }
    },
    [isLastMess]
  );

  const optionList = useMemo(() => {
    return message.optionList?.options.map((o) => {
      const text = i18n.exists(o.i18nPhrase, o.i18nProps)
        ? t(o.i18nPhrase, o.i18nProps)
        : o.text;

      return (
        <S.MessageOption
          key={o.id}
          isActive={isLastMess}
          disabled={!isLastMess}
          onClick={() => onSelectOption(o)}
        >
          <S.Text>{text}</S.Text>
        </S.MessageOption>
      );
    });
  }, [currentLanguage, isLastMess, onSelectOption]);

  return <S.OptionList>{optionList}</S.OptionList>;
};
