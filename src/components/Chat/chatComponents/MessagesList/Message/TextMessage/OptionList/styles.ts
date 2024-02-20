import styled from "styled-components";
import { Button } from "@mui/material";
import { COLORS } from "utils/colors";

interface IOptionProps {
  isLast?: boolean;
  isActive: boolean;
  height?: string;
}

export const OptionList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
  width: 100%;
`;

export const Text = styled.span``;

export const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 10px;
  width: 100%;
`;

export const ReferralOptionList = styled(List)`
  width: 100%;
  flex-direction: column;
`;

export const Option = styled(Button)<IOptionProps>`
  height: ${({ height }) => height};
  color: ${({ theme }) => theme.primaryColor} !important;
  border: 1px solid ${({ theme }) => theme.primaryColor} !important;
  background-color: ${({ isLast }) =>
    isLast ? COLORS.SILVER_DARK : COLORS.WHITE} !important;
  margin: 0 5px 16px !important;
  border-radius: 10px !important;
  text-transform: initial !important;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.7)};
  width: 45%;
`;

export const MessageOption = styled(Option)`
  width: 100%;
`;

export const OptionText = styled.span``;

export const MessageText = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 218px;
  white-space: pre-line;
  font-weight: 500;
`;
