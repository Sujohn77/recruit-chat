import React from "react";

import * as S from "./styles";
import { Images } from "../../utils/constants";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOption } from "redux/slices";

export enum CHAT_OPTIONS {
  FIND_JOB = "FIND JOB",
  ASK_QUESTION = "ASK QUESTION",
}

// TODO: connect firebase with messages
const messages = {
  sayHello: "Hi! Are you looking for a job",
  options: [
    {
      icon: Images.SEARCH_ICON,
      message: "Find a job",
      option: CHAT_OPTIONS.FIND_JOB,
      size: "20px",
    },
    {
      icon: Images.QUESTION,
      message: "Ask a question",
      option: CHAT_OPTIONS.ASK_QUESTION,
      size: "16px",
    },
  ],
};
// type PropsType = {};

export const Intro = () => {
  const dispatch = useDispatch();
  const chooseOptions = messages.options.map((opt) => (
    <S.Message onClick={() => dispatch(setOption(opt.option))}>
      {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={""} />}
      <S.Text>{opt.message}</S.Text>
    </S.Message>
  ));

  return (
    <S.Wrapper>
      <S.Flex>
        <S.Image src={Images.ROB_FACE} size="60px" alt="rob-face" />
        <S.InfoContent>
          <S.Question>{messages.sayHello}</S.Question>
          <S.Options>{chooseOptions}</S.Options>
        </S.InfoContent>
      </S.Flex>
      <S.Close />
    </S.Wrapper>
  );
};
