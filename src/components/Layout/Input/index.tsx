import {
  ChangeEvent,
  FC,
  useState,
  Dispatch,
  SetStateAction,
  forwardRef,
  ForwardedRef,
  CSSProperties,
} from "react";

import { IMAGES } from "assets";
import { INPUT_TYPES, InputTheme } from "utils/constants";
import { Image } from "screens/Intro/styles";
import * as S from "./styles";

type PropsType = {
  value: string;
  onChange: (
    value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: INPUT_TYPES;
  placeHolder?: string;
  setIsShowResults?: Dispatch<SetStateAction<boolean>>;
  rows?: number;
  theme?: InputTheme;
  error?: string | null;
  style?: CSSProperties;
  ref?: ForwardedRef<HTMLInputElement>;
  isErrorIcon?: boolean;
};

export const DefaultInput: FC<PropsType> = forwardRef(
  (
    {
      value,
      onChange,
      type = INPUT_TYPES.TEXT,
      placeHolder,
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
        <S.TextAreaInputWrapper>
          <S.TextAreaInput
            value={value}
            onChange={onChange}
            rows={rows}
            style={style}
            placeholder={!isFocus && !error ? placeHolder : ""}
            onClick={() => setIsShowResults?.(true)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {error && <S.ErrorText>{error}</S.ErrorText>}
        </S.TextAreaInputWrapper>
      );
    }

    return (
      <S.Wrapper>
        <S.TextInput
          ref={ref}
          type={type}
          value={value}
          placeholder={!isFocus && !error ? placeHolder : ""}
          onChange={onChange}
          theme={theme}
          style={style}
          onClick={() => setIsShowResults?.(true)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />

        {error !== null && (
          <S.ErrorText>
            {error}

            {isErrorIcon && (
              <Image
                src={IMAGES.WARN}
                style={{ marginLeft: "5px", width: "12px", height: "12px" }}
              />
            )}
          </S.ErrorText>
        )}
      </S.Wrapper>
    );
  }
);
