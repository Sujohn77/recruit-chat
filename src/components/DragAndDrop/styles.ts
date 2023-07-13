import styled from "styled-components";
import { COLORS } from "utils/colors";

export const DragAndDropWrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  color: ${({ theme: { message } }) => message.primaryColor};
  border-radius: 10px;
  padding: 32px 17px 16px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  width: 220px;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
`;

export const Border = styled.div`
  border: dashed ${COLORS.GRAY} 4px;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
`;

export const Center = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  text-align: center;
  color: ${COLORS.GRAY};
  font-size: 36;
`;

export const Title = styled.div``;
