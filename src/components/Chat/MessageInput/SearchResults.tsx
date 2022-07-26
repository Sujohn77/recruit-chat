import { useChatMessanger } from "components/Context/MessangerContext";
import React, { Dispatch, FC, SetStateAction } from "react";
import * as S from "./styles";
import { searchItemheight } from "./styles";

export const maxSearchHeight = 300;
type PropsType = {
  matchedPositions: string[];
  matchedPart: string;
  headerName: string;
  setDraftMessage: Dispatch<SetStateAction<string | null>>;
};
export const SearchResults: FC<PropsType> = ({
  matchedPositions,
  matchedPart,
  headerName,
  setDraftMessage,
}) => {
  const { selectJobPosition } = useChatMessanger();
  const items = matchedPositions.map((position) => (
    <S.SearchPosition
      onClick={() => {
        setDraftMessage(null);
        selectJobPosition(matchedPart + position);
      }}
    >
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
      <S.SearchHeader>{headerName}</S.SearchHeader>
      <S.SearchBody>
        <div>{items}</div>
      </S.SearchBody>
    </S.SearchWrapper>
  );
};
