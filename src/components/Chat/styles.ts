import styled from 'styled-components';
import { colors } from 'utils/colors';
const animationDuration = '0.5s';

export const Wrapper = styled.div`
  background: ${colors.white};
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;

  height: 0;
  animation: ${({ isOpened }: { isOpened: boolean }) =>
    isOpened
      ? `open ${animationDuration} ease-in`
      : `close ${animationDuration} ease-in`};
  animation-fill-mode: forwards;
  margin-left: auto;
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
  background: ${({ theme: { notification } }) => notification.backgroundColor};
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  position: absolute;
  bottom: 60px;
`;
export const NotificationText = styled.p`
  font-weight: 500;
  font-size: 12px;
  margin: 0;
  color: ${({ theme: { notification } }) => notification.color};
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
