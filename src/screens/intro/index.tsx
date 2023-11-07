import { FC } from "react";

import * as S from "./styles";
import { DefaultMessages } from "./DefaultMessages";

interface IIntroScreenProps {
  isSelectedOption: boolean | null;
}

export const Intro: FC<IIntroScreenProps> = ({ isSelectedOption }) => (
  <S.Wrapper isClosed={!!isSelectedOption}>
    <DefaultMessages />
  </S.Wrapper>
);
