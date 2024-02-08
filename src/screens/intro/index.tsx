import { FC } from "react";

import * as S from "./styles";
import { Initialization } from "./Initialization";

interface IIntroScreenProps {
  isSelectedOption: boolean | null;
}

export const Intro: FC<IIntroScreenProps> = ({ isSelectedOption }) => (
  <S.Wrapper isClosed={!!isSelectedOption}>
    <Initialization />
  </S.Wrapper>
);
