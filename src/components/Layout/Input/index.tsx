import { useChatMessanger } from 'contexts/MessangerContext';
import React, {
  ChangeEvent,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { CSSProperties } from 'styled-components';
import { InputTheme } from 'utils/constants';
import * as S from './styles';
import { INPUT_TYPES } from './types';

type PropsType = {
  type?: INPUT_TYPES;
  placeHolder?: string;
  value: string;
  onChange: (
    value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setIsShowResults?: Dispatch<SetStateAction<boolean>>;
  rows?: number;
  theme?: InputTheme;
  error?: string | null;
  style?: CSSProperties;
};

export const DefaultInput: FC<PropsType> = ({
  type = INPUT_TYPES.TEXT,
  placeHolder,
  value,
  onChange,
  setIsShowResults,
  rows = 3,
  theme = InputTheme.Secondary,
  error,
  style,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  if (type === INPUT_TYPES.TEXTAREA) {
    return (
      <div>
        <S.TextAreaInput
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
          style={style}
        />
        {error && <S.ErrorText>{error}</S.ErrorText>}
      </div>
    );
  }

  return (
    <S.Wrapper>
      <S.TextInput
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
        theme={theme}
        style={style}
      />
      {error && <S.ErrorText>{error}</S.ErrorText>}
    </S.Wrapper>
  );
};
