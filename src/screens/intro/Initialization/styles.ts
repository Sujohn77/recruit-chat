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
  font-size: calc(8px + 1vmin);
  margin: 0 0 ${({ isFrench }) => (isFrench ? 0 : 10)}px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme: { message } }) =>
    message.chat.backgroundColor}!important;

  span {
    color: ${({ theme }) => theme?.message.initialColor}!important;
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
  min-width: 225px;
  padding: ${({ isFrench }) => (isFrench ? 7 : 0)}px 16px;
  line-height: ${({ isFrench }) => (isFrench ? 20 : 41)}px;
  border: none;
  color: ${({ theme: { message } }) => message.chat.color};
  font-weight: 500;
  height: ${({ isFrench }) => (isFrench ? 56 : 41)}px;
  box-sizing: border-box;
  margin-bottom: 12px;
  animation: fade 0.3s ease-in;
  overflow: hidden;

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
  margin: ${({ isFrench = false }) => (isFrench ? 10 : 22)}px 0 0;
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
