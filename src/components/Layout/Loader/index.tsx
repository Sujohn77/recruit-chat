import React from 'react';
import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme: { message } }) => message.backgroundColor};
  animation: fade 1.5s infinite;
  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  bottom: 10px;
  left: 16px;
`;

export const Loader = () => {
  const dots = Array.from({ length: 3 }).map((v, index) => <Dot key={'dot-' + index} />);

  return <Wrapper>{dots}</Wrapper>;
};
