import { useChatMessenger } from "contexts/MessengerContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import map from "lodash/map";

import * as S from "./styles";
import { IBurgerMenuProps } from "./props";
import { menuItems } from "./data";
import { MenuItem } from "./MenuItem";
import { BurgerIcon } from "./BurgerIcon";
import { IMenuItem } from "utils/types";

export const BurgerMenu: React.FC<IBurgerMenuProps> = ({
  setIsShowResults,
}) => {
  const { dispatch } = useChatMessenger();

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
    dispatch({
      type: item.type,
      payload: { item: item.text, isChatMessage: true },
    });
    setIsOpen(true);
    setIsShowResults(false);
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
