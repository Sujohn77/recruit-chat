import { Button } from "@mui/material";
import styled from "styled-components";
import { colors } from "utils/colors";

export const JobOfferWrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 20px 18px;
  color: ${({ theme: { message } }) => message.jobOffer.color};
  font-size: 14px;
  line-height: 17px;
  margin: 0 18px;
  box-sizing: border-box;
`;

export const Category = styled.h3`
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  margin: 0 0 24px;
`;

export const OfferTitle = styled.p`
  margin: 0 12px;
  height: 34px;
`;

export const ReadMore = styled.p`
  text-transform: uppercase;
  margin: 55px 12px 17px;
  color: ${({ theme: { message } }) => message.jobOffer.color};
  border-bottom: 1px solid ${({ theme: { message } }) => message.jobOffer.color};
  width: fit-content;
`;

// --------------------- NoFound styles --------------------- //

export const Wrapper = styled.div<{ isRefineOnly?: boolean }>`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 24px 28px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  max-width: 306px;
  box-sizing: border-box;
  margin-bottom: 24px;
  min-height: 245px;
`;

export const Title = styled.p`
  margin: 0 0 46px;
  white-space: pre-line;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { text } }) => text.color};
  text-align: center;
`;

export const SetJobAlert = styled(Button)`
  margin: 0 0 16px !important;
  color: ${(props) => props.theme.primaryColor} !important;
  border: 1px solid ${(props) => props.theme.primaryColor} !important;
  border-radius: 100px !important;
  text-transform: initial !important;
  background-color: ${colors.white} !important;
`;

export const RefineJobSearch = styled(Button)`
  background-color: ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  text-transform: initial !important;
`;

// ---------------------------------------------------------- //
