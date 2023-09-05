import styled from "styled-components";
import { Close } from "screens/Intro/styles";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 16px 18px;
  width: 249px;
  display: flex;
  flex-flow: column;
  gap: 20px;
  box-sizing: border-box;
  margin: 55px 0 24px;
  position: relative;
`;

export const HeaderTitle = styled.div``;

export const CloseLogin = styled(Close)`
  position: absolute;
  top: -21px;
  right: -17px;
  height: 18px;
  width: 18px;
  cursor: pointer;
`;

export const WarningImg = styled.img`
  width: 12px;
  height: 12px;
  margin-top: 10px;
  margin-right: 8px;
`;

export const Error = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${COLORS.PERSIAN_RED};
`;
