import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

export const BurgerMenu: React.FC<IBurgerMenuProps> = ({
  setIsShowResults,
}) => {
  const {
    dispatch,
    chatId,
    isAnonym,
    setIsApplyJobFlow,
    isCandidateWithEmail,
  } = useChatMessenger();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeMenu = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.addEventListener("mousedown", closeMenu);
    };
  }, [isOpen]);

  const handleItemClick = async (item: IMenuItem) => {
    const { type, text } = item;

    // cancels sending messages related to Apply Job
    if (type === CHAT_ACTIONS.ASK_QUESTION || type === CHAT_ACTIONS.FIND_JOB) {
      setIsApplyJobFlow(false);
    }

    if (type === CHAT_ACTIONS.SAVE_TRANSCRIPT && !isAnonym && chatId) {
      try {
        const sendTranscriptRes: ApiResponse<ISendTranscriptResponse> =
          await apiInstance.sendTranscript({
            ChatID: chatId,
          });

        LOG(sendTranscriptRes, "Send Transcript Response");
      } catch (error) {
        LOG(error, "ERROR");
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

  const handleBurgerClick = useCallback(() => {
    setIsOpen((prevValue) => !prevValue);
  }, []);

  return (
    <S.Wrapper onClick={handleBurgerClick}>
      <BurgerIcon />

      {isOpen && (
        <S.MenuItemsWrapper ref={menuRef}>
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
