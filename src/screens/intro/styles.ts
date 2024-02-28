import styled from "styled-components";

const borderWidth = "1.5px";
const animationDuration = "0.25s";

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const Wrapper = styled.div`
  width: 370px;
  position: absolute;
  bottom: 0;
  right: 0;

  animation: ${({ isClosed }: { isClosed: boolean }) =>
    isClosed && `fadeOut ${animationDuration} ease-in-out`};
  overflow: hidden;
  animation-fill-mode: forwards;

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const Close = styled.div<{ height?: string; backgroundColor?: string }>`
  position: absolute;
  right: 16px;
  top: 10px;
  cursor: pointer;
  width: 18px;
  height: 18px;

  &:before,
  &:after {
    content: "";
    height: ${({ height = "17px" }) => height};
    width: ${borderWidth};
    background: ${({ backgroundColor, theme }) =>
      theme.chatbotHeaderTextColor || backgroundColor};
    display: inline-block;
    position: absolute;
    top: 1px;
    left: 9px;
  }
  &:before {
    transform: rotate(-45deg);
  }
  &:after {
    transform: rotate(45deg);
  }
`;

export const Image = styled.img<{ size?: string }>`
  width: ${({ size = "20px" }) => size};
  height: ${({ size = "20px" }) => size};
`;

export const IntroImage = styled(Image)``;
