import styled from "styled-components";
import { COLORS } from "utils/colors";

const duration = "0.35s";

interface IWrapperProps {
  isOpened: boolean;
}

export const Wrapper = styled.div<IWrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${COLORS.WHITE};
  border-radius: 10px;
  overflow: hidden;
  height: 0;
  z-index: 1;

  animation: ${({ isOpened }) =>
    isOpened ? `open ${duration} ease-in` : `close ${duration} ease-in`};
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
