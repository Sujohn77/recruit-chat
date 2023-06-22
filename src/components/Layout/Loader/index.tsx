import { FC } from "react";
import * as S from "./styles";

interface ILoaderProps {
  showLoader: boolean;
  absolutePosition?: boolean;
}

// Chat Typing Animation
export const Loader: FC<ILoaderProps> = ({
  showLoader,
  absolutePosition = true,
}) =>
  showLoader ? (
    <S.Wrapper absolutePosition={absolutePosition}>
      {Array.from({ length: 3 }).map((v, index) => (
        <S.Dot key={"dot-" + index} />
      ))}
    </S.Wrapper>
  ) : null;
