import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "utils/colors";
import { HeadLine } from "./HeadLine";
import { mockData } from "./mockData";

import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export const MessagesArea = styled.div`
  height: 400px;
  padding: 16px;
  border-bottom: 1px solid ${colors.alto};
`;

export const MessagesInput = styled(Box)`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 24px 16px;
  box-sizing: border-box;
  background: #efefef;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const Message = styled.span`
  // margin-left: 1em;
  color: ${colors.silverChalice};
`;

const InitialMessage = styled.div`
  color: ${colors.dustyGray};
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 32px;
`;

type PropsType = {
  children: React.ReactNode | React.ReactNode[];
};

const botTypingTxt = "Bot is typing...";
export const Chat: FC<PropsType> = ({ children }) => {
  return (
    <div>
      <HeadLine />

      <MessagesArea>
        <InitialMessage>{mockData.initialMessage}</InitialMessage>
        {children}
      </MessagesArea>

      <MessagesInput position="static">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Message>{botTypingTxt}</Message>
      </MessagesInput>
    </div>
  );
};
