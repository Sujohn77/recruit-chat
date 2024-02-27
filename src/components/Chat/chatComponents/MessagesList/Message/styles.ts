import { Button } from "@material-ui/core";
import styled from "styled-components";

import { COLORS } from "utils/colors";
import { IMessageProps, isValidColor } from "utils/helpers";
import { InfoItem } from "../../ViewJob/styles";

interface ICancelProps {
  disabled?: boolean;
}

interface IMessageContentProps {
  isFile?: boolean;
  withOptions?: boolean;
  isOwn?: boolean;
}

interface IMessageBoxProps extends IMessageProps {
  border?: string | null;
  isWarningMess?: boolean;
}

interface IMessageTextProps {
  fontWeight?: number;
}

export const MessageBox = styled.div<IMessageBoxProps>`
  position: relative;
  border-radius: 10px;
  min-height: 41px;
  font-size: 14px;
  line-height: 17px;
  box-sizing: border-box;
  width: fit-content;
  max-width: 270px;
  margin-left: ${({ isOwn = false }) => (isOwn ? "auto" : "initial")};
  color: ${({ theme: { message, messageTextColor }, isOwn }) =>
    isOwn
      ? (isValidColor(messageTextColor) && COLORS.WHITE) || message?.own.color
      : message?.chat.color};
  cursor: ${({ cursor }) => cursor};
  padding: ${({ padding }) => padding};
  margin-bottom: 24px;
  background: ${({ isOwn, theme, backgroundColor: backColor }) =>
    backColor || isOwn
      ? theme.primaryColor
      : theme.message.chat.backgroundColor};

  ${({ border }) => border && `border: ${border};`}

  ${({ isOwn = false, theme, backgroundColor: backColor, isWarningMess }) =>
    !isWarningMess &&
    `&:after {
      content: '';
      width: 0; 
      height: 0; 
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 20px 20px 0 0;
      border-color: ${
        backColor || isOwn
          ? theme.primaryColor
          : theme.message.chat.backgroundColor
      } transparent transparent transparent;
      position: absolute;
      bottom: -12px;
      transform:  ${isOwn && "matrix(-1, 0, 0, 1, 0, 0)"} ;
      left:  ${isOwn ? "calc(100% - 20px)" : "0"} ;
    }`};
`;

export const Cancel = styled.div<ICancelProps>`
  font-size: 14px;
  line-height: 17px;
  border-bottom: 1px solid ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.primaryColor};
  cursor: pointer;
  margin-top: 0.25em;
  width: fit-content;

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const MessageButton = styled.div<IMessageProps>`
  position: relative;
  min-height: 41px;
  font-size: 14px;
  line-height: 17px;
  box-sizing: border-box;
  width: fit-content;
  max-width: 270px;
  margin-left: ${({ isOwn = false }) => (isOwn ? "auto" : "initial")};
  color: ${({
    theme: {
      message: { button },
    },
  }) => button.color};
  cursor: ${({ cursor }) => cursor};
  padding: ${({ padding }) => padding};
  background: ${({ theme }) => theme.messageButtonColor};

  border-radius: 100px;
  margin-bottom: 16px !important;
`;

export const MessageContent = styled.div<IMessageContentProps>`
  align-items: center;
  display: flex;
  gap: 8px;
  flex-direction: ${({ withOptions }) => (withOptions ? "column" : "row")};
  color: ${({ color, isOwn, theme }) =>
    isOwn
      ? (isValidColor(color) && COLORS.WHITE) || theme.message?.own.color
      : theme.message?.chat.color};

  ${({ isFile, theme }) =>
    isFile &&
    `
        background:${COLORS.WHITE};
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
            color: ${theme.primaryColor}
        }
    `}
`;

export const MessageText = styled.span<IMessageTextProps>`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 218px;
  white-space: pre-line;
  font-weight: ${({ fontWeight = 500 }) => fontWeight};
`;

export const InitialMessage = styled.div`
  color: ${({ theme: { message } }) => message.chat.color};
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

export const ActionButton = styled(Button)`
  color: ${({ theme: { button } }) => button.secondaryColor};
  width: fit-content;
  align-self: flex-start;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  background: ${(props) => props.theme.primaryColor}!important;
  margin: 1em 0 !important;
  border-radius: 20px !important;
  font-size: 14px !important;
  padding: 11px 12px !important;

  span {
    line-height: 17px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;
