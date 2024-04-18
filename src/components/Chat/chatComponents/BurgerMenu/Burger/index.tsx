import React from "react";
import * as S from "./styles";

interface IBurgerProps {
  isOpen: boolean;
  onBurgerClick: () => void;
}

export const Burger: React.FC<IBurgerProps> = ({ isOpen, onBurgerClick }) => (
  <S.Container onClick={onBurgerClick}>
    <S.BurgerIcon isOpen={isOpen}>
      <div />
      <div />
      <div />
    </S.BurgerIcon>
  </S.Container>
);
