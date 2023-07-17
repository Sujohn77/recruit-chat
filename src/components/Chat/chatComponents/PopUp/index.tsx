import styled from "styled-components";

export const PopUp = styled.div`
  position: absolute;
  top: 60px;
  background: rgb(255, 255, 255, 0.85);
  padding: 0 16px 38px;
  overflow: auto;
  height: 480px;
  box-sizing: border-box;
  font-family: Inter-Medium;
  font-weight: 500;
  animation: fade-in 0.25s ease-in forwards;
  opacity: 0;
  z-index: 2;
  width: 100%;
  height: 90%;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  @keyframes fade-in {
    0% {
      opacity: 0.7;
      transform: translateX(200px);
    }
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
`;
