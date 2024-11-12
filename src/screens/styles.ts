import styled from "styled-components";

interface IWrapperProps {
  isMobile: boolean;
  isSelectedOption: boolean | null;
}
interface IImageProps {
  size?: string;
}

const borderWidth = "1.5px";
const animationDuration = "0.25s";

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const Wrapper = styled.div<IWrapperProps>`
  width: ${({ isMobile }) => (isMobile ? "100%" : "370px")};
  position: absolute;
  bottom: 0;
  right: 0;

  animation: ${({ isSelectedOption: isClosed }) =>
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

export const Image = styled.img<IImageProps>`
  width: ${({ size = "20px" }) => size};
  height: ${({ size = "20px" }) => size};
`;

export const IntroImage = styled(Image)`
  border: none;
  outline: none;
`;

export const MobileIntroImg = styled.img`
  cursor: pointer;
  width: 60px;
  height: 60px;
  object-fit: fill;
  border-radius: 50%;
`;

export const ImgWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
