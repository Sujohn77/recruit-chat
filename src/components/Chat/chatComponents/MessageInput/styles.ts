import styled from "styled-components";
import Box from "@mui/material/Box";

export const searchItemHeight = 31;
export const searchHeaderHeight = 40;
export const inputOffset = "-30px";

export const MessagesInput = styled(Box)<{ offset: string | boolean }>`
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
  margin-top: ${({ offset }) => !!offset && offset.toString()};

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
  padding: 7px 16px;
  height: ${searchHeaderHeight}px;
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

export const SearchPosition = styled.li`
  height: ${searchItemHeight}px;
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

export const PlaneIcon = styled.img`
  margin-left: auto;
  cursor: pointer;
`;
