import React, { Dispatch, FC, SetStateAction } from "react";

import * as S from "./styles";

// import { Images } from "../../utils/constants";
import SEARCH_ICON from "../../assets/imgs/search.png";
import QUESTION from "../../assets/imgs/question.png";
import ROB_FACE from "../../assets/imgs/rob-face.png";
import { useChatMessanger } from "contexts/MessangerContext";

export enum CHAT_OPTIONS {
  FIND_JOB = "FIND JOB",
  ASK_QUESTION = "ASK QUESTION",
}
export const Images = {
  SEARCH_ICON,
  QUESTION,
  ROB_FACE,
};
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
type PropsType = {
  setIsSelectedOption: Dispatch<SetStateAction<boolean>>;
};

export const Intro: FC<PropsType> = ({ setIsSelectedOption }) => {
  const { setOption } = useChatMessanger();

  const onClick = (option: CHAT_OPTIONS) => {
    setIsSelectedOption(true);
    setOption(option);
  };

  const chooseOptions = messages.options.map((opt, index) => (
    <S.Message key={`chat-option-${index}`} onClick={() => onClick(opt.option)}>
      {opt.icon && <S.Image src={opt.icon} size={opt.size} alt={""} />}
      <S.Text>{opt.message}</S.Text>
    </S.Message>
  ));

  return (
    <S.Wrapper>
      <S.Flex>
        <S.ImageButton>
          <S.IntroImage src={Images.ROB_FACE} size="57px" alt="rob-face" />
        </S.ImageButton>
        <S.InfoContent>
          <S.Question>{messages.sayHello}</S.Question>
          <S.Options>{chooseOptions}</S.Options>
        </S.InfoContent>
      </S.Flex>
      <S.Close height="12px" />
    </S.Wrapper>
  );
};
