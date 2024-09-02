import { FC } from "react";
import * as S from "./styles";

interface ILoaderProps {
  showLoader: boolean;
  absolutePosition?: boolean;
  margin?: string;
}

// Chat Typing Animation
export const Loader: FC<ILoaderProps> = ({
  showLoader,
  margin,
  absolutePosition = true,
}) =>
  showLoader ? (
    <S.Wrapper absolutePosition={absolutePosition} margin={margin}>
      {Array.from({ length: 3 }).map((v, index) => (
        <S.Dot key={"dot-" + index} />
      ))}
    </S.Wrapper>
  ) : null;
