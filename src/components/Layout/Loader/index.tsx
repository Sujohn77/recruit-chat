import React from "react";
import styled from "styled-components";
import { colors } from "utils/colors";

export const Dot = styled.span<{ isShow?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${colors.alto};
  animation: fade 1.5s infinite;
  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  bottom: 16px;
`;

export const Loader = ({ isShow }: { isShow?: boolean }) => {
  const dots = Array.from({ length: 3 }).map((v, index) => (
    <Dot key={"dot-" + index} isShow={isShow} />
  ));
  console.log(dots);
  return <Wrapper>{dots}</Wrapper>;
};
