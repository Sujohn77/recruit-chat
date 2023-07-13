import styled from "styled-components";
import { Flex } from "screens/Intro/styles";
import { COLORS } from "utils/colors";
import { MessageBox } from "../styles";

export const Wrapper = styled(MessageBox)`
  padding: 12px 16px;
  width: 250px;
`;

export const Section = styled.div`
  /* border-bottom: 1px solid ${COLORS.SILVER_CHALICE}; */

  > button {
    margin: 0 6px 16px !important;
    width: calc(100% - 12px) !important;
  }
`;

export const Title = styled.p`
  margin: 0 0 16px;
`;

export const Text = styled.p`
  margin: 16px 0;
`;

export const FeedbackIconWrapper = styled.div<{ isReversed: boolean }>`
  height: 40px;
  width: 40px;
  background: ${COLORS.WHITE};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  &:active {
    border: 1px solid ${COLORS.BLACK};
  }

  img {
    transform: ${({ isReversed }) => isReversed && `rotate(180deg)`};
  }
`;

export const FeedBackIcons = styled(Flex)`
  gap: 40px;
  justify-content: center;
  user-select: none;
`;
