import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "../styles";
import { generateLocalId } from "utils/helpers";
import { IMessageOption } from "services/types";
import {
  ButtonsOptions,
  CHAT_ACTIONS,
  ILocalMessage,
  MessageType,
} from "utils/types";
import { getValidationRefResponse } from "components/Chat/ChatComponents/ChatInput/data";

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
  const {
    _setMessages,
    setCurrentMsgType,
    refLastName,
    employeeJobCategory,
    employeeFullName,
    employeeId,
    chooseButtonOption,
    setViewJob,
    hostname,
  } = useChatMessenger();
  const { t } = useTranslation();

  const onSelectAnswer = useCallback(
    (answer: IMessageOption) => {
      if (isLastMess) {
        switch (answer.id) {
          case 1:
            setViewJob(null);
            chooseButtonOption(ButtonsOptions.MAKE_REFERRAL, t("labels:yes"));
            _setMessages((prev) => [
              ...prev.map((m) =>
                m._id === message._id ? { ...m, optionList: undefined } : m
              ),
            ]);
            localStorage.removeItem(hostname + "viewJob");
            break;
          case 2:
            setSelectedReferralJobId(undefined);
            const newReferWithRefHistory = getValidationRefResponse(
              employeeJobCategory,
              employeeFullName || refLastName,
              false,
              true
            );
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
              newReferWithRefHistory,
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
    [isLastMess, employeeJobCategory, employeeFullName, employeeId]
  );

  return (
    <>
      {message.optionList?.text && (
        <S.MessageText>{message.optionList?.text}</S.MessageText>
      )}

      <S.List>
        {map(message?.optionList?.options, (option) => (
          <S.Option
            key={`${option.id}-${option.text}-${option.name}`}
            onClick={() => onSelectAnswer(option)}
            isActive={isLastMess}
            disabled={!isLastMess}
            height="35px"
          >
            <S.OptionText>{option.text}</S.OptionText>
          </S.Option>
        ))}
      </S.List>
    </>
  );
};
