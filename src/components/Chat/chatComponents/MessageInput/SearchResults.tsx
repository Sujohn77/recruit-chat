import React, {
  Dispatch,
  FC,
  SetStateAction,
  MouseEvent,
  useEffect,
} from "react";
import map from "lodash/map";

import * as S from "./styles";
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
  setHeight: Dispatch<SetStateAction<number>>;
  onClick?: (event?: MouseEvent<HTMLLIElement>) => void;
  getListboxProps?: () => React.HTMLAttributes<HTMLUListElement>;
  getOptionProps?: (props: IGetOption) => React.HTMLAttributes<HTMLLIElement>;
}

const maxSearchHeight = 186;

export const SearchResults: FC<ISearchResultsProps> = ({
  matchedItems,
  matchedPart,
  headerName,
  getOptionProps,
  onClick,
  setIsShowResults,
  setHeight,
  getListboxProps = () => ({}),
}) => {
  const searchOptionsHeight =
    matchedItems.length < 6
      ? S.searchItemHeight * matchedItems.length + 1
      : maxSearchHeight;

  useEffect(() => {
    setHeight(searchOptionsHeight + 40); // 40px = header height
  }, [searchOptionsHeight, setHeight]);

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

  return (
    <S.SearchWrapper searchOptionsHeight={searchOptionsHeight}>
      <S.SearchHeader>
        {headerName}
        <S.Close color={colors.gray} onClick={onClose} />
      </S.SearchHeader>

      <S.SearchBody {...getListboxProps()}>{items}</S.SearchBody>
    </S.SearchWrapper>
  );
};
