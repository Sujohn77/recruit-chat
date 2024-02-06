import { FC, useCallback, useMemo } from "react";
import { useChatMessenger } from "contexts/MessengerContext";
import map from "lodash/map";

import * as S from "./styles";
import { IMessageOptionItem, IMessageOptions } from "services/types";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";
import { generateLocalId } from "utils/helpers";

interface IOptionListProps {
  optionList: IMessageOptions;
  chatItemId?: number;
  messageId: string | number | null;
  message: ILocalMessage;
}

export const ReferralOptionList: FC<IOptionListProps> = ({
  optionList,
  chatItemId,
  messageId,
  message,
}) => {
  const { _setMessages, setCurrentMsgType, messages } = useChatMessenger();

  const isActive = useMemo(() => {
    const currentMessageIndex = messages.findIndex(
      (mess) => mess._id === messageId
    );

    return currentMessageIndex === 0;
  }, [messages, messageId]);

  const onSelectOption = useCallback((option: IMessageOptionItem) => {
    if (isActive) {
      switch (option.text?.toLowerCase()) {
        case "yes":
          const answer1: ILocalMessage = {
            localId: generateLocalId(),
            _id: generateLocalId(),
            isOwn: true,
            content: {
              subType: MessageType.TEXT,
              text: "Yes", // TODO: add translation
            },
          };
          setCurrentMsgType(CHAT_ACTIONS.MAKE_REFERRAL_FRIEND);
          _setMessages((prev) => [
            answer1,
            ...prev.map((m) =>
              m._id === messageId ? { ...m, optionList: undefined } : m
            ),
          ]);
          break;
        case "no":
          const mess: ILocalMessage = {
            _id: null,
            localId: generateLocalId(),
            isOwn: false,
            content: {
              subType: MessageType.TEXT,
              text: "ok, thank you", // TODO: add translation
            },
          };
          const answer2: ILocalMessage = {
            localId: generateLocalId(),
            _id: generateLocalId(),
            isOwn: true,
            content: {
              subType: MessageType.TEXT,
              text: "No", // TODO: add translation
            },
          };
          _setMessages((prev) => [
            mess,
            answer2,
            ...prev.map((m) =>
              m._id === messageId ? { ...m, optionList: undefined } : m
            ),
          ]);
          setCurrentMsgType(CHAT_ACTIONS.REFERRAL_IS_SUBMITTED);
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <S.List>
      {map(optionList.options, (option) => (
        <S.Option
          key={`${option.id}-${option.text}-${option.name}`}
          onClick={() => onSelectOption(option)}
          isActive={isActive}
          disabled={!isActive}
        >
          <S.OptionText>{option.text}</S.OptionText>
        </S.Option>
      ))}
    </S.List>
  );
};
