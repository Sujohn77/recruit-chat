import styled from "styled-components";
import { Close } from "screens/Intro/styles";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 16px 18px;
  width: 249px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  box-sizing: border-box;
  margin: 55px 0 24px;
  position: relative;
`;

export const ViewBody = styled.div`
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

export const HeaderTitle = styled.div``;

export const TextTitle = styled.h3`
  margin: 0 0 16px;
  padding: 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

export const CloseLogin = styled(Close)`
  position: absolute;
  top: -21px;
  right: -17px;
  height: 18px;
  width: 18px;
  cursor: pointer;
`;
