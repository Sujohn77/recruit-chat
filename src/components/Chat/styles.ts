import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Wrapper = styled.div`
  background: ${colors.white};
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  animation: open 0.5s ease-in;
  overflow: hidden;

  @keyframes open {
    0% {
      height: 180px;
      margin-top: 450px;
      opacity: 0;
    }

    100% {
      height: 600px;
      margin-top: 30px;
      opacity: 1;
    }
  }
`;

export const MessagesArea = styled.div`
  height: 400px;
  padding: 16px;
  border-bottom: 1px solid ${colors.alto};
  overflow-y: auto;
  position: relative;
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
