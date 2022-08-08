import { useChatMessanger } from 'contexts/MessangerContext';
import React, {
  ChangeEvent,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import styled from 'styled-components';
import { colors } from 'utils/colors';

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
export const ErrorText = styled.span`
  position: absolute;
  right: 42px;
  top: 25px;
  font-size: 13px;
  color: #d32f2f;
`;
export const TextField: FC<PropsType> = ({
  placeHolder,
  value,
  onChange,
  setIsInputFocus,
}) => {
  const { error } = useChatMessanger();
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div>
      <Input
        value={value}
        placeholder={!isFocus ? placeHolder : ''}
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
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
