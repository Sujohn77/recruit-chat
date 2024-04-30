import { FC } from "react";

import * as S from "./styles";
import { Initialization } from "./Initialization";
import { isMobile } from "utils/constants";

interface IIntroScreenProps {
  isSelectedOption: boolean | null;
}

export const Intro: FC<IIntroScreenProps> = ({ isSelectedOption }) => (
  <S.Wrapper isClosed={!!isSelectedOption} isMobile={isMobile}>
    <Initialization />
  </S.Wrapper>
);
