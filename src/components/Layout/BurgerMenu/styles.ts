import styled from 'styled-components';
import { colors } from 'utils/colors';

export const MenuItemWrapper = styled.div`
  display: flex;
  padding: 0 6px;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  color: ${colors.dustyGray};

  &:before {
    content: '';
    background: #d9d9d9;
    display: inline-block;
    margin-right: 8px;
    width: 16px;
    border-radius: 50%;
  }
  padding: 11px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #c4c4c4;
  }
`;
