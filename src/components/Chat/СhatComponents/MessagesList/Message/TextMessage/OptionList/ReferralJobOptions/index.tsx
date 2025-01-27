import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "../styles";
import { IMessageOption } from "services/types";
import { createTextMess } from "utils/helpers";
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
    setMessages,
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
    employeeJobFamilyNames,
    sendNewMessage,
  } = useChatMessenger();

  const onSelectOption = useCallback(
    async (option: IMessageOption) => {
      if (isLastMess) {
        setMessages((prev) =>
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
              const messWithJobs = createTextMess({
                text: "",
                subType: MessageType.JOB_POSITIONS,
              });

              sendNewMessage({
                isOwn: false,
                message: messWithJobs.content.text,
                localId: messWithJobs.localId,
              });
              setMessages((prev) => [messWithJobs, ...prev]);
            }
            break;
          case 2:
            withJobs = await searchRequisitions(
              undefined,
              undefined,
              undefined,
              undefined,
              employeeJobFamilyNames
            );
            if (withJobs) {
              const messWithJobs = createTextMess({
                text: "",
                subType: MessageType.JOB_POSITIONS,
              });

              sendNewMessage({
                isOwn: false,
                message: messWithJobs.content.text,
                localId: messWithJobs.localId,
              });
              setMessages((prev) => [messWithJobs, ...prev]);
            }
            break;
          case 3:
            dispatch({ type: CHAT_ACTIONS.REFINE_SEARCH, i18nProps: null });
            break;
          case 4:
            setSelectedReferralJobId(undefined);
            const userMess = createTextMess({
              isOwn: true,
              text: t("referral:general_referral"),
            });
            sendNewMessage({
              message: userMess.content.text,
              isOwn: true,
              localId: userMess.localId,
            });
            chooseButtonOption(
              ButtonsOptions.MAKE_REFERRAL,
              t("referral:general_referral"),
              "referral:general_referral"
            );
            break;

          case 5:
            const inputString = `${clientApiToken}:${employeeId}:${refLastName}:${refBirth}`;
            const base64Encoded = btoa(inputString);
            const myReferralsTab = window.open(
              `https://${refURL}/refer/myreferrals/?rvid=${base64Encoded}`,
              "_blank"
            );
            // const myReferralsTab = window.open(
            //   `https://${refURL}/refer/myreferrals/?rvid=${base64Encoded}&staging=true`,
            //   "_blank"
            // );
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
    <S.OptionListWrapper>
      {map(message.optionList?.options, (o, i) => (
        <S.OptionButton
          onClick={() => onSelectOption(o)}
          isSelected={o.isSelected}
          disabled={!isLastMess}
        >
          {i === 1 ? employeeJobCategory + " jobs" : o.text}
        </S.OptionButton>
      ))}
    </S.OptionListWrapper>
  );
};
