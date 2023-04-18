import { FC } from "react";
import * as S from "./styles";

export const Loader: FC = () => (
  <S.Wrapper>
    {Array.from({ length: 3 }).map((v, index) => (
      <S.Dot key={"dot-" + index} />
    ))}
  </S.Wrapper>
);
