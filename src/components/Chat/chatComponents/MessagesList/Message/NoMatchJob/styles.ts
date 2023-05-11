import { Button } from "@mui/material";
import styled from "styled-components";
import { colors } from "utils/colors";

export const Wrapper = styled.div<{ isRefineOnly?: boolean }>`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 24px 28px;
  margin: ${({ isRefineOnly }) => !isRefineOnly && "0 16px"};
  display: flex;
  flex-flow: column;
  max-width: 306px;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

export const Title = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { text } }) => text.color};
  text-align: center;
`;

export const Avatar = styled.div`
  width: 69px;
  height: 69px;
  border-radius: 50%;
  margin: 0 auto 32px;
  background-color: ${colors.white};
`;

export const SetJobAlert = styled(Button)`
  margin: 0 0 16px !important;
  color: ${(props) => props.theme.primaryColor}!important;
  border: 1px solid ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  text-transform: initial !important;
  background-color: ${colors.white};
`;

export const RefineJobSearch = styled(Button)`
  background-color: ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  text-transform: initial !important;
`;
