import styled from "styled-components";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  width: 249px;
  box-sizing: border-box;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { message } }) => message.transcriptForm.color};
  text-align: center;
`;
