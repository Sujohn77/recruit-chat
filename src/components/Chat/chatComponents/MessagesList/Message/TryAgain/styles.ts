import styled from "styled-components";
import { COLORS } from "utils/colors";

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
  border: 1px solid ${({ borderColor = COLORS.PERSIAN_RED }) => borderColor};
  background: ${({ backgroundColor = "rgba(255, 0, 0, 0.1)" }) =>
    backgroundColor};
  color: ${({ fontColor = COLORS.PERSIAN_RED }) => fontColor};
  min-height: 74px;
  margin: 10px auto 0;
  border-radius: 8px;
`;

export const MessageText = styled.span`
  margin-bottom: 10px;
`;