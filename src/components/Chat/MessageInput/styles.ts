import Box from "@mui/material/Box";
import styled from "styled-components";
import { colors } from "utils/colors";

export const searchItemheight = 32;
export const searchHeaderHeight = 40;
export const MessagesInput = styled(Box)`
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 24px 16px;
  box-sizing: border-box;
  background: #efefef;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  
`;

export const SearchWrapper = styled.div<{searchOptionsHeight:number}>`
    position: absolute;
    width: 100%;
    left: 0;
    top: ${({searchOptionsHeight}) => -searchOptionsHeight - searchHeaderHeight  + 'px'}
`;

export const SearchHeader = styled.div`
    background: ${colors.alto};
    padding: 7px 16px;
    height: ${searchHeaderHeight}px;
    box-sizing: border-box;
`;
export const SearchBody = styled.div`
    background: ${colors.darkGrey};

    display: flex;
`;

export const SearchPosition = styled.div`
    height: ${searchItemheight};
    width:100%;
    padding: 7px 16px;
    font-size: 14px;
    line-height: 17px;

    span{
        font-weight: 700;
    }
`;

export const PlaneIcon = styled.img`
    margin-left: auto;
`;