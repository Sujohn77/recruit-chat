import { FC } from "react";

import * as S from "./styles";

import { isMobile } from "utils/constants";
import { Initialization } from "./IntroSome/initialization";

interface IIntroScreenProps {
  isSelectedOption: boolean | null;
  isClosed: boolean;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Intro: FC<IIntroScreenProps> = ({
  isSelectedOption,
  setIsClosed,
  isClosed,
}) => (
  <S.Wrapper isSelectedOption={isSelectedOption} isMobile={isMobile}>
    <Initialization isClosed={isClosed} setIsClosed={setIsClosed} />
  </S.Wrapper>
);
