import { ButtonBase } from "@mui/material";
import styled from "styled-components";

export const DefaultButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter-Medium;
`;

export const DarkButton = styled(DefaultButton)`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.primaryColor}!important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  border-radius: 100px !important;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter-SemiBold;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
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
  color: ${(props) => props.theme.primaryColor}!important;
  border: 1px solid ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
`;
