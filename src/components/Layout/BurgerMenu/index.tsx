import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useState } from "react";
import { ApiResponse } from "apisauce";
import map from "lodash/map";

import * as S from "./styles";
import { IBurgerMenuProps } from "./props";
import { menuForCandidateWithEmail, menuItems } from "./data";
import { MenuItem } from "./MenuItem";
import { BurgerIcon } from "./BurgerIcon";
import { LOG } from "utils/helpers";
import { apiInstance } from "services/api";
import { CHAT_ACTIONS, IMenuItem } from "utils/types";
import { ISendTranscriptResponse } from "services/types";
import { COLORS } from "utils/colors";

export const BurgerMenu: React.FC<IBurgerMenuProps> = ({
  setIsShowResults,
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
  } = useChatMessenger();

  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = async (item: IMenuItem) => {
    const { type, text } = item;

    // cancels sending messages related to Apply Job
    if (type === CHAT_ACTIONS.ASK_QUESTION || type === CHAT_ACTIONS.FIND_JOB) {
      setIsApplyJobFlow(false);
      setViewJob(null);
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

        LOG(sendTranscriptRes, "___Send Transcript Response", COLORS.WHITE);
      } catch (error) {
        LOG(error, "____Send Transcript Response ERROR");
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
          {map(
            isCandidateWithEmail ? menuForCandidateWithEmail : menuItems,
            (item, index) => (
              <MenuItem
                key={`menu-item-${index}`}
                item={item}
                onClick={handleItemClick}
              />
            )
          )}
        </S.MenuItemsWrapper>
      )}
    </S.Wrapper>
  );
};

export default BurgerMenu;
