import { FC } from "react";
import { CSSProperties } from "styled-components";

import { ButtonsTheme } from "utils/types";
import { ButtonWrapper } from "./styled";

interface IButtonProps {
  value: string;
  onClick: () => void;
  theme?: ButtonsTheme;
  style?: CSSProperties;
  variant?: "text" | "outlined" | "contained";
}

export const DefaultButton: FC<IButtonProps> = ({
  value,
  onClick,
  theme = ButtonsTheme.Purple,
  style,
  variant = "contained",
}) => (
  <ButtonWrapper
    onClick={onClick}
    background={theme}
    value={value}
    type="button"
    variant={variant}
    style={style}
  >
    {value}
  </ButtonWrapper>
);
