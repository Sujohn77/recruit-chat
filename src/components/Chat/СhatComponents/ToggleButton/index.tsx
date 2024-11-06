import React, { FC } from "react";
import styled from "styled-components";
import { COLORS } from "utils/colors";

const ButtonContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 2px 0px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 12px;
  color: ${COLORS.DUSTY_GRAY};

  span {
    margin-right: 5px;
    transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0)")};
    transition: transform 0.3s ease;
    color: ${COLORS.DUSTY_GRAY};
  }
`;

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleButton: FC<IProps> = ({ isOpen, setIsOpen }) => (
  <ButtonContainer onClick={() => setIsOpen((prev) => !prev)} isOpen={isOpen}>
    <span>&#9660;</span>
    {isOpen ? "Show fewer" : "Show more"}
  </ButtonContainer>
);
