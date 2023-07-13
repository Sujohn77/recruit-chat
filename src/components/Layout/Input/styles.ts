import { TextField } from "@mui/material";
import styled from "styled-components";

import { COLORS } from "utils/colors";
import { InputTheme } from "utils/constants";

export const Wrapper = styled.div`
  width: 100%;
  position: relative;

  span {
    position: absolute;
    right: 12px;
    top: 12px;
    font-size: 12px;
    color: ${COLORS.PERSIAN_RED};
  }
`;

export const TextAreaInputWrapper = styled.div``;

export const FormInput = styled(TextField)`
  input,
  textarea {
    background: ${COLORS.CONCRETE};
    border-radius: 10px;

    padding: 10px;
    font-family: Inter;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    min-height: 38px;
    box-sizing: border-box;
  }
  textarea {
    min-height: 17px;
  }
  fieldset {
    border: none;
  }
  p {
    position: absolute;
    top: 7px;
    right: 8px;
  }

  .MuiInputBase-multiline {
    padding: 0 !important;
  }
`;

export const TextInput = styled.input`
  color: ${COLORS.SILVER_CHALICE};
  border: none;
  background: ${({ theme }) =>
    theme === InputTheme.Default ? COLORS.WHITE : "none"};
  font-size: 16px;
  line-height: 19px;
  outline: none;
  width: ${({ theme }) =>
    theme === InputTheme.Default
      ? "-webkit-fill-available"
      : "250px!important"};
  height: ${({ theme }) => (theme === InputTheme.Default ? "38px" : "40px")};
  border-radius: ${({ theme }) =>
    theme === InputTheme.Default ? "10px" : "0"};
  padding: ${({ theme }) => (theme === InputTheme.Default ? "0 10px" : "0")};
`;

export const TextAreaInput = styled.textarea`
  color: ${COLORS.SILVER_CHALICE};
  border: none;
  background: none;
  font-size: 16px;
  line-height: 19px;
  outline: none;
  width: 250px !important;
`;

export const ErrorText = styled.span`
  position: absolute;
  right: 42px;
  top: 20px;
  font-size: 13px;
  color: ${COLORS.PERSIAN_RED};
  display: flex;
  align-items: center;
`;
