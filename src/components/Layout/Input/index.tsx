import React, { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import { colors } from "utils/colors";

type PropsType = {
  placeHolder: string;
  value: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
};

export const Input = styled.input`
  color: ${colors.silverChalice};
  border: none;
  background: none;
  font-size: 16px;
  line-height: 19px;
  outline: none;
`;

export const TextField: FC<PropsType> = ({ placeHolder, value, onChange }) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div>
      <Input
        value={value}
        placeholder={!isFocus ? placeHolder : ""}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </div>
  );
};
