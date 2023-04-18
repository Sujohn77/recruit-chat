import { FC } from "react";
import map from "lodash/map";

import { List, Wrapper, Option } from "./styles";

interface IDropDownProps {
  options: string[];
  onClick: (value: string) => void;
}

export const DropDown: FC<IDropDownProps> = ({ options, onClick }) => {
  const items = map(options, (opt, index) => (
    <Option key={`lang-option-${index}`} onClick={() => onClick(opt)}>
      {opt}
    </Option>
  ));

  return (
    <Wrapper>
      <List>{items}</List>
    </Wrapper>
  );
};
