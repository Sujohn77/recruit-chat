import styled from "styled-components";
import { Button } from "@mui/material";
import { COLORS } from "utils/colors";

interface IOptionProps {
  isLast?: boolean;
  isActive: boolean;
}

export const OptionList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
`;

export const Text = styled.span``;

export const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
`;

export const Option = styled(Button)<IOptionProps>`
  margin: 0 5px 16px !important;
  color: ${(props) => props.theme.primaryColor} !important;
  border: 1px solid ${(props) => props.theme.primaryColor} !important;
  border-radius: 100px !important;
  text-transform: initial !important;
  background-color: ${({ isLast }) =>
    isLast ? COLORS.SILVER_DARK : COLORS.WHITE} !important;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.7)};
`;

export const OptionText = styled.span``;
