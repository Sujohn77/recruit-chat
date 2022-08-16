import { ButtonBase } from '@mui/material';
import styled from 'styled-components';
import { colors } from 'utils/colors';

export const DefaultButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter-SemiBold;
`;

export const DarkButton = styled(DefaultButton)`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter-SemiBold;
  background-color: ${colors.boulder}!important;
  border-radius: 100px !important;
  color: ${colors.white}!important;
`;

export const PrimaryButton = styled(DefaultButton)`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter-SemiBold;
  margin: 0 0 16px !important;
  color: ${colors.boulder}!important;
  border: 1px solid ${colors.boulder}!important;
  border-radius: 100px !important;
`;
