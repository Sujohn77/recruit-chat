import React, { CSSProperties } from "react";
import * as S from "./styles";

interface ISlidePanelProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  contentStyle?: CSSProperties;
}

export const SlideUpPanel: React.FC<ISlidePanelProps> = ({
  isOpen,
  setIsOpen,
  children,
  contentStyle,
}) => (
  <S.SlideUpPanelContainer>
    <S.Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
    <S.Panel style={contentStyle} isOpen={isOpen}>
      {children}
    </S.Panel>
  </S.SlideUpPanelContainer>
);
