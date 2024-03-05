import { FC, useState } from "react";

import * as S from "./styles";
import { IMenuItemProps } from "./props";
import { DropDown } from "../DropDown";

export const MenuItem: FC<IMenuItemProps> = ({ onClick, item }) => {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  return (
    <S.MenuItemWrapper
      onClick={() => !isOpenDropDown && onClick(item)}
      // onMouseEnter={() => item.isDropdown && setIsOpenDropDown(true)} // this feature is temporarily hidden (language change - CHAT-265)
      // onMouseLeave={() => item.isDropdown && setIsOpenDropDown(false)}
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
