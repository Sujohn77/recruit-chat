import styled from "styled-components";
import { COLORS } from "utils/colors";

import { Slide } from "../MessagesList/Message/JobOffers/styles";
import { DarkButton } from "components/Layout/styles";
import { MenuItemWrapper } from "components/Chat/СhatComponents/BurgerMenu/MenuItem/styles";

export const ViewBody = styled.div`
  position: absolute;
  top: 60px;
  background: ${COLORS.WHITE};
  padding: 0 16px 38px;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
  font-weight: 400;
  animation: fade-in 0.25s ease-in forwards;
  opacity: 0;
  z-index: 1;

  @keyframes fade-in {
    0% {
      opacity: 0.7;
      transform: translateX(200px);
    }
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
`;

export const BackButton = styled(Slide)`
  transform: rotate(225deg);
  width: 0.6em;
  height: 0.6em;
  position: absolute;
  left: 24px;
  top: 28px;
  cursor: pointer;

  &:before,
  &:after {
    border-color: ${({ theme }) => theme.chatbotHeaderTextColor};
  }
`;

export const p = styled.div`
  margin: 0;
`;

export const HeaderTitle = styled.div``;

export const TextTitle = styled.h3`
  margin: 0 0 16px;
  padding: 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

export const ViewShortInfo = styled.div`
  border-bottom: 1px solid ${COLORS.ALTO};
  margin-bottom: 15px;
`;

export const ShortItems = styled.div`
  margin-bottom: 15px;
`;

export const InfoItem = styled(MenuItemWrapper)`
  border-bottom: none !important;
  margin-top: 8px;
  padding: 0;
  color: ${COLORS.BLACK};

  &:before {
    content: "";
    background: ${(props) => props.theme.primaryColor};
    display: inline-block;
    margin-right: 8px;
    width: 10px;
    border-radius: 50%;
    height: 10px;
    margin-top: 4px;
  }
`;

export const ViewText = styled.div`
  margin: 0 0px 32px;
  white-space: pre-line;
  line-height: 17px;
  font-size: 12px;

  p {
    margin: 0 0 12px;
  }
`;

export const ViewDescription = styled.div`
  margin: 0 0 32px;
  p {
    margin: 0 0px 32px;
  }
  b {
    line-height: 32px;
    font-size: 15px;
  }
  ul {
    padding: 0 0 0 12px;
    li {
      line-height: 20px;
      margin: 0 0 8px;
    }
  }
  white-space: pre-line;
  line-height: 22px;
  font-size: 12px;
`;

export const TextHeaderTitle = styled.div`
  font-size: 20px;
  line-height: 24px;
  margin: 24px 0px;
`;

export const SubmitButton = styled(DarkButton)`
  width: 262px;
  text-align: center;
  margin: 0 auto !important;
  display: block !important;
  cursor: pointer;
`;

export const Error = styled.div`
  display: flex;
  align-items: center;
  background: ${COLORS.PIPPIN};
  border: 1px solid ${COLORS.NEW_YORK_PINK};
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

export const ErrorText = styled.span`
  color: ${COLORS.NEW_YORK_PINK};
  font-size: 12px;
  width: 85%;
  padding-left: 14px;
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;
