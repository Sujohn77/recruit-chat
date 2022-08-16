import styled from 'styled-components';
import { MessageBox, MessageButton } from '../styles';

export const Option = styled(MessageButton)`
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
