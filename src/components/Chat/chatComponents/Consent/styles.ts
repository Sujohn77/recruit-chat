import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 95%;
  border-radius: 10px;
  padding: 16px 18px;
  box-sizing: border-box;
  margin-top: 30%;
  background: ${({ theme: { message } }) => message.backgroundColor};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Text = styled.span`
  color: ${({ theme: { message } }) => message.jobOffer.color};
  font-weight: 600;
  margin-bottom: 25px;
`;
