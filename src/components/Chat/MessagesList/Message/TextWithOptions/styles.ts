import styled from 'styled-components';
import { MessageBox } from '../styles';

export const Option = styled(MessageBox)`
  width: 100px;
  text-align: center;
  cursor: pointer;
  &:before {
    display: none;
  }
`;

export const Options = styled.div`
  display: flex;
  gap: 19px;
`;
