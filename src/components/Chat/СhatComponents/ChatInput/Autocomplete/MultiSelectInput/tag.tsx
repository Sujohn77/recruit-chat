import { AutocompleteGetTagProps, Tooltip } from "@mui/material";

import * as S from "./styles";
import { COLORS } from "utils/colors";
import { Close } from "screens/IntroSome/styles";

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

export function Tag({ label, onDelete }: TagProps) {
  return (
    <S.TagWrapper>
      <Tooltip title={label}>
        <span>{label}</span>
      </Tooltip>

      <Close onClick={onDelete} backgroundColor={COLORS.GRAY} />
    </S.TagWrapper>
  );
}
