import { CSSProperties, FC } from "react";

import { ButtonsTheme } from "utils/types";
import { ButtonWrapper } from "./styled";

interface IDefaultButtonProps {
  value?: string;
  onClick: () => void;
  theme?: ButtonsTheme;
  style?: CSSProperties;
  variant?: "text" | "outlined" | "contained";
}

export const DefaultButton: FC<IDefaultButtonProps> = ({
  value,
  onClick,
  theme = ButtonsTheme.Purple,
  style,
  variant = "contained",
}) => (
  <ButtonWrapper
    type="button"
    onClick={onClick}
    background={theme}
    value={value}
    variant={variant}
    style={style}
  >
    {value}
  </ButtonWrapper>
);
