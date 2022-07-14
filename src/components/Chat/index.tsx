import React, { FC } from "react";
import styled from "styled-components";
import { HeadLine } from "./HeadLine";

export const MessagesArea = styled.div`
  height: 500px;
`;
export const MessagesInput = styled.div`
  height: 50px;
`;

type PropsType = {
  children: React.ReactNode | React.ReactNode[];
};

export const Chat: FC<PropsType> = ({ children }) => {
  return (
    <div>
      <HeadLine />
      <MessagesArea>{children}</MessagesArea>
      <MessagesInput></MessagesInput>
    </div>
  );
};
