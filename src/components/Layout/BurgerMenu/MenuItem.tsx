import React, { FC, useState } from 'react';
import { CHAT_ACTIONS } from 'utils/types';

import { DropDown } from './DropDown';
import * as S from './styles';

export interface IMenuItem {
  type: CHAT_ACTIONS;
  text: string;
}

type PropsType = {
  item: {
    type: CHAT_ACTIONS;
    text: string;
    isDropdown?: boolean;
    options?: string[];
  };
  onClick: (item: IMenuItem) => void;
  onDropDownClick?: (value: string) => void;
};

export const MenuItem: FC<PropsType> = ({ onClick, item, onDropDownClick }) => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  return (
    <S.MenuItemWrapper
      onClick={() => onClick(item)}
      onMouseEnter={() => item.isDropdown && setIsOpenDropDown(true)}
      onMouseLeave={() => item.isDropdown && setIsOpenDropDown(false)}
    >
      {item.text}
      {isOpenDropDown && (
        <DropDown
          onClick={(value: string) => onDropDownClick && onDropDownClick(value)}
          options={item.options!}
        />
      )}
    </S.MenuItemWrapper>
  );
};
