import { useChatMessanger } from "components/Context/MessangerContext";
import React, { Dispatch, FC, SetStateAction } from "react";
import { CHAT_TYPE_MESSAGES } from "utils/types";
import * as S from "./styles";
import { searchItemheight } from "./styles";

const headerTxt = "Searched category title";
export const maxSearchHeight = 300;
type PropsType = {
  matchedPositions: string[];
  matchedPart: string;
  setDraftMessage: Dispatch<SetStateAction<string | null>>;
};
export const SearchResults: FC<PropsType> = ({
  matchedPositions,
  matchedPart,
  setDraftMessage,
}) => {
  const { addMessage } = useChatMessanger();
  const items = matchedPositions.map((position) => (
    <S.SearchPosition
      onClick={() => {
        setDraftMessage(null);
        addMessage({
          text: matchedPart + position,
          subType: CHAT_TYPE_MESSAGES.JOB_POSITIONS,
        });
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
      <S.SearchHeader>{headerTxt}</S.SearchHeader>
      <S.SearchBody>
        <div>{items}</div>
      </S.SearchBody>
    </S.SearchWrapper>
  );
};
