import React, {
  ChangeEvent,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import styled from "styled-components";
import { colors } from "utils/colors";

type PropsType = {
  placeHolder: string;
  value: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  setIsInputFocus: Dispatch<SetStateAction<boolean>>;
};

export const Input = styled.input`
  color: ${colors.silverChalice};
  border: none;
  background: none;
  font-size: 16px;
  line-height: 19px;
  outline: none;
  width: 250px !important; ;
`;

export const TextField: FC<PropsType> = ({
  placeHolder,
  value,
  onChange,
  setIsInputFocus,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div>
      <Input
        value={value}
        placeholder={!isFocus ? placeHolder : ""}
        onChange={onChange}
        onClick={() => {
          setIsInputFocus(true);
        }}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
      />
    </div>
  );
};
