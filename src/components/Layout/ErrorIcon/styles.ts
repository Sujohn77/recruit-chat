import styled from "styled-components";
import { COLORS } from "utils/colors";

const wrapperSize = "20px";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${wrapperSize};
  height: ${wrapperSize};
  border-radius: 50%;
  background-color: ${COLORS.TORCH_RED};
`;

export const ExclamationMark = styled.span`
  color: ${COLORS.WHITE};
  font-size: 16px;
  font-weight: bolder;
`;
