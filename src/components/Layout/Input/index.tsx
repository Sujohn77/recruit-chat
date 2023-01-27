import { useChatMessenger } from 'contexts/MessangerContext';
import React, {
  ChangeEvent,
  FC,
  useState,
  Dispatch,
  SetStateAction,
  forwardRef,
  RefObject,
} from 'react';
import { Image } from 'screens/intro/styles';
import { CSSProperties } from 'styled-components';
import { IMAGES, InputTheme } from 'utils/constants';
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
  ref?: React.ForwardedRef<HTMLInputElement>;
  isErrorIcon?: boolean;
};

export const DefaultInput: FC<PropsType> = forwardRef(
  (
    {
      type = INPUT_TYPES.TEXT,
      placeHolder,
      value,
      onChange,
      setIsShowResults,
      rows = 3,
      theme = InputTheme.Secondary,
      error,
      style,
      isErrorIcon = false,
    },
    ref
  ) => {
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
          ref={ref}
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
        {error !== null && (
          <S.ErrorText>
            {error}
            {isErrorIcon && (
              <Image
                src={IMAGES.WARN}
                style={{ marginLeft: '5px', width: '12px', height: '12px' }}
              />
            )}
          </S.ErrorText>
        )}
      </S.Wrapper>
    );
  }
);
