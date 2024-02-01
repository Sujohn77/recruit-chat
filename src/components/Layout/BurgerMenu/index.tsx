import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useCallback, useMemo, useState } from "react";
import { ApiResponse } from "apisauce";
import map from "lodash/map";

import * as S from "./styles";
import { IBurgerMenuProps } from "./props";
import { menuForCandidateWithEmail, menuItems } from "./data";
import { MenuItem } from "./MenuItem";
import { BurgerIcon } from "./BurgerIcon";
import { apiInstance } from "services/api";
import { CHAT_ACTIONS, IMenuItem } from "utils/types";
import { ISendTranscriptResponse } from "services/types";
import { useTranslation } from "react-i18next";

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
  } = useChatMessenger();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const list = useMemo(() => {
    let defaultItems = isCandidateWithEmail
      ? menuForCandidateWithEmail
      : menuItems;

    if (isReferralEnabled && employeeId) {
      // if employeeId exist then refBirth and refLastName also exist
      return [
        ...defaultItems,
        {
          type: CHAT_ACTIONS.SEE_MY_REFERRALS,
          text: t("chat_menu:see_my_referrals"),
        },
      ];
    }
    return defaultItems;
  }, [isReferralEnabled, isCandidateWithEmail, employeeId]);

  const handleItemClick = async (item: IMenuItem) => {
    const { type, text } = item;

    // cancels sending messages related to Apply Job
    if (type === CHAT_ACTIONS.ASK_QUESTION || type === CHAT_ACTIONS.FIND_JOB) {
      setIsApplyJobFlow(false);
      setViewJob(null);
    }

    if (type === CHAT_ACTIONS.SEE_MY_REFERRALS) {
      const inputString = `ClientAPIKey:${employeeId}:${refLastName}:${refBirth}`;
      const base64Encoded = btoa(inputString);
      const myReferralsTab = window.open(
        `https://client-site/refer/myreferrals/?rvid=${base64Encoded}`,
        "_blank"
      );
      myReferralsTab?.focus();
      return;
    }

    if (type === CHAT_ACTIONS.SAVE_TRANSCRIPT && chatId) {
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
    } else {
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
