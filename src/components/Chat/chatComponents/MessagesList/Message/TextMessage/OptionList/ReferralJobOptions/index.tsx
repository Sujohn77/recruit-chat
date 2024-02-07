import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import map from "lodash/map";

import * as S from "../styles";
import { IMessageOptionItem } from "services/types";
import { generateLocalId } from "utils/helpers";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";
import { DarkButton } from "components/Layout/styles";

interface IReferralJobOptionsProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const ReferralJobOptions: FC<IReferralJobOptionsProps> = ({
  message,
  isLastMess,
}) => {
  const { _setMessages, setCurrentMsgType, dispatch } = useChatMessenger();

  const onSelectOption = useCallback((option: IMessageOptionItem) => {
    if (isLastMess) {
      switch (option.id) {
        case 1:
          const answer1: ILocalMessage = {
            localId: generateLocalId(),
            _id: generateLocalId(),
            isOwn: true,
            content: {
              subType: MessageType.TEXT,
              text: option.text,
            },
          };
          _setMessages((prev) => [
            answer1,
            ...prev.map((m) =>
              m._id === message._id ? { ...m, optionList: undefined } : m
            ),
          ]);
          dispatch({ type: CHAT_ACTIONS.REFINE_SEARCH });
          break;
        case 2:
          const mess: ILocalMessage = {
            _id: null,
            localId: generateLocalId(),
            isOwn: false,
            content: {
              subType: MessageType.TEXT,
              text: "ok, thank you",
            },
          };
          const answer2: ILocalMessage = {
            localId: generateLocalId(),
            _id: generateLocalId(),
            isOwn: true,
            content: {
              subType: MessageType.TEXT,
              text: option.text,
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
  }, []);

  return (
    <S.List>
      {map(message.optionList?.options, (option) => (
        <DarkButton
          onClick={() => onSelectOption(option)}
          disabled={!isLastMess}
          fontWeight={500}
        >
          {option.text}
        </DarkButton>
        // <S.Option
        //   key={`${option.id}-${option.text}-${option.name}`}
        //   onClick={() => onSelectOption(option)}
        //   isActive={isActive}
        //   disabled={!isActive}
        // >
        //   <S.OptionText>{option.text}</S.OptionText>
        // </S.Option>
      ))}
    </S.List>
  );
};
