import { CSSProperties } from "react";
import styled from "styled-components";
import { COLORS } from "utils/colors";

interface IMessageListContainerProps {
  resultsHeight: number;
}

export const infiniteScrollStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column-reverse",
};

export const Wrapper = styled.div`
  background: ${COLORS.WHITE};
`;

export const MessagesArea = styled.div`
  max-height: calc(100% - 120px);
  overflow: hidden;
  /* font-family: Inter-Medium; */
  border: ${({ theme: { borderStyle, borderWidth } }) =>
    `${borderWidth} ${borderStyle}  ${COLORS.ALTO}`};
  border-bottom: 1px solid ${COLORS.ALTO};
  position: relative;
`;

export const MessageListContainer = styled.div<IMessageListContainerProps>`
  height: ${({ resultsHeight }) => 480 - resultsHeight}px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 16px;
  .infinite-scroll-component {
    overflow: hidden !important;
    > div {
      margin-bottom: 32px;
    }
  }
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
