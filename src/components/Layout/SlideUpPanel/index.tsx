import React from "react";
import styled from "styled-components";

const SlideUpPanelContainer = styled.div`
  position: relative;
`;

const Panel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  z-index: 3;
  bottom: 0;
  left: 10px;
  width: 100%;
  height: 200px;
  background-color: #f1f1f1;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "100%")});
`;

interface ISlidePanelProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SlideUpPanel: React.FC<ISlidePanelProps> = ({
  isOpen,
  setIsOpen,
}) => {
  return (
    <SlideUpPanelContainer>
      <Panel isOpen={isOpen}>
        <p>Content inside the panel</p>
      </Panel>
    </SlideUpPanelContainer>
  );
};
