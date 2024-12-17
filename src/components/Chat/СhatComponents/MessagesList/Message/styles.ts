import { CSSProperties } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";

import { COLORS } from "utils/colors";
import { IMessageProps, isValidColor } from "utils/helpers";
import { InfoItem } from "../../ViewJob/styles";

interface ICancelProps {
  disabled?: boolean;
}

interface IMessageContentProps {
  isError?: boolean;
  isFile?: boolean;
  withOptions?: boolean;
  isOwn?: boolean;
}

interface IMessageBoxProps extends IMessageProps {
  nextMessFromSameSender?: boolean;
  border?: string | null;
  isWarningMess?: boolean;
  isError?: boolean;
  maxWidth?: number;
  marginTop?: number;
  isInitMess?: boolean;
  stringStyle?: string;
}

interface IBtnMessProps extends IMessageBoxProps {
  isChatMess?: boolean;
}

interface IMessageTextProps {
  fontWeight?: number;
  withMaxWidth?: boolean;
}

interface ISenderProps {
  isOwn: boolean;
}
interface IWrapperProps {
  position?: CSSProperties["position"];
}

export const MessageBox = styled.div<IMessageBoxProps>`
  position: relative;
  border-radius: 10px;
  font-size: 12px;
  line-height: 17px;
  box-sizing: border-box;
  width: fit-content;
  max-width: ${({ maxWidth = 270 }) => maxWidth}px;
  margin-left: ${({ isOwn = false }) => (isOwn ? "auto" : "initial")};
  cursor: ${({ cursor }) => cursor};
  padding: ${({ padding }) => padding};
  margin-bottom: ${({ nextMessFromSameSender }) =>
    nextMessFromSameSender ? 4 : 26}px;
  background: ${({ isOwn, theme, backgroundColor }) =>
    backgroundColor || isOwn ? theme.primaryColor : theme.messageBubbleColor};
  color: ${({ theme, isOwn }) =>
    isOwn ? theme.userMessageTextColor : theme.messageTextColor};

  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}px;`}
  ${({ border }) => border && `border: ${border};`}
  ${({
    theme,
    backgroundColor,
    isWarningMess,
    isError,
    isOwn = false,
    isInitMess = false,
  }) =>
    !isWarningMess &&
    !isInitMess &&
    `&:after {
      content: '';
      width: 0; 
      height: 0; 
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 13px 20px 0 0;
      border-color: ${
        isError
          ? COLORS.PIPPIN
          : backgroundColor || isOwn
          ? theme.userMessageBubbleColor
          : theme.messageBubbleColor
      } transparent transparent transparent;
      position: absolute;
      bottom: -4px;
      transform:  ${isOwn && "matrix(-1, 0, 0, 1, 0, 0)"} ;
      left:  ${isOwn ? "calc(100% - 20px)" : "0"} ;
    }`};

  ${({ stringStyle }) => stringStyle}
`;

export const Wrapper = styled.div<IWrapperProps>`
  ${({ position }) => position && `position: ${position};`}
`;

export const Sender = styled.div<ISenderProps>`
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: ${COLORS.BLACK};
  padding: 0px 3px;
  text-align: ${({ isOwn }) => (isOwn ? "right" : "left")};
`;

export const Cancel = styled.div<ICancelProps>`
  font-size: 12px;
  line-height: 17px;
  border-bottom: 1px solid ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.primaryColor};
  cursor: pointer;
  margin-top: 0.25em;
  width: fit-content;

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const MessageButton = styled.div<IBtnMessProps>`
  position: relative;
  min-height: 28px;
  font-size: 12px;
  line-height: 17px;
  box-sizing: border-box;
  width: fit-content;
  margin-left: ${({ isOwn = false }) => (isOwn ? "auto" : "initial")};
  color: ${({ theme: { userMessageTextColor } }) => userMessageTextColor};
  cursor: ${({ cursor }) => cursor};
  padding: ${({ padding }) => padding};
  background: ${({ theme, isOwn }) =>
    isOwn ? theme.primaryColor : theme.messageBubbleColor};
  border-radius: 100px;
  margin-bottom: ${({ nextMessFromSameSender }) =>
    nextMessFromSameSender ? 4 : 16}px !important;

  ${({ isChatMess }) =>
    isChatMess && "min-height: 33px;display: flex;align-items: center;"}
`;

export const MessageContent = styled.div<IMessageContentProps>`
  align-items: center;
  display: flex;
  gap: 8px;
  flex-direction: ${({ withOptions }) => (withOptions ? "column" : "row")};
  color: ${({ color, isOwn, theme, isError }) =>
    isError
      ? COLORS.NEW_YORK_PINK
      : isOwn
      ? (isValidColor(color) && color) || theme.userMessageTextColor
      : theme.messageTextColor};

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

export const Text = styled.span`
  font-size: 12px;
`;

export const MessageText = styled.span<IMessageTextProps>`
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  ${({ withMaxWidth = true }) => withMaxWidth && "max-width: 218px;"}
  white-space: pre-line;
  font-weight: ${({ fontWeight = 400 }) => fontWeight};
`;

export const InitialMessage = styled.div`
  color: ${({ theme }) => theme.messageTextColor};
  font-size: 12px;
  line-height: 17px;
  margin-bottom: 32px;
`;

export const TimeText = styled.div`
  color: ${({ theme: { text } }) => text.postedDate};
  white-space: nowrap;
  margin-left: 8px;
  font-size: 10px;
  line-height: 12px;
  width: fit-content;
  display: inline-block;
  color: ${COLORS.GRAY};
`;

export const MessageItem = styled(InfoItem)``;

export const SearchButton = styled(Button)`
  width: fit-content;
  align-self: flex-start;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;
  background: ${(props) => props.theme.primaryColor}!important;
  margin: 1em auto !important;
  border-radius: 20px !important;
  font-size: 12px !important;
  padding: 11px 12px !important;

  span {
    line-height: 17px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;
