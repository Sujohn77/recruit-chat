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

import * as S from "./styles";
import { IMAGES } from "assets";
import { INPUT_TYPES, InputTheme } from "utils/constants";
import { Image } from "screens/Intro/styles";

interface IInputProps {
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
  disabled?: boolean;
}

export const DefaultInput: FC<IInputProps> = forwardRef(
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
      disabled = false,
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
            disabled={disabled}
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
          disabled={disabled}
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
