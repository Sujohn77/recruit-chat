import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import map from "lodash/map";

import * as S from "./styles";
import { IBurgerMenuProps } from "./props";
import { menuItems } from "./data";
import { MenuItem } from "./MenuItem";
import { BurgerIcon } from "./BurgerIcon";
import { CHAT_ACTIONS, IMenuItem } from "utils/types";
import { ApiResponse } from "apisauce";
import { ISendTranscriptResponse } from "services/types";
import { LOG } from "utils/helpers";
import { apiInstance } from "services/api";
import { ChatStatuses, useAppStore } from "store/app.store";

export const BurgerMenu: React.FC<IBurgerMenuProps> = ({
  setIsShowResults,
}) => {
  const { dispatch, chatId, isAnonym } = useChatMessenger();
  const { setChatStatus } = useAppStore();
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
    if (item.type === CHAT_ACTIONS.SAVE_TRANSCRIPT && !isAnonym && chatId) {
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
      if (item.type !== CHAT_ACTIONS.CHANGE_LANG) {
        setChatStatus(
          ChatStatuses[item.type === CHAT_ACTIONS.FIND_JOB ? "FindAJob" : "QnA"]
        );
      }

      dispatch({
        type: item.type,
        payload: { item: item.text, isChatMessage: true },
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
          {map(menuItems, (item, index) => (
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
