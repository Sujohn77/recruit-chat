import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Wrapper = styled.div`
  background: ${colors.white};
`;

export const MessagesArea = styled.div`
  // height: 400px;
  font-family: Inter-Medium;
  border-bottom: 1px solid ${colors.alto};
  position: relative;
`;

export const MessageListContainer = styled.div`
  height: 480px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 16px;

  .infinite-scroll-component > div {
    margin-bottom: 32px;
  }
`;

export const infiniteScrollStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column-reverse',
};

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;