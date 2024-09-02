import styled from "styled-components";
import AnimateHeight from "react-animate-height";

import { DarkButton } from "components/Layout/styles";
import { COLORS } from "utils/colors";

export const HeightWrapper = styled(AnimateHeight)`
  background: ${COLORS.ALABASTER}88;
  margin-top: 10px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Button = styled(DarkButton)`
  font-weight: 500 !important;
  margin-bottom: 8px !important;
  min-height: 35px !important;
  padding: 8px !important;
  width: 40%;
  height: auto;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Question = styled.div<{ isOpen: boolean }>`
  width: 100%;
  height: 45px;

  border-bottom: 1px solid ${COLORS.CHINESE_SILVER};
  border-left: 1px solid ${COLORS.CHINESE_SILVER};
  border-right: 1px solid ${COLORS.CHINESE_SILVER};
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 400;
  padding: 0px 8px;
  box-sizing: border-box;
  transition: all 0.2s ease-in;

  ${({ isOpen }) =>
    !isOpen &&
    `&:nth-child(3) {
      border-radius: 0px 0px 8px 8px;
    }`}

  &:last-child {
    border-radius: 0px 0px 8px 8px;
  }
  &:first-child {
    border-top: 1px solid ${COLORS.CHINESE_SILVER};
    border-radius: 8px 8px 0px 0px;
  }
`;
