import styled from "styled-components";

export const JobOfferWrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  color: ${({ theme: { message } }) => message.jobOffer.color};
  border-radius: 10px;
  padding: 20px 18px;
  margin: 0 18px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 17px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  height: 242px;
`;

export const OfferTitle = styled.p`
  margin: 0;
  font-weight: 600;
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Description = styled.p`
  height: 130px;
  overflow: hidden;
  margin: 0;
  opacity: 0.4;
  margin-bottom: 25px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
