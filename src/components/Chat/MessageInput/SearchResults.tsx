import React, { FC } from "react";
import * as S from "./styles";
import { searchItemheight } from "./styles";

const headerTxt = "Searched category title";
export const maxSearchHeight = 300;
type PropsType = {
  matchedPositions: string[];
  matchedPart: string;
};
export const SearchResults: FC<PropsType> = ({
  matchedPositions,
  matchedPart,
}) => {
  const items = matchedPositions.map((position) => (
    <S.SearchPosition>
      <span>{matchedPart}</span>
      {position}
    </S.SearchPosition>
  ));
  const searchOptionsHeight =
    matchedPositions.length < 10
      ? searchItemheight * matchedPositions.length
      : maxSearchHeight;
  return (
    <S.SearchWrapper searchOptionsHeight={searchOptionsHeight}>
      <S.SearchHeader>{headerTxt}</S.SearchHeader>
      <S.SearchBody>
        <div>{items}</div>
      </S.SearchBody>
    </S.SearchWrapper>
  );
};
