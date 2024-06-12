import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

interface BurgerIconProps {
  isOpen: boolean;
}

export const BurgerIcon = styled.div<BurgerIconProps>`
  width: 18px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;

  div {
    width: 18px;
    height: 2px;
    background-color: #333;
    transition: transform 0.3s ease, opacity 0.3s ease;
    &:first-child {
      transform: ${({ isOpen }) =>
        isOpen ? "rotate(45deg) translate(5px, 5px)" : "none"};
    }
    &:nth-child(2) {
      opacity: ${({ isOpen }) => (isOpen ? "0" : "1")};
    }
    &:last-child {
      transform: ${({ isOpen }) =>
        isOpen ? "rotate(-45deg) translate(3px, -3px)" : "none"};
    }
  }
`;
