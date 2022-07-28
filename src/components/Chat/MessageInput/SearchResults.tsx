import { AutocompleteGroupedOption, useAutocomplete } from "@mui/material";
import { useChatMessanger } from "components/Context/MessangerContext";
import React, { Dispatch, FC, SetStateAction, MouseEvent } from "react";
import { Close } from "screens/intro/styles";
import { colors } from "utils/colors";
import { CHAT_ACTIONS } from "utils/types";
import * as S from "./styles";
import { searchItemheight } from "./styles";

export const maxSearchHeight = 300;
interface IGetOptionProps {
  option: any;
  index: number;
}
type PropsType = {
  matchedItems: string[];
  matchedPart: string;
  headerName: string;
  type: CHAT_ACTIONS.SET_CATEGORY | CHAT_ACTIONS.SET_LOCATIONS;
  onClick?: (event?: MouseEvent<HTMLLIElement>) => void;
  getOptionProps?: ({
    option,
    index,
  }: IGetOptionProps) => React.HTMLAttributes<HTMLLIElement>;
  getListboxProps?: () => React.HTMLAttributes<HTMLUListElement>;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
};
export const SearchResults: FC<PropsType> = ({
  matchedItems,
  matchedPart,
  headerName,
  type,
  getOptionProps,
  onClick,
  getListboxProps = () => ({}),
  setIsFocus,
}) => {
  const items = matchedItems.map((option, index) => {
    const optionProps = getOptionProps && getOptionProps({ option, index });

    return (
      <S.SearchPosition
        key={`search-item-${type}-${index}`}
        {...optionProps}
        onClick={(e) => {
          onClick && onClick(e);
          optionProps?.onClick && optionProps.onClick(e);
          setIsFocus(false);
        }}
      >
        <span>{matchedPart}</span>
        {option}
      </S.SearchPosition>
    );
  });
  const searchOptionsHeight =
    matchedItems.length < 10
      ? searchItemheight * matchedItems.length
      : maxSearchHeight;
  return (
    <S.SearchWrapper searchOptionsHeight={searchOptionsHeight}>
      <S.SearchHeader>
        {headerName}
        <Close color={colors.gray} onClick={() => setIsFocus(false)} />
      </S.SearchHeader>
      <S.SearchBody {...getListboxProps()}>{items}</S.SearchBody>
    </S.SearchWrapper>
  );
};
