import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "../styles";
import { generateLocalId } from "utils/helpers";
import { IMessageOption } from "services/types";
import { CHAT_ACTIONS, ILocalMessage, MessageType } from "utils/types";
import { getValidationRefResponse } from "components/Chat/chatComponents/ChatInput/data";

interface IOptionListProps {
  message: ILocalMessage;
  isLastMess: boolean;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const ReferralQuestion: FC<IOptionListProps> = ({
  message,
  isLastMess,
  setSelectedReferralJobId,
}) => {
  const { _setMessages, setCurrentMsgType, refLastName, employeeJobCategory } =
    useChatMessenger();
  const { t } = useTranslation();

  const onSelectAnswer = useCallback(
    (answer: IMessageOption) => {
      if (isLastMess) {
        switch (answer.id) {
          case 1:
            setSelectedReferralJobId(undefined);
            const mess: ILocalMessage = {
              localId: generateLocalId(),
              _id: generateLocalId(),
              isOwn: true,
              content: {
                subType: MessageType.TEXT,
                text: t("labels:yes"),
              },
            };
            const newRefer = getValidationRefResponse(
              employeeJobCategory,
              refLastName
            );
            _setMessages((prev) => [
              newRefer,
              mess,
              ...prev.map((m) =>
                m._id === message._id ? { ...m, optionList: undefined } : m
              ),
            ]);
            break;
          case 2:
            setSelectedReferralJobId(undefined);
            const answer: ILocalMessage = {
              _id: null,
              localId: generateLocalId(),
              isOwn: false,
              content: {
                subType: MessageType.TEXT,
                text: t("labels:ok"),
              },
            };
            const answer2: ILocalMessage = {
              localId: generateLocalId(),
              _id: generateLocalId(),
              isOwn: true,
              content: {
                subType: MessageType.TEXT,
                text: t("labels:no"),
              },
            };
            _setMessages((prev) => [
              answer,
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
    [isLastMess, employeeJobCategory]
  );

  return (
    <S.List>
      {map(message.optionList?.options, (option) => (
        <S.Option
          key={`${option.id}-${option.text}-${option.name}`}
          onClick={() => onSelectAnswer(option)}
          isActive={isLastMess}
          disabled={!isLastMess}
        >
          <S.OptionText>{option.text}</S.OptionText>
        </S.Option>
      ))}
    </S.List>
  );
};
