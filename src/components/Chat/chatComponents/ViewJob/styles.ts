import styled from "styled-components";
import { colors } from "utils/colors";

import { Slide } from "../MessagesList/Message/JobOffers";
import { DarkButton } from "components/Layout/styles";
import { MenuItemWrapper } from "components/Layout/BurgerMenu/MenuItem/styles";

export const ViewBody = styled.div`
  position: absolute;
  top: 60px;
  background: ${colors.white};
  padding: 0 16px 38px;
  overflow: auto;
  height: 480px;
  box-sizing: border-box;
  font-family: Inter-Medium;
  font-weight: 500;
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
    border-color: #000;
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
  padding: 0 0 16px;
  border-bottom: 1px solid ${colors.alto};
  margin-bottom: 24px;
`;

export const ShortItems = styled.div`
  padding: 0 0 12px;
`;

export const InfoItem = styled(MenuItemWrapper)`
  border-bottom: none !important;
  margin-bottom: 8px;
  padding: 0;
  color: ${colors.black};
`;

export const ViewText = styled.div`
  margin: 0 0px 32px;
  white-space: pre-line;
  line-height: 17px;
  font-size: 14px;

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
  font-size: 14px;
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
