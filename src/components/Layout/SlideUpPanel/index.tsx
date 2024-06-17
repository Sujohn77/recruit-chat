import React from "react";
import * as S from "./styles";

interface ISlidePanelProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const SlideUpPanel: React.FC<ISlidePanelProps> = ({
  isOpen,
  setIsOpen,
  children,
}) => (
  <S.SlideUpPanelContainer>
    <S.Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
    <S.Panel isOpen={isOpen}>{children}</S.Panel>
  </S.SlideUpPanelContainer>
);
