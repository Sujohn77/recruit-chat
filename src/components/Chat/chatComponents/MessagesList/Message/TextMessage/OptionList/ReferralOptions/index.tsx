import { FC, useCallback } from "react";
import { useChatMessenger } from "contexts/MessengerContext";
import map from "lodash/map";

import * as S from "../styles";
import { generateLocalId } from "utils/helpers";
import { IMessageOption } from "services/types";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";

interface IOptionListProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const ReferralOptions: FC<IOptionListProps> = ({
  message,
  isLastMess,
}) => {
  const { _setMessages, setCurrentMsgType } = useChatMessenger();

  const onSelectOption = useCallback(
    (option: IMessageOption) => {
      if (isLastMess) {
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
                m._id === message._id ? { ...m, optionList: undefined } : m
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
                m._id === message._id ? { ...m, optionList: undefined } : m
              ),
            ]);
            setCurrentMsgType(CHAT_ACTIONS.REFERRAL_IS_SUBMITTED);
            break;
          default:
            break;
        }
      }
    },
    [isLastMess]
  );

  return (
    <S.List>
      {map(message.optionList?.options, (option) => (
        <S.Option
          key={`${option.id}-${option.text}-${option.name}`}
          onClick={() => onSelectOption(option)}
          isActive={isLastMess}
          disabled={!isLastMess}
        >
          <S.OptionText>{option.text}</S.OptionText>
        </S.Option>
      ))}
    </S.List>
  );
};
