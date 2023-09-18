import { Button } from "@mui/material";
import styled from "styled-components";
import { COLORS } from "utils/colors";

export const OptionList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
`;

export const Text = styled.span``;

export const Option = styled(Button)<{ isLast?: boolean }>`
  margin: 0 5px 16px !important;
  color: ${(props) => props.theme.primaryColor} !important;
  border: 1px solid ${(props) => props.theme.primaryColor} !important;
  border-radius: 100px !important;
  text-transform: initial !important;
  background-color: ${({ isLast }) =>
    isLast ? COLORS.SILVER_DARK : COLORS.WHITE} !important;
`;
