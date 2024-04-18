import styled from "styled-components";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MenuItemsWrapper = styled.div`
  padding: 0 10px;
  background: ${COLORS.GALLERY};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  position: absolute;
  bottom: 50px;
  left: 20px;
  animation: burger-fade-in 0.1s ease-in forwards;
  opacity: 0;
  z-index: 3;

  @keyframes burger-fade-in {
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
