import styled from "styled-components";
import { Button } from "@mui/material";

import { COLORS } from "utils/colors";
import { MessageBox } from "../styles";

export const Wrapper = styled(MessageBox)`
  padding: 16px;
  width: 306px;
  max-width: 306px !important;
  &:after {
    display: none;
  }

  input {
    background: white;
    border-radius: 100px;
    height: 40px;
    width: 100% !important;
    margin: 0 0 16px;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

export const Title = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { message } }) => message.secondaryColor};
`;

export const Option = styled(Button)<{ selected?: boolean }>`
  background: ${({ theme, selected }) =>
    selected ? COLORS.DIMGRAY : theme.buttonSecondaryColor}!important;

  border-radius: 100px !important;
  width: 100px !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
`;

export const Options = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 0 0 24px;
`;
