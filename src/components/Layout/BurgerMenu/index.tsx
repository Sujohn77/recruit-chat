import { map } from "lodash";
import { useState } from "react";
import styled from "styled-components";
import { colors } from "utils/colors";
import { CHAT_ACTIONS } from "utils/types";
import { ICONS } from "../../../utils/constants";
import sizes from "../../../utils/sizes";

const BurgerButton = styled.div`
  height: 20px;
  width: 10px;
  display: flex;
  justify-content: space-around;
  flex-flow: column nowrap;
  align-items: center;
  align-self: center;
  margin-right: 10px;
  cursor: pointer;
  top: 40%;
  right: 5%;
  @media (max-width: ${sizes.M}) {
    display: flex;
    margin-right: 0;
  }
`;

const MobileMenu = styled.img`
  width: 16px;
  height: 16px;
  opacity: 1;
`;

export const MenuItems = styled.div`
  padding: 0 10px;
  background: ${colors.gallery};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  position: absolute;
  bottom: 120px;
  left: 16px;
`;

export const MenuItem = styled.div`
  display: flex;
  padding: 0 6px;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.alabaster}
  &:before {
    content: "";
    background: #d9d9d9;
    display: inline-block;
    margin-right: 8px;
  }
  padding: 11px 0;
  border-bottom: 1px solid #c4c4c4;
`;

const menuItems = [
  {
    // action: CHAT_ACTIONS.SAVE_TRANSCIRPT,
    text: "Save transcript",
  },
  {
    // action: CHAT_ACTIONS._CHANGE_LANG,
    text: "Change language",
  },
  {
    // action: CHAT_ACTIONS.FIND_JOB,
    text: "Find a job",
  },
  {
    // action: CHAT_ACTIONS.ASK_QUESTION,
    text: "Ask a question",
  },
];

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const getIcon = (isOpen: boolean) => {
    if (isOpen) {
      return ICONS.OPENED_BURGER;
    }
    return ICONS.BURGER;
  };

  const onClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <BurgerButton onClick={onClick}>
      <MobileMenu src={getIcon(isOpen)} />
      {isOpen && (
        <MenuItems>
          {map(menuItems, (item, index) => (
            <MenuItem key={`menu-item-${index}`}>{item.text}</MenuItem>
          ))}
        </MenuItems>
      )}
    </BurgerButton>
  );
};

export default BurgerMenu;
