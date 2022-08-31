import styled from 'styled-components';
import { colors } from 'utils/colors';
import { MessageItem, MessageText } from '../styles';

export const InterestedInText = styled(MessageText)`
  margin-bottom: 12px;
`;
export const InterestedInTitle = styled.p`
  margin: 0 0 8px;
`;

export const MessageJobItem = styled(MessageItem)`
  margin: 0 0 4px;
  color: ${({
    theme: {
      message: { interestedJob },
    },
  }) => interestedJob.color};
  &:before {
    background: ${({ theme: { message } }) => message.backgroundColor};
  }
`;
