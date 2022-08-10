import React from 'react';
import styled from 'styled-components';
import { colors } from 'utils/colors';
const Wrapper = styled.div`
  width: 100%;
  border-radius: 20px;
  background: ${colors.alto};
  line-height: 155px;
  text-align: center;
`;
export const ThanksMessage = () => {
  return <Wrapper>Bot thanks to you</Wrapper>;
};
