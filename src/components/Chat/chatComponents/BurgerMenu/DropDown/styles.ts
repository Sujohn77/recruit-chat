import styled from "styled-components";
import { COLORS } from "utils/colors";

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  position: absolute;
  border-radius: 5px;
  padding: 0 17px;
  animation: fade-in 0.1s ease-in forwards;
  right: -85px;
  top: -36px;
  opacity: 0;
  z-index: 1;
  cursor: pointer;

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Option = styled.li`
  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.SILVER_DARK};
  }
  padding: 11px 21px 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-transform: uppercase;
  margin: 0;
  color: ${(props) => props.theme.primaryColor};
`;
