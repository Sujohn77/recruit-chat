import React from "react";
import * as S from "./styles";

interface IBurgerProps {
  isOpen: boolean;
  onBurgerClick: () => void;
}

export const Burger: React.FC<IBurgerProps> = ({ isOpen, onBurgerClick }) => (
  <S.Container>
    <S.BurgerIcon onClick={onBurgerClick} isOpen={isOpen}>
      <div />
      <div />
      <div />
    </S.BurgerIcon>
  </S.Container>
);
