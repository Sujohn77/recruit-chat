import * as React from 'react';
import { CSSProperties } from 'styled-components';
import * as S from './buttons.styled';
import { ButtonsTheme } from './types';

interface IButtonProps {
  value: string;
  onClick: () => void;
  theme?: ButtonsTheme;
  style?: CSSProperties;
  variant?: 'text' | 'outlined' | 'contained';
}

export const DefaultButton: React.FC<IButtonProps> = ({
  value,
  onClick,
  theme = ButtonsTheme.Purple,
  style,
  variant = 'contained',
}) => {
  return (
    <S.ButtonWrapper
      onClick={onClick}
      background={theme}
      value={value}
      type="button"
      variant={variant}
      style={style}
    >
      {value}
    </S.ButtonWrapper>
  );
};
