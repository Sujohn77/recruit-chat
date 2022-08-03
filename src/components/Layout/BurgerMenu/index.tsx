import { IconButton } from "@mui/material";
import { useChatMessanger } from "contexts/MessangerContext";
import { map } from "lodash";
import { useCallback, useState } from "react";
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
  bottom: 50px;
  left: 20px;
  animation: fade-in 0.1s ease-in forwards;
  opacity: 0;
  z-index: 1;
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
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
  &:not(:last-child){
    border-bottom: 1px solid #c4c4c4;
  }
`;
interface IMenuItem {
  type: CHAT_ACTIONS;
  text: string;
}
const menuItems = [
  {
    type: CHAT_ACTIONS.SAVE_TRANSCRIPT,
    text: "Save transcript",
  },
  {
    type: CHAT_ACTIONS.CHANGE_LANG,
    text: "Change language",
  },
  {
    type: CHAT_ACTIONS.FIND_JOB,
    text: "Find a job",
  },
  {
    type: CHAT_ACTIONS.ASK_QUESTION,
    text: "Ask a question",
  },
];

const BurgerMenu = () => {
  const { triggerAction } = useChatMessanger();
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = ({ type, text }: IMenuItem) => {
    triggerAction({ type, payload: { item: text } });
    setIsOpen(false);
  };

  const handleBurgerClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const items = map(menuItems, (item, index) => (
    <MenuItem onClick={() => handleItemClick(item)} key={`menu-item-${index}`}>
      {item.text}
    </MenuItem>
  ));

  return (
    <div onClick={handleBurgerClick}>
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
      {isOpen && <MenuItems>{items}</MenuItems>}
    </div>
  );
};

export default BurgerMenu;
