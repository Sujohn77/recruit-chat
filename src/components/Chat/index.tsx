import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

import { HeadLine } from "./HeadLine";
import * as S from "./styles";

import { MessagesBody } from "./MessagesBody";

import { MessageInput } from "./MessageInput";

type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
};

export const chatId = 2433044;

export const Chat: FC<PropsType> = ({ setIsSelectedOption, children }) => {
  return (
    <S.Wrapper>
      <HeadLine setIsSelectedOption={setIsSelectedOption} />
      <MessagesBody />
      <MessageInput />
    </S.Wrapper>
  );
};
