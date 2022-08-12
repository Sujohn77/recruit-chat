import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Wrapper = styled.div`
  background: ${colors.white};
  position: relative;
  overflow: hidden;
`;

export const MessagesArea = styled.div`
  height: 400px;
  padding: 16px;
  border-bottom: 1px solid ${colors.alto};
  overflow-y: auto;
  position: relative;
`;

export const InputMessage = styled.span`
  color: ${colors.silverChalice};
`;

export const InitialMessage = styled.div`
  color: ${colors.dustyGray};
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 32px;
`;

export const Notification = styled.div`
  color: ${colors.black};
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  background-color: ${colors.alabaster};
  position: absolute;
  bottom: 60px;
`;
export const NotificationText = styled.p`
  font-weight: 500;
  font-size: 12px;
  margin: 0;
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
