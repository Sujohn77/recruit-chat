import styled from "styled-components";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 249px;
  box-sizing: border-box;
  margin: 55px 0 24px;
  position: relative;
  background: ${({ theme: { message } }) => message.backgroundColor};
`;

export const Title = styled.p`
  text-align: center;
  font-variant-caps: petite-caps;
  margin-top: 10px;
  margin-bottom: 5px;
`;

export const Text = styled.span`
  font-size: 12px;
  margin-bottom: 5px;
  text-align: center;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 18px 10px;
  text-align: center;
  background: ${({ theme: { message } }) => message.backgroundColor};
`;

export const Timer = styled.div`
  font-size: 16px;
  color: ${COLORS.PICTON_BLUE};
  margin-bottom: 12px;
  margin-top: 5px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 11px 18px;
`;

export const ClockImg = styled.img`
  width: 20px;
  height: 20px;
  margin: 10px auto;
`;
