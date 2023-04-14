import { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { IInfiniteScrollViewProps } from "./props";

const DEFAULT_SCROLL_THRESHOLD = 300;
const DEFAULT_LOADER = <div />;

export const InfiniteScrollView: FC<IInfiniteScrollViewProps> = ({
  onLoadMore,
  children,
  hasMore = true,
  inverse = false,
  scrollThreshold = DEFAULT_SCROLL_THRESHOLD,
  loader = DEFAULT_LOADER,
  scrollableParentId,
  style = {},
}) => (
  <InfiniteScroll
    dataLength={children.length}
    next={onLoadMore}
    hasMore={hasMore}
    inverse={inverse}
    scrollThreshold={scrollThreshold}
    loader={loader}
    scrollableTarget={scrollableParentId}
    style={style}
  >
    {children}
  </InfiniteScroll>
);
