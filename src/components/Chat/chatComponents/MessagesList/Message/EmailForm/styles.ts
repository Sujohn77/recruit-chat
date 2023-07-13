import styled from "styled-components";
import { Button } from "@mui/material";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 16px 18px;
  width: 249px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { message } }) => message.transcriptForm.color};
  text-align: center;
  font-weight: 500;
`;

export const FormButton = styled(Button)`
  background: ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  font-weight: 500 !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  font-size: 14px !important;
  line-height: 17px !important;
  height: 40px;
  text-transform: initial !important;
`;