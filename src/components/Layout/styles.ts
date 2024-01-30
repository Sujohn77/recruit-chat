import styled from "styled-components";
import { ButtonBase } from "@mui/material";

interface IDarkButtonProps {
  fontWeight?: number;
}

export const DefaultButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
`;

export const DarkButton = styled(DefaultButton)<IDarkButtonProps>`
  height: 30px;
  width: calc(50% - 5px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.primaryColor}!important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  border-radius: 8px !important;
  font-size: 14px;
  line-height: 17px;
  font-weight: ${({ fontWeight = 700 }) => fontWeight};

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
  /* font-family: Inter-SemiBold; */
  margin: 0 0 16px !important;
  color: ${(props) => props.theme.primaryColor}!important;
  border: 1px solid ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
`;
