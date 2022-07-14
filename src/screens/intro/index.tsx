import React from "react";

import * as S from "./styles";
import { Images } from "../../utils/constants";
import { useHistory } from "react-router-dom";

// TODO: connect firebase with messages
const messages = {
  sayHello: "Hi! Are you looking for a job",
  options: [
    {
      icon: Images.SEARCH_ICON,
      message: "Find a job",
      path: "/findJob",
      size: "20px",
    },
    {
      icon: Images.QUESTION,
      message: "Ask a question",
      path: "/faq",
      size: "16px",
    },
  ],
};

export const Intro = () => {
  const history = useHistory();
  const chooseOptions = messages.options.map((opt) => (
    <S.Message onClick={() => history.push(opt.path)}>
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
