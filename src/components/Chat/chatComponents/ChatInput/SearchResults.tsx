import React, { FC, MouseEvent, useEffect } from "react";
import map from "lodash/map";

import * as S from "./styles";
import { COLORS } from "utils/colors";
import { InfiniteScrollView } from "components/InfiniteScrollView";
import { useChatMessenger } from "contexts/MessengerContext";

interface IGetOption {
  option: any;
  index: number;
}

interface ISearchResultsProps {
  matchedItems: string[];
  matchedPart: string;
  headerName: string;
  setIsShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  onClick?: (event?: MouseEvent<HTMLLIElement>) => void;
  getListboxProps?: () => React.HTMLAttributes<HTMLUListElement>;
  getOptionProps?: (props: IGetOption) => React.HTMLAttributes<HTMLLIElement>;
  isMultiSelect?: boolean;
  isSingleSelection?: boolean;
}

const maxSearchHeight = 186;
const REQUISITIONS_SCROLL_ID = "REQUISITIONS_SCROLL_ID";
const infiniteScrollStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export const SearchResults: FC<ISearchResultsProps> = ({
  matchedItems,
  matchedPart,
  headerName,
  getOptionProps,
  onClick,
  setIsShowResults,
  setHeight,
  getListboxProps = () => ({}),
  isSingleSelection = false,
}) => {
  const { requisitionsPage, setRequisitionsPage } = useChatMessenger();

  const searchOptionsHeight =
    matchedItems.length < 6
      ? S.searchItemHeight * matchedItems.length + 1
      : maxSearchHeight;

  useEffect(() => {
    setHeight(searchOptionsHeight + 40); // 40px = header height
  }, [searchOptionsHeight, setHeight]);

  const onClose = () => setIsShowResults(false);

  const onLoadMore = () =>
    isSingleSelection && setRequisitionsPage(requisitionsPage + 1);

  return (
    <S.SearchWrapper searchOptionsHeight={searchOptionsHeight}>
      <S.SearchHeader>
        {headerName}
        <S.Close color={COLORS.GRAY} onClick={onClose} />
      </S.SearchHeader>

      <S.SearchBody {...getListboxProps()}>
        <S.ScrollWrapper id={REQUISITIONS_SCROLL_ID}>
          <InfiniteScrollView
            onLoadMore={onLoadMore}
            scrollableParentId={REQUISITIONS_SCROLL_ID}
            scrollThreshold={0.8}
            style={infiniteScrollStyle}
          >
            {map(matchedItems, (option, index) => {
              const optionProps =
                getOptionProps && getOptionProps({ option, index });
              const startIndex = option.indexOf(matchedPart);

              return (
                <S.SearchPosition
                  key={`search-item-${index}`}
                  {...optionProps}
                  onClick={(event: MouseEvent<HTMLLIElement>) => {
                    onClick?.(event);
                    optionProps?.onClick?.(event);
                  }}
                >
                  {matchedPart ? (
                    <>
                      {/* first part of option  */}
                      {option.substring(0, startIndex)}
                      {/* search substring */}
                      {/* <span>{matchedPart}</span> */}
                      <span>
                        {option.substring(
                          startIndex,
                          startIndex + matchedPart.length
                        )}
                      </span>
                      {/* second part of option (without search substring) */}
                      {option.substring(startIndex + matchedPart.length)}
                    </>
                  ) : (
                    option
                  )}
                </S.SearchPosition>
              );
            })}
          </InfiniteScrollView>
        </S.ScrollWrapper>
      </S.SearchBody>
    </S.SearchWrapper>
  );
};
