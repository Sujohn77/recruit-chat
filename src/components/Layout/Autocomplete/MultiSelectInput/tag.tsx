import { AutocompleteGetTagProps } from "@mui/material";

import * as S from "./styles";
import { COLORS } from "utils/colors";
import { Close } from "screens/Intro/styles";

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

export function Tag({ label, onDelete }: TagProps) {
  return (
    <S.TagWrapper>
      <span>{label}</span>
      <Close onClick={onDelete} backgroundColor={COLORS.GRAY} />
    </S.TagWrapper>
  );
}
