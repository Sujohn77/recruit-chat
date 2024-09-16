import { CSSProperties } from "react";
import styled from "styled-components";
import { COLORS } from "utils/colors";

interface IMessagesAreaProps {
  withPPLink: boolean;
}

export const infiniteScrollStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column-reverse",
};

export const MessagesArea = styled.div<IMessagesAreaProps>`
  max-height: calc(100% - ${({ withPPLink }) => (withPPLink ? 150 : 120)}px);
  height: 100%;
  overflow: hidden;
  border: ${({ theme: { borderStyle, borderWidth } }) =>
    `${borderWidth} ${borderStyle}  ${COLORS.ALTO}`};
  position: relative;
`;

export const MessageListContainer = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 16px;
  transition: all 0.2s ease-in-out;
  padding-bottom: 22px;

  .infinite-scroll-component {
    overflow: hidden !important;
  }
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
