import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { ButtonsTheme } from './types';

interface IStyledProps {
  background?: ButtonsTheme;
}

export const ButtonWrapper = styled(Button)`
  background-color: ${({ background = ButtonsTheme.Purple }: IStyledProps) =>
    colors[background]}!important;
  width: 100%;
  border-radius: 20px !important;
  color: #fff !important;
  font-size: 14px;
  box-shadow: none !important;
  height: 40px !important;
`;
