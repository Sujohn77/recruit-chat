import styled from "styled-components";
import { MessageBox } from "components/Chat/ChatComponents/MessagesList/Message/styles";

interface IFrProps {
  isFrench: boolean;
}

interface IImgProps {
  isFrench?: boolean;
}

const borderWidth = "1.5px";

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const Wrapper = styled(Flex)<IFrProps>`
  margin-left: 16px;
  margin-bottom: 18px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const Close = styled.div<{ height?: string; color?: string }>`
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
    background: ${({ color }) => color};
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

export const Message = styled.div<IFrProps>`
  border-radius: 20px;
  padding: 11px ${({ isFrench }) => (isFrench ? 10 : 16)}px;
  white-space: nowrap;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.startBtnBackground}!important;

  span {
    color: ${({ theme }) => theme.startBtnColor}!important;
  }
  animation: opacity 0.3s ease-in;

  &:nth-child(2) {
    animation: opacity 0.6s ease-in;
  }

  @keyframes opacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const Question = styled(MessageBox)<IFrProps>`
  display: flex;
  align-items: center;
  min-width: 225px;
  padding: 5px 16px;
  line-height: 19px;
  border: none;
  font-weight: 500;
  box-sizing: border-box;
  animation: fade 0.3s ease-in;
  overflow: hidden;
  color: ${({ theme }) => theme.startMessColor}!important;
  background: ${({ theme }) => theme.startMessBackground}!important;
  margin-bottom: 12px;
  border-radius: 20px;
  min-height: 38px;

  ${({ isFrench }) => isFrench && "max-width: 292px;"}

  @keyframes fade {
    0% {
      transform: scale(0.85) translate(-30px);
      opacity: 0;
    }

    100% {
      transform: scale(1) translate(0);
      opacity: 1;
    }
  }
`;

export const Text = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.initialColor};
`;

export const Image = styled.img<{ size?: string }>`
  width: ${({ size = "20px" }) => size};
  height: ${({ size = "20px" }) => size};
`;

export const IntroImage = styled(Image)<IImgProps>`
  max-width: 34px;
  border-radius: 50%;
  border: ${({ theme }) =>
    theme.avatarBorderStyle
      ? theme.avatarBorderStyle
      : `1px solid ${theme.primaryColor}`};
  box-sizing: border-box;

  ${({ isFrench }) => isFrench && "margin-right: 10px;"};
`;

export const Options = styled(Flex)<IFrProps>`
  margin-left: auto;
  width: fit-content;
  gap: 8px;
  animation: fade 0.4s ease-in;
`;

export const InfoContent = styled.div`
  @keyframes fadeInfoOut {
    0% {
      height: 100%;
      width: 259px;
    }
    100% {
      height: 0;
      width: 0;
    }
  }

  height: 100%;
  overflow: hidden;
`;
