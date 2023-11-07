import styled from "styled-components";
import { FormInput } from "components/Layout/Autocomplete/styles";
import { DarkButton } from "components/Layout/styles";
import { COLORS } from "utils/colors";

export const CloseBtnStyle = {
  right: "7px",
  top: "8px",
};

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 17px 20px 26px;
  width: 250px;
  border-radius: 10px;
  margin-bottom: 24px;
  position: relative;
  margin: 0 0 24px 62px;
  box-sizing: border-box;
  height: 273px;
  position: relative;
`;

export const Title = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { text } }) => text.color};
  text-align: center;
  /* font-family: "Inter-Bold"; */
`;

export const Description = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 17px;
  color: #000;
  text-align: center;
`;

export const SuccessText = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #000;
  text-align: center;
  opacity: 0.5;
`;

export const SubmitButton = styled(DarkButton)`
  margin: 21px 0 0;
`;

export const QuestionInput = styled(FormInput)`
  margin: 0 0 14px !important;
  width: 100% !important;

  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: initial;
  }

  input,
  textarea {
    background: #fff !important;
    color: ${COLORS.DOVE_GRAY};
    /* font-family: "Inter-Medium"; */
  }
`;
