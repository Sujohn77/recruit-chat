import { InfoItem } from 'components/Chat/ViewJob/styles';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { IMessageProps } from 'utils/helpers';

export const MessageBox = styled.div<IMessageProps>`
  position: relative;
  border-radius: 10px;
  min-height: 41px;
  font-size: 14px;
  line-height: 17px;
  box-sizing: border-box;
  width: fit-content;
  max-width: 270px;
  margin-left: ${({ isOwn = false }) => (isOwn ? 'auto' : 'initial')};
  color: ${({ theme: { message }, isOwn }) =>
    isOwn
      ? message?.own.color || colors.white
      : message?.chat.color || colors.dustyGray};
  cursor: ${({ cursor }) => cursor};
  padding: ${({ padding }) => padding};
  background: ${({ isOwn, theme: { message } }) =>
    isOwn
      ? message?.own.background || colors.boulder
      : message?.chat.background || colors.alto};
  ${({ backColor = '#D9D9D9', isOwn = false }) => `margin-bottom: 24px;
        &:after {
            content: '';
            width: 0; 
            height: 0; 
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 20px 20px 0 0;
            border-color: ${backColor} transparent transparent transparent;
            position: absolute;
            bottom: -12px;
            transform:  ${isOwn && 'matrix(-1, 0, 0, 1, 0, 0)'} ;
            left:  ${isOwn ? 'calc(100% - 20px)' : '0'} ;
        }   
    `};
`;

export const MessageButton = styled.div<IMessageProps>`
  position: relative;
  border-radius: 10px;
  min-height: 41px;
  font-size: 14px;
  line-height: 17px;
  box-sizing: border-box;
  width: fit-content;
  max-width: 270px;
  margin-left: ${({ isOwn = false }) => (isOwn ? 'auto' : 'initial')};
  color: ${({ theme: { button }, isOwn }) =>
    isOwn ? button.own.color : button.chat.color};
  cursor: ${({ cursor }) => cursor};
  padding: ${({ padding }) => padding};
  background: ${({ isOwn, theme: { button } }) =>
    isOwn ? button.own.background : button.chat.background};
  border-radius: 100px;
  margin-bottom: 16px !important;
`;

export const MessageContent = styled.div<{ isFile?: boolean }>`
  align-items: center;
  display: flex;
  gap: 8px;
  ${({ isFile, theme: { message } }) =>
    isFile &&
    `
        background:${message.file.background}
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
  white-space: pre-line;
`;

export const InitialMessage = styled.div`
  color: ${({ theme: { message } }) => message.initial.color};
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 32px;
`;
export const MessageUnsendIcon = styled.img`
  width: 12px;
  height: 12px;
  filter: invert(1);
`;
export const TimeText = styled.div`
  color: ${({ theme: { text } }) => text.postedDate};
  white-space: nowrap;
  font-size: 10px;
  line-height: 12px;
  margin-top: auto;
  margin-left: 8px;
  width: fit-content;
  display: inline-block;
`;

export const MessageItem = styled(InfoItem)``;
