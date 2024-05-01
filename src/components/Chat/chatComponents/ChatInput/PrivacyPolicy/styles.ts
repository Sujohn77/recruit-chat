import styled from "styled-components";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  position: relative;
  bottom: -14px;
  left: 0;
  z-index: 2;
  border-top: 1px solid ${COLORS.GRAY};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Link = styled.a`
  font-size: 10px;
  /* color: ${({ theme }) => theme.linkColor}; */
`;
