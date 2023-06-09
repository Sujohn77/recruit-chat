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

export const ReadMore = styled.p`
  text-transform: uppercase;
  color: ${({ theme: { message } }) => message.jobOffer.color};
  border-bottom: 1px solid ${({ theme: { message } }) => message.jobOffer.color};
  width: fit-content;
  margin: ${MARGIN};
`;
