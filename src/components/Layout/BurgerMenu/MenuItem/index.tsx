import { FC, useState } from "react";

import * as S from "./styles";
import { DropDown } from "../DropDown/DropDown";
import { CHAT_ACTIONS } from "utils/types";

interface IMenuItem {
  type: CHAT_ACTIONS;
  text: string;
}

interface IMenuItemProps {
  item: {
    type: CHAT_ACTIONS;
    text: string;
    isDropdown?: boolean;
    options?: string[];
  };
  onClick: (item: IMenuItem) => void;
}

export const MenuItem: FC<IMenuItemProps> = ({ onClick, item }) => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  return (
    <S.MenuItemWrapper
      onClick={() => !isOpenDropDown && onClick(item)}
      onMouseEnter={() => item.isDropdown && setIsOpenDropDown(true)}
      onMouseLeave={() => item.isDropdown && setIsOpenDropDown(false)}
    >
      {item.text}

      {isOpenDropDown && (
        <DropDown
          onClick={(value: string) => onClick({ ...item, text: value })}
          options={item.options!}
        />
      )}
    </S.MenuItemWrapper>
  );
};
