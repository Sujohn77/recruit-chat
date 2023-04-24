import React, { Dispatch, FC, SetStateAction, MouseEvent } from "react";
import map from "lodash/map";

import * as S from "./styles";
import { searchItemHeight } from "./styles";
import { Close } from "screens/Intro/styles";
import { colors } from "utils/colors";

interface IGetOption {
  option: any;
  index: number;
}

interface ISearchResultsProps {
  matchedItems: string[];
  matchedPart: string;
  headerName: string;
  setIsShowResults: Dispatch<SetStateAction<boolean>>;
  onClick?: (event?: MouseEvent<HTMLLIElement>) => void;
  getListboxProps?: () => React.HTMLAttributes<HTMLUListElement>;
  getOptionProps?: (props: IGetOption) => React.HTMLAttributes<HTMLLIElement>;
}

export const maxSearchHeight = 186;

export const SearchResults: FC<ISearchResultsProps> = ({
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
        onClick={(event: MouseEvent<HTMLLIElement>) => {
          onClick?.(event);
          optionProps?.onClick?.(event);
        }}
      >
        <span>{matchedPart}</span>
        {option}
      </S.SearchPosition>
    );
  });

  const onClose = () => setIsShowResults(false);

  const searchOptionsHeight =
    matchedItems.length < 6
      ? searchItemHeight * matchedItems.length + 1
      : maxSearchHeight;

  return (
    <S.SearchWrapper searchOptionsHeight={searchOptionsHeight}>
      <S.SearchHeader>
        {headerName}
        <Close color={colors.gray} onClick={onClose} />
      </S.SearchHeader>

      <S.SearchBody {...getListboxProps()}>{items}</S.SearchBody>
    </S.SearchWrapper>
  );
};
