import styled from "styled-components";
import { colors } from "utils/colors";
import { IMessageProps } from "utils/helpers";

export const MessageBox = styled.div<IMessageProps>`
    position: relative;
    border-radius: 10px;
    min-height: 41px;
    padding: ${({padding}) => padding};
    font-size: 14px;
    line-height: 17px;
    background: ${({backColor = '#D9D9D9'})=> backColor};
    color: ${({color = '#969696'})=> color};
    box-sizing: border-box;
    width: fit-content;
    max-width: 250px;
    margin-left: ${({isOwn = false}) => isOwn ? 'auto' : 'initial'};
    margin-bottom: 24px;
    cursor: ${({cursor})=> cursor};
    padding-right: 28px;
    &:after {
        content: '';
        width: 0; 
        height: 0; 
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 20px 20px 0 0;
        border-color: ${({backColor = '#D9D9D9'})=> backColor} transparent transparent transparent;
        position: absolute;
        bottom: -12px;
        transform: ${({isOwn = false}) => isOwn && 'matrix(-1, 0, 0, 1, 0, 0)'};
        left: ${({isOwn = false}) => isOwn ? 'calc(100% - 20px)' : '0'};
    }   
  
`;

export const MessageContent = styled.div<{isFile?:boolean}>`
    align-items: center;
    display: flex;
    gap: 8px;
    ${({isFile}) => isFile && `
        background: #B0B0B0;
        border-radius: 8px;
        padding: 8px;
        height: 35px;
        box-sizing: border-box;
        padding-right: 15px;
        img {
            filter: brightness(1) contrast(3);
        }
        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 175px;
            overflow: hidden;
        }
    `}
 
`;

export const MessageText = styled.p`
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 218px;
`;

export const InitialMessage = styled.div`
  color: ${colors.dustyGray};
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 32px;
`;
export const MessageUnsendIcon = styled.img`
    width: 12px;
    height: 12px;
    filter: invert(1);
    position: absolute;
    right: 10px;
`;