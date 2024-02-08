import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback } from "react";
import map from "lodash/map";

import * as S from "../styles";
import { DarkButton } from "components/Layout/styles";
import { IMessageOption } from "services/types";
import { ButtonsOptions, CHAT_ACTIONS, ILocalMessage } from "utils/types";

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
  const { _setMessages, dispatch, chooseButtonOption } = useChatMessenger();

  const onSelectOption = useCallback(
    (option: IMessageOption) => {
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

        switch (option.id) {
          case 1:
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
    [isLastMess]
  );

  return (
    <S.ReferralOptionList>
      {map(message.optionList?.options, (option) => (
        <DarkButton
          onClick={() => onSelectOption(option)}
          isSelected={option.isSelected}
          disabled={!isLastMess}
          fontWeight={500}
          width="100%"
          marginBottom="8px"
          height="35px"
        >
          {option.text}
        </DarkButton>
      ))}
    </S.ReferralOptionList>
  );
};
