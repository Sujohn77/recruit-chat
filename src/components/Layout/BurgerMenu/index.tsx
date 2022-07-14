import { useState } from "react";
import styled from "styled-components";
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
    </BurgerButton>
  );
};

export default BurgerMenu;
