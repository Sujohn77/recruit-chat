import styled from "styled-components";

interface IContainerProps {
  isMobile: boolean;
}

export const Container = styled.div<IContainerProps>`
  width: ${({ isMobile }) => (isMobile ? "100%" : "370px")};
  position: absolute;
  bottom: 0px;
  max-width: 100%;
`;
