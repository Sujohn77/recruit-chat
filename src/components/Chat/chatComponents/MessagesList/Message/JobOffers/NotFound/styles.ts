import styled from "styled-components";
import { Button } from "@mui/material";
import { COLORS } from "utils/colors";

interface INoFoundProps {
  withReferral: boolean;
}

interface ITitleProps {
  withMargin: boolean;
}

export const NoFound = styled.div<INoFoundProps>`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 24px 28px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  max-width: 306px;
  box-sizing: border-box;
  margin-bottom: 24px;

  ${({ withReferral }) =>
    withReferral ? "margin: 0px 18px;" : "min-height: 245px;"}
`;

export const Title = styled.p<ITitleProps>`
  white-space: pre-line;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { text } }) => text.color};
  text-align: center;

  ${({ withMargin }) => (withMargin ? "margin: 0 0 46px;" : "margin-top: 0;")}
`;

export const SetJobAlert = styled(Button)`
  margin: 0 0 16px !important;
  color: ${(props) => props.theme.primaryColor} !important;
  border: 1px solid ${(props) => props.theme.primaryColor} !important;
  border-radius: 100px !important;
  text-transform: initial !important;
  background-color: ${COLORS.WHITE} !important;
`;

export const RefineJobSearch = styled(Button)`
  background-color: ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  text-transform: initial !important;
`;
