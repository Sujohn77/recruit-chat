import styled from 'styled-components';
import { colors } from 'utils/colors';

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.message.chat.backgroundColor};
  padding: 16px 20px;
  border-radius: 20px;
  width: 250px;
  margin: 17px auto 24px !important;
  font-size: 14px;
  box-sizing: border-box;

  animation: fadeHeight 0.6s ease-in-out !important;

  @keyframes fadeHeight {
    0% {
      transform: scale(0.65) translate(-120px, 80px);
      opacity: 0;
      height: 0;
    }

    100% {
      transform: scale(1) translate(0);
      opacity: 1;
      height: 184px;
    }
  }
`;

export const InputDescription = styled.p`
  margin: 16px 0 24px;
  color: rgba(0, 0, 0, 0.5);

  text-align: center;
`;

export const EmailSentText = styled.p`
  margin-top: 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: ${colors.black};
  opacity: 0.5;
`;
