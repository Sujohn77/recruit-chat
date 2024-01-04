import styled from "styled-components";
import Box from "@mui/material/Box";
import { COLORS } from "utils/colors";

interface IPlaneIconProps {
  disabled: boolean;
}

export const searchItemHeight = 31;
export const searchHeaderHeight = 40;
export const inputOffset = "-30px";

export const MessagesInput = styled(Box)<{ marginTop: string }>`
  min-height: 50px;
  z-index: 1;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  box-sizing: border-box;
  background: ${({ theme: { input } }) => input.backgroundColor};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop};`}

  > button {
    padding: 0px;
    margin: 0;
    margin-right: 10px;
  }
`;

export const SearchWrapper = styled.div<{ searchOptionsHeight: number }>`
  position: absolute;
  width: 100%;
  left: 0;
  top: ${({ searchOptionsHeight }) =>
    -searchOptionsHeight - searchHeaderHeight + "px"};
  color: ${({ theme: { searchResults } }) => searchResults.color};
  font-weight: 500;
  z-index: 1;
`;

export const SearchHeader = styled.div`
  background: ${(props) => props.theme.headerColor};
  color: ${(props) => props.theme.chatbotHeaderTextColor};
  padding: 7px 16px;
  height: ${searchHeaderHeight}px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SubHeader = styled.div`
  background: ${(props) => props.theme.headerColor};
  padding: 10px 16px;
  height: 45px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
`;

export const SearchBody = styled.ul`
  background-color: ${({ theme }) => theme.searchResultsColor};
  display: flex;
  flex-direction: column;
  margin: 0;
  list-style: none;
  padding: 0;
  overflow: auto;
  max-height: 186px;

  div {
    width: 100%;
  }
`;

export const ScrollWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  position: relative;
`;

export const SearchPosition = styled.li`
  min-height: ${searchItemHeight}px;
  box-sizing: border-box;
  width: 100%;
  padding: 7px 16px;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  cursor: pointer;
  width: 100%;

  span {
    font-weight: 700;
  }
`;

export const PlaneIcon = styled.img<IPlaneIconProps>`
  margin-left: auto;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const Close = styled.div<{ color?: string }>`
  position: relative;
  cursor: pointer;
  width: 18px;
  height: 18px;

  &:before,
  &:after {
    content: "";
    height: 17px;
    width: 1.5px;
    background: ${COLORS.GRAY};
    display: inline-block;
    position: absolute;
    top: 1px;
    left: 9px;
  }
  &:before {
    transform: rotate(-45deg);
  }
  &:after {
    transform: rotate(45deg);
  }
`;
