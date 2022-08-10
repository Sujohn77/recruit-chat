import { TextField } from '@mui/material';
import styled from 'styled-components';

export const FormInput = styled(TextField)`
  input,
  textarea {
    background: #f3f2f2;
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
    top: 12px;
    right: 8px;
  }

  .MuiInputBase-multiline {
    padding: 0 !important;
  }
`;
