import styled from "styled-components";

interface IWrapperProps {
  borderColor?: string;
  backgroundColor?: string;
  fontColor?: string;
}

export const Wrapper = styled.div<IWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 90%;
  padding: 14px;
  border: 1px solid ${({ borderColor = "#efc8c7" }) => borderColor};
  background: ${({ backgroundColor = "#ffe7e7" }) => backgroundColor};
  min-height: 74px;
  margin: 10px auto 0;
  border-radius: 8px;
`;

export const MessageText = styled.span`
  margin-bottom: 12px;
  color: "#d68282";
`;
