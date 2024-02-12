import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback } from "react";
import map from "lodash/map";

import * as S from "../styles";
import { DarkButton } from "components/Layout/styles";
import { IMessageOption } from "services/types";
import {
  ButtonsOptions,
  CHAT_ACTIONS,
  ILocalMessage,
  MessageType,
} from "utils/types";
import { generateLocalId } from "utils/helpers";

interface IReferralJobOptionsProps {
  message: ILocalMessage;
  isLastMess: boolean;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const ReferralJobOptions: FC<IReferralJobOptionsProps> = ({
  message,
  isLastMess,
  setSelectedReferralJobId,
}) => {
  const {
    dispatch,
    _setMessages,
    chooseButtonOption,
    searchRequisitions,
    employeeJobCategory,
    employeeLocation,
  } = useChatMessenger();

  const onSelectOption = useCallback(
    async (option: IMessageOption) => {
      if (isLastMess) {
        _setMessages((prev) =>
          map(prev, (m) =>
            m._id === message._id
              ? {
                  ...m,
                  optionList: {
                    isActive: false,
                    type: m.optionList?.type,
                    options:
                      map(m.optionList?.options, (o) =>
                        o.id === option.id ? { ...o, isSelected: true } : o
                      ) || [],
                  },
                }
              : m
          )
        );

        let withJobs = null;
        switch (option.id) {
          case 1:
            withJobs = await searchRequisitions(undefined, employeeLocation);
            if (withJobs) {
              const messWithJobs: ILocalMessage = {
                _id: null,
                localId: generateLocalId(),
                content: { subType: MessageType.JOB_POSITIONS },
                isOwn: false,
              };
              _setMessages((prev) => [messWithJobs, ...prev]);
            }
            break;
          case 2:
            searchRequisitions(employeeJobCategory, undefined);

            withJobs = await searchRequisitions(employeeJobCategory, undefined);
            if (withJobs) {
              const messWithJobs: ILocalMessage = {
                _id: null,
                localId: generateLocalId(),
                content: { subType: MessageType.JOB_POSITIONS },
                isOwn: false,
              };
              _setMessages((prev) => [messWithJobs, ...prev]);
            }
            break;
          case 3:
            dispatch({ type: CHAT_ACTIONS.REFINE_SEARCH });
            break;
          case 4:
            setSelectedReferralJobId(undefined);
            chooseButtonOption(ButtonsOptions.MAKE_REFERRAL);
            break;
          default:
            break;
        }
      }
    },
    [isLastMess, searchRequisitions]
  );

  return (
    <S.ReferralOptionList>
      {map(message.optionList?.options, (option, index) => (
        <DarkButton
          onClick={() => onSelectOption(option)}
          isSelected={option.isSelected}
          disabled={!isLastMess}
          fontWeight={500}
          width="100%"
          marginBottom="8px"
          height="35px"
        >
          {index === 1 ? employeeJobCategory + " jobs" : option.text}
        </DarkButton>
      ))}
    </S.ReferralOptionList>
  );
};
