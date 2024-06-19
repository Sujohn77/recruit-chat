import styled from "styled-components";

export const SlideUpPanelContainer = styled.div`
  position: relative;
`;

export const Panel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background-color: #f1f1f1;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "100%")});
  z-index: 10;
  padding: 10px;
  box-sizing: border-box;
`;

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(255, 255, 255, 0.85);
  transition: opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
  z-index: 5;
`;
