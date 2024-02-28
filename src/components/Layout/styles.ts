import styled from "styled-components";
import { ButtonBase } from "@mui/material";

interface IDarkButtonProps {
  fontWeight?: number;
  backgroundColor?: string;
  fontColor?: string;
  width?: string;
  isSelected?: boolean;
  height?: string;
  marginBottom?: string;
  fontSize?: number;
}

export const StyledButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  background: ${({ theme }) => theme.buttonPrimaryColor || theme.primaryColor};
`;

export const DarkButton = styled(StyledButton)<IDarkButtonProps>`
  height: ${({ height = "30px" }) => height};
  width: ${({ width = "calc(50% - 5px)" }) => width};
  background: ${({ theme, backgroundColor }) =>
    theme.buttonPrimaryColor ||
    backgroundColor ||
    theme.primaryColor} !important;
  color: ${({ theme: { button }, fontColor }) =>
    fontColor || button.secondaryColor} !important;
  border-radius: 8px !important;
  font-size: ${({ fontSize = 14 }) => fontSize}px;
  line-height: 17px;
  font-weight: ${({ fontWeight = 700 }) => fontWeight};
  margin-bottom: ${({ marginBottom }) => marginBottom} !important;

  &:disabled {
    ${({ isSelected }) => (isSelected ? "" : "opacity: 0.3; cursor: default;")}
  }
`;

export const PrimaryButton = styled(StyledButton)`
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
