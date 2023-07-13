import styled from "styled-components";

import { COLORS } from "utils/colors";
import { Close, Flex } from "../../../../screens/Intro/styles";

export const ChatHeaderWrapper = styled.div`
  height: 60px;
  background: ${(props) => props.theme.headerColor};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${COLORS.WHITE};
  margin-right: 12px;
  border-radius: 50%;
`;

export const Title = styled.h3`
  font-family: Inter-Bold;
  font-size: 16px;
  line-height: 19px;
  margin: 0;
  margin-left: 15px;
  color: ${(props) => props.theme.chatbotHeaderTextColor};
`;

export const ViewTitle = styled.h3`
  margin: 0 auto;
  font-size: 14px;
  line-height: 17px;
  font-family: Inter;
  font-weight: 500;
`;

export const CloseChat = styled(Close)`
  position: relative;
  margin-left: auto;
  height: 18px;
  width: 18px;
  top: initial;
  right: 10px;
  cursor: pointer;
`;

export const ViewHeader = styled(Flex)``;
