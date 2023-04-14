import React, { Dispatch, FC, SetStateAction, MouseEvent } from "react";
import map from "lodash/map";

import { Close } from "screens/intro/styles";
import { colors } from "utils/colors";
import * as S from "./styles";
import { searchItemHeight } from "./styles";

export const maxSearchHeight = 186;

interface IGetOptionProps {
  option: any;
  index: number;
}

type PropsType = {
  matchedItems: string[];
  matchedPart: string;
  headerName: string;
  onClick?: (event?: MouseEvent<HTMLLIElement>) => void;
  getOptionProps?: ({
    option,
    index,
  }: IGetOptionProps) => React.HTMLAttributes<HTMLLIElement>;
  getListboxProps?: () => React.HTMLAttributes<HTMLUListElement>;
  setIsShowResults: Dispatch<SetStateAction<boolean>>;
};

export const SearchResults: FC<PropsType> = ({
  matchedItems,
  matchedPart,
  headerName,
  getOptionProps,
  onClick,
  setIsShowResults,
  getListboxProps = () => ({}),
}) => {
  const items = map(matchedItems, (option, index) => {
    const optionProps = getOptionProps && getOptionProps({ option, index });

    return (
      <S.SearchPosition
        key={`search-item-${index}`}
        {...optionProps}
        onClick={(e) => {
          onClick && onClick(e);
          optionProps?.onClick && optionProps.onClick(e);
        }}
      >
        <span>{matchedPart}</span>
        {option}
      </S.SearchPosition>
    );
  });

  const searchOptionsHeight =
    matchedItems.length < 6
      ? searchItemHeight * matchedItems.length + 1
      : maxSearchHeight;

  return (
    <S.SearchWrapper searchOptionsHeight={searchOptionsHeight}>
      <S.SearchHeader>
        {headerName}
        <Close color={colors.gray} onClick={() => setIsShowResults(false)} />
      </S.SearchHeader>
      <S.SearchBody {...getListboxProps()}>{items}</S.SearchBody>
    </S.SearchWrapper>
  );
};
