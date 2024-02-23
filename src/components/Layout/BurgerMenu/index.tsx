import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback, useMemo, useState } from "react";
import { ApiResponse } from "apisauce";
import map from "lodash/map";

import { CHAT_ACTIONS, IMenuItem } from "utils/types";
import { ISendTranscriptResponse } from "services/types";
import * as S from "./styles";
import { MenuItem } from "./MenuItem";
import { BurgerIcon } from "./BurgerIcon";
import { apiInstance } from "services/api";
import {
  baseWithRfItems,
  baseWithRef,
  menuForCandidateWithEmail,
  menuItems,
} from "./data";

interface IBurgerMenuProps {
  setIsShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BurgerMenu: FC<IBurgerMenuProps> = ({ setIsShowResults }) => {
  const {
    dispatch,
    chatId,
    setIsApplyJobFlow,
    isCandidateWithEmail,
    emailAddress,
    firstName,
    lastName,
    setViewJob,
    isReferralEnabled,
    employeeId,
    refLastName,
    refBirth,
    refURL,
    clientApiToken,
  } = useChatMessenger();
  const [isOpen, setIsOpen] = useState(false);

  const list = useMemo(() => {
    let defaultItems = isCandidateWithEmail
      ? menuForCandidateWithEmail
      : menuItems;
    if (isReferralEnabled && !!employeeId) {
      return baseWithRef;
    }
    if (isReferralEnabled) {
      return baseWithRfItems;
    }
    return defaultItems;
  }, [isReferralEnabled, isCandidateWithEmail, employeeId]);

  const handleItemClick = async (item: IMenuItem) => {
    const { type, text } = item;

    if (type === CHAT_ACTIONS.ASK_QUESTION || type === CHAT_ACTIONS.FIND_JOB) {
      setIsApplyJobFlow(false);
      setViewJob(null);
      sessionStorage.removeItem("viewJob");
    }

    switch (type) {
      case CHAT_ACTIONS.SEE_MY_REFERRALS:
        const inputString = `${clientApiToken}:${employeeId}:${refLastName}:${refBirth}`;
        const base64Encoded = btoa(inputString);
        const myReferralsTab = window.open(
          `https://${refURL}/refer/myreferrals/?rvid=${base64Encoded}&staging=true`,
          "_blank"
        );
        myReferralsTab?.focus();
        break;
      case CHAT_ACTIONS.SAVE_TRANSCRIPT:
        if (chatId) {
          try {
            if (emailAddress) {
              dispatch({
                type: CHAT_ACTIONS.UPDATE_OR_MERGE_CANDIDATE,
                payload: {
                  candidateData: {
                    emailAddress,
                    firstName,
                    lastName,
                  },
                },
              });
            }

            const sendTranscriptRes: ApiResponse<ISendTranscriptResponse> =
              await apiInstance.sendTranscript({
                ChatID: chatId,
              });
            console.log("Send Transcript Response", sendTranscriptRes);
          } catch (error) {
            console.log("Send Transcript ERROR", error);
          }
        }
        break;
      default:
        dispatch({
          type,
          payload: { item: text, isChatMessage: true },
        });
        setIsOpen(true);
        setIsShowResults(false);
    }
  };

  const handleBurgerClick = useCallback(
    () => setIsOpen((prevState) => !prevState),
    []
  );

  return (
    <S.Wrapper onClick={handleBurgerClick}>
      <BurgerIcon />

      {isOpen && (
        <S.MenuItemsWrapper onMouseLeave={() => setIsOpen(false)}>
          {map(list, (item, index) => (
            <MenuItem
              key={`menu-item-${index}`}
              item={item}
              onClick={handleItemClick}
            />
          ))}
        </S.MenuItemsWrapper>
      )}
    </S.Wrapper>
  );
};

export default BurgerMenu;
