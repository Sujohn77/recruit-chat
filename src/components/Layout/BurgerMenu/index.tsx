import { useChatMessenger } from "contexts/MessengerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import map from "lodash/map";

import { menuItems } from "./data";
import { MenuItem } from "./MenuItem";
import * as S from "./styles";
import { IMenuItem } from "utils/types";

export const BurgerMenu = () => {
  const { triggerAction } = useChatMessenger();

  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleItemClick = (item: IMenuItem) => {
    triggerAction({
      type: item.type,
      payload: { item: item.text, isChatMessage: true },
    });
    setIsOpen(true);
  };

  const handleBurgerClick = useCallback(() => {
    setIsOpen((prevValue) => !prevValue);
  }, []);

  return (
    <S.Wrapper onClick={handleBurgerClick}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 1 }}
      >
        <svg viewBox="0 0 100 80" width="16" height="16">
          <rect y="0" width="100" height="14" rx="10"></rect>
          <rect y="35" width="100" height="14" rx="10"></rect>
          <rect y="70" width="100" height="14" rx="10"></rect>
        </svg>
      </IconButton>

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
