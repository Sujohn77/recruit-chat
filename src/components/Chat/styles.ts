import styled from "styled-components";
import { COLORS } from "utils/colors";

const animationDuration = "0.35s";
const borderWidth = "1.5px";

interface IWrapperProps {
  isOpened: boolean;
}

export const Wrapper = styled.div<IWrapperProps>`
  background: ${COLORS.WHITE};
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;
  height: 0;
  animation: ${({ isOpened }) =>
    isOpened
      ? `open ${animationDuration} ease-in`
      : `close ${animationDuration} ease-in`};
  animation-fill-mode: forwards;
  margin-left: auto;
  display: flex;
  flex-direction: column;

  @keyframes open {
    0% {
      height: 0;
      width: 0;
    }

    30% {
      height: 0;
      width: 0;
      transform: translate(27.5px, 0);
      margin-top: 450px;
    }

    100% {
      height: 600px;
      width: 370px;
      transform: translate(0, 0);
      margin-top: 30px;
    }
  }

  @keyframes close {
    0% {
      height: 600px;
      width: 370px;
      transform: translate(0, 0);
      margin-top: 30px;
    }

    50% {
      height: 0;
      width: 0;
      transform: translate(27.5px, 0);
      margin-top: 450px;
    }

    100% {
      height: 0;
      width: 0;
    }
  }
`;

export const InputMessage = styled.span`
  color: ${({ theme: { input } }) => input.color};
`;

export const Notification = styled.div`
  background: ${COLORS.PASTEL_GRIN};
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 8px;
  height: 30px;
  margin: 0 auto;
  width: 240px;
  border-radius: 10px;
  position: relative;
`;

export const NotificationText = styled.p`
  margin-left: 0.5em;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 500;
  max-width: calc(100% - 60px);
  white-space: nowrap;
  font-size: 12px;
  margin: 0;
  color: ${({ theme: { notification } }) => notification.color};
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
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
