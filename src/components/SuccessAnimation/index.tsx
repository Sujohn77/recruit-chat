import React from "react";
import { useTheme } from "styled-components";

import * as S from "./styles";
import { COLORS } from "utils/colors";
import { ThemeType } from "utils/theme/default";

interface ISuccessIconProps {
  color?: string;
}

export const SuccessAnimation: React.FC<ISuccessIconProps> = ({
  color = COLORS.CORNFLOWER_BLUE,
}) => {
  const theme = useTheme() as ThemeType;

  return (
    <S.Container>
      <S.Circle color={color || theme.primaryColor}>
        <S.Tick color={color || theme.primaryColor}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="22">
            <path
              d="M11.637 20.286a2.41 2.41 0 0 1-3.411 0L2.11 14.17a2.42 2.42 0 0 1 0-3.413c.943-.94 2.47-.94 3.41 0l4.412 4.412L22.87 2.23a2.41 2.41 0 1 1 3.411 3.411L11.637 20.286z"
              fill={color || theme.primaryColor}
              fillRule="evenodd"
            />
          </svg>
        </S.Tick>
      </S.Circle>
    </S.Container>
  );
};

export default SuccessAnimation;
