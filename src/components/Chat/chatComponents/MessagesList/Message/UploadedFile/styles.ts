import styled from "styled-components";
import { colors } from "utils/colors";

export const Notification = styled.div`
  background: ${colors.lightgreen};
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
