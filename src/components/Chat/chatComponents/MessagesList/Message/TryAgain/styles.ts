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
  border: 1px solid
    ${({ borderColor = COLORS.PICTON_BLUE_LIGHT }) => borderColor};
  background: ${({ backgroundColor = "rgba(79, 188, 255, 0.3)" }) =>
    backgroundColor};
  color: ${({ fontColor = COLORS.PICTON_BLUE }) => fontColor};
  min-height: 74px;
  margin: 10px auto 0;
  border-radius: 8px;
`;

export const MessageText = styled.span`
  margin-bottom: 10px;
`;
