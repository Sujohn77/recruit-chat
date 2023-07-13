import styled from "styled-components";
import { Button } from "@mui/material";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  margin: 0 0 0 16px;
  animation: fadeHeight 0.6s ease-in;

  @keyframes fadeHeight {
    0% {
      transform: translate(0, 80px);
      opacity: 0;
      height: 0;
    }

    100% {
      transform: translate(0);
      opacity: 1;
      height: 250px;
    }
  }
`;

export const InputDescription = styled.p`
  margin: 16px 0 24px;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
`;

export const EmailSentText = styled.p`
  margin: 16px 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: ${COLORS.BLACK};
  opacity: 0.5;
`;

export const OtpSentText = styled(EmailSentText)`
  margin: 0;
`;

export const OtpContent = styled.div`
  > div:first-child {
    max-width: 225px;
    box-sizing: border-box;
    white-space: pre-wrap;
    padding: 12px 16px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: ${COLORS.DUSTY_GRAY};
    font-family: Inter-Medium;
  }
`;

export const ImageButton = styled(Button)`
  min-width: 34px !important;
  height: 34px;
  width: 34px;
  flex-shrink: 1;
  border-radius: 50% !important;
  background: ${COLORS.ALTO}!important;
  text-align: center !important;
  line-height: 34px;
  box-sizing: border-box;
`;

export const IntroImageButton = styled(ImageButton)`
  margin-top: 3em !important;
`;
