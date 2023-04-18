import styled from "styled-components";
import { DarkButton } from "components/Layout/styles";
import { FormInput } from "components/Layout/Autocomplete/styles";

export const Wrapper = styled.div``;

export const Content = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 17px 20px 26px;
  width: 250px;
  border-radius: 10px;
  margin-bottom: 24px;
  position: relative;
`;

export const Title = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { text } }) => text.color};
  text-align: center;
`;

export const SubmitButton = styled(DarkButton)`
  margin: 21px 0 0;
`;

export const QuestionInput = styled(FormInput)`
  margin: 0 0 14px !important;
  width: 100% !important;
`;
