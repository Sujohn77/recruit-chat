import styled from "styled-components";
import { TextField } from "@mui/material";
import { COLORS } from "utils/colors";

export const FormInput = styled(TextField)`
  input,
  textarea {
    background: ${COLORS.CONCRETE};
    border-radius: 10px;

    padding: 10px;
    /* font-family: Inter; */
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    min-height: 38px;
    box-sizing: border-box;
    margin: 5px 0;
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
