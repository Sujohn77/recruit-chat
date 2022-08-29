import { useChatMessanger } from 'contexts/MessangerContext';
import React, { ChangeEvent, FC, useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { INPUT_TYPES } from './types';

type PropsType = {
  type?: INPUT_TYPES;
  placeHolder?: string;
  value: string;
  onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setIsShowResults?: Dispatch<SetStateAction<boolean>>;
  rows?: number;
};

export const TextInput = styled.input`
  color: ${colors.silverChalice};
  border: none;
  background: none;
  font-size: 16px;
  line-height: 19px;
  outline: none;
  width: 250px !important;
`;

export const TextAreaInput = styled.textarea`
  color: ${colors.silverChalice};
  border: none;
  background: none;
  font-size: 16px;
  line-height: 19px;
  outline: none;
  width: 250px !important;
`;

export const ErrorText = styled.span`
  position: absolute;
  right: 42px;
  top: 20px;
  font-size: 13px;
  color: #d32f2f;
`;

export const TextField: FC<PropsType> = ({
  type = INPUT_TYPES.TEXT,
  placeHolder,
  value,
  onChange,
  setIsShowResults,
  rows = 3,
}) => {
  const { error } = useChatMessanger();
  const [isFocus, setIsFocus] = useState(false);

  if (type === INPUT_TYPES.TEXTAREA) {
    return (
      <div>
        <TextAreaInput
          value={value}
          placeholder={!isFocus ? placeHolder : ''}
          onChange={onChange}
          onClick={() => {
            setIsShowResults && setIsShowResults(true);
          }}
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
          rows={rows}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </div>
    );
  }

  return (
    <div>
      <TextInput
        type={type}
        value={value}
        placeholder={!isFocus ? placeHolder : ''}
        onChange={onChange}
        onClick={() => {
          setIsShowResults && setIsShowResults(true);
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
