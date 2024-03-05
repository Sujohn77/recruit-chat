import { useChatMessenger } from "contexts/MessengerContext";
import React, { FC, useCallback, useMemo, useState } from "react";
import { ApiResponse } from "apisauce";
import map from "lodash/map";

import * as S from "./styles";
import { MenuItem } from "./MenuItem";
import { BurgerIcon } from "./BurgerIcon";
import {
  baseWithRefItems,
  baseWithRef,
  menuForCandidateWithEmail,
  menuItems,
} from "./data";
import { getValidationRefResponse } from "components/Chat/ChatComponents/ChatInput/data";
import { ISendTranscriptResponse } from "services/types";
import { apiInstance } from "services/api";
import { generateLocalId } from "utils/helpers";
import {
  CHAT_ACTIONS,
  ILocalMessage,
  IMenuItem,
  MessageType,
} from "utils/types";

interface IBurgerMenuProps {
  setIsShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  cleanInputValue: () => void;
}

export const BurgerMenu: FC<IBurgerMenuProps> = ({
  setIsShowResults,
  setSelectedReferralJobId,
  cleanInputValue,
}) => {
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
    _setMessages,
    employeeJobCategory,
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
      return baseWithRefItems;
    }
    return defaultItems;
  }, [isReferralEnabled, isCandidateWithEmail, employeeId]);

  const handleItemClick = async (item: IMenuItem) => {
    const { type, text } = item;

    if (type === CHAT_ACTIONS.ASK_QUESTION || type === CHAT_ACTIONS.FIND_JOB) {
      setIsApplyJobFlow(false);
      setViewJob(null);
      sessionStorage.removeItem("viewJob");
      cleanInputValue();
    }

    if (
      type === CHAT_ACTIONS.ASK_QUESTION ||
      type === CHAT_ACTIONS.MAKE_REFERRAL
    ) {
      setSelectedReferralJobId(undefined);
      setViewJob(null);
      cleanInputValue();
    }

    if (type === CHAT_ACTIONS.MAKE_REFERRAL && employeeId) {
      const resMess = getValidationRefResponse(
        employeeJobCategory,
        refLastName,
        false
      );
      const makeRefMess: ILocalMessage = {
        _id: generateLocalId(),
        localId: generateLocalId(),
        content: {
          subType: MessageType.TEXT,
          text,
        },
        isOwn: true,
      };

      _setMessages((prevMessages) => [resMess, makeRefMess, ...prevMessages]);
      return;
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
        cleanInputValue();
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

      case CHAT_ACTIONS.CHANGE_LANG:
        // this feature is temporarily hidden (language change - CHAT-265)
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
