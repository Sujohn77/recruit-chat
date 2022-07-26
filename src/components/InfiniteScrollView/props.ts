import React from 'react';

export interface IInfiniteScrollViewProps {
  onLoadMore: () => void;
  children: React.ReactElement[];
  scrollableParentId: string;
  hasMore?: boolean;
  inverse?: boolean;
  scrollThreshold?: number;
  style?: React.CSSProperties;
  loader?: React.ReactNode;
}
