import { Button } from "@material-ui/core";
import styled from "styled-components";

import { colors } from "utils/colors";
import { ButtonsTheme } from "utils/types";

interface IStyledProps {
  background?: ButtonsTheme;
  variant: "contained" | "outlined" | "text";
}

export const ButtonWrapper = styled(Button)`
  width: 100%;
  border-radius: 20px !important;
  font-size: 14px;
  box-shadow: none !important;
  height: 40px !important;

  background-color: ${({
    background = ButtonsTheme.Purple,
    variant,
  }: IStyledProps) =>
    variant !== "outlined" ? `${colors[background]}!important` : "#fff"};

  border: ${({ background = ButtonsTheme.Purple, variant }: IStyledProps) =>
    variant === "outlined"
      ? `1px solid ${colors[background]}!important`
      : "none"};

  color: ${({ background = ButtonsTheme.Purple, variant }: IStyledProps) =>
    variant !== "outlined" ? "#fff" : colors[background]}!important;
`;
