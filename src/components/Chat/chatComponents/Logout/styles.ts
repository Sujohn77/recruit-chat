import styled from "styled-components";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  display: flex;
  flex-flow: column;
  border-radius: 10px;
  padding: 16px 18px;
  width: 249px;
  gap: 20px;
  box-sizing: border-box;
  margin: 55px 0 24px;
  position: relative;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

export const Text = styled.span`
  color: ${({ theme: { message } }) => message.jobOffer.color};
  font-weight: 600;
`;
