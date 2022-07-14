import styled from "styled-components";
import { ICONS, Images } from "../../../utils/constants";
import sizes from "../../../utils/sizes";

type PropsType = {
  open: boolean;
  handlePressMenu: () => void;
  bottom?: boolean;
  whiteNavbar?: boolean;
  isClosedWhiteSide: boolean;
};

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

const BurgerMenu = (props: PropsType) => {
  const { open } = props;
  const getIcon = (open: boolean) => {
    if (open) {
      return ICONS.OPENED_BURGER;
    }
    return ICONS.BURGER;
  };

  return (
    <BurgerButton onClick={props.handlePressMenu}>
      <MobileMenu src={getIcon(open)} onClick={props.handlePressMenu} />
    </BurgerButton>
  );
};

export default BurgerMenu;
