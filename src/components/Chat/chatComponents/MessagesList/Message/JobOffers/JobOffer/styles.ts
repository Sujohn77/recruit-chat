import { DefaultButton } from "components/Layout";
import styled from "styled-components";

const MARGIN = "0 12px";

export const JobOfferWrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 20px 18px;
  color: ${({ theme: { message } }) => message.jobOffer.color};
  font-size: 14px;
  line-height: 17px;
  margin: 0 18px;
  box-sizing: border-box;

  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Category = styled.h3`
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  margin: 0 0 24px;
`;

export const OfferTitle = styled.p`
  height: 34px;
  margin: ${MARGIN};
`;

export const Error = styled.div`
  display: flex;
`;

export const ErrorText = styled.span`
  color: #d32f2f;
`;

export const WarningImg = styled.img`
  margin-top: 10px;
  width: 12px;
  height: 12px;
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SuccessInteresting = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
`;
