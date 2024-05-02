import { CSSProperties } from "react";
import styled from "styled-components";
import { COLORS } from "utils/colors";

interface IMessageListContainerProps {
  resultsHeight: number;
  isMobile: boolean;
}

interface IMessagesAreaProps {
  withPPLink: boolean;
}

export const infiniteScrollStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column-reverse",
};

export const MessagesArea = styled.div<IMessagesAreaProps>`
  max-height: calc(100% - ${({ withPPLink }) => (withPPLink ? 150 : 120)}px);
  overflow: hidden;
  border: ${({ theme: { borderStyle, borderWidth } }) =>
    `${borderWidth} ${borderStyle}  ${COLORS.ALTO}`};
  position: relative;
`;

export const MessageListContainer = styled.div<IMessageListContainerProps>`
  height: ${({ resultsHeight, isMobile }) =>
    (isMobile ? window.innerHeight - 120 : 480) - resultsHeight}px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 16px;
  .infinite-scroll-component {
    overflow: hidden !important;
    > div {
    }
  }
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
