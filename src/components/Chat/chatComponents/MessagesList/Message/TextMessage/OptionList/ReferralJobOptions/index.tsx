import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "../styles";
import { IMessageOption } from "services/types";
import { generateLocalId } from "utils/helpers";
import {
  ButtonsOptions,
  CHAT_ACTIONS,
  ILocalMessage,
  MessageType,
} from "utils/types";

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
  const { t } = useTranslation();
  const {
    dispatch,
    _setMessages,
    chooseButtonOption,
    searchRequisitions,
    employeeJobCategory,
    employeeLocation,
    clientApiToken,
    employeeId,
    refLastName,
    refBirth,
    refURL,
    employeeLocationID,
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
            withJobs = await searchRequisitions(
              undefined,
              employeeLocation,
              undefined,
              employeeLocationID
            );
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
            chooseButtonOption(
              ButtonsOptions.MAKE_REFERRAL,
              t("referral:general_referral")
            );
            break;

          case 5:
            const inputString = `${clientApiToken}:${employeeId}:${refLastName}:${refBirth}`;
            const base64Encoded = btoa(inputString);
            const myReferralsTab = window.open(
              `https://${refURL}/refer/myreferrals/?rvid=${base64Encoded}&staging=true`,
              "_blank"
            );
            myReferralsTab?.focus();
            break;
          default:
            break;
        }
      }
    },
    [isLastMess, searchRequisitions, refURL, employeeLocationID]
  );

  return (
    <S.ReferralOptionList>
      {map(message.optionList?.options, (o, i) => (
        <S.OptionButton
          onClick={() => onSelectOption(o)}
          isSelected={o.isSelected}
          disabled={!isLastMess}
        >
          {i === 1
            ? t("referral:jobs", { title: employeeJobCategory })
            : o.text}
        </S.OptionButton>
      ))}
    </S.ReferralOptionList>
  );
};
