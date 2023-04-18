import { useChatMessenger } from "contexts/MessengerContext";
import { Dispatch, FC, SetStateAction } from "react";
import { useAutocomplete } from "@mui/material";
import filter from "lodash/filter";
import map from "lodash/map";
import { AutocompleteGetTagProps } from "@mui/base/AutocompleteUnstyled";

import * as S from "./styles";
import { colors } from "utils/colors";
import { isResultsType } from "utils/helpers";
import { Close } from "screens/Intro/styles";
import { TextInput } from "components/Layout/Input/styles";
import { SearchResults } from "components/Chat/chatComponents/MessageInput/SearchResults";

interface IMultiSelectInputProps {
  value: string;
  values: string[];
  matchedPart: string;
  matchedItems: string[];
  headerName: string;
  placeHolder: string;
  isShowResults: boolean;
  setIsShowResults: Dispatch<SetStateAction<boolean>>;
  onChange: (event: any, values: string[]) => void;
  setInputValue: (value: string | null) => void;
}

export interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

export function Tag(props: TagProps) {
  const { label, onDelete } = props;

  return (
    <S.TagWrapper>
      <span>{label}</span>
      <Close onClick={onDelete} color={colors.gray} />
    </S.TagWrapper>
  );
}

export const MultiSelectInput: FC<IMultiSelectInputProps> = ({
  matchedItems,
  value,
  values,
  headerName,
  matchedPart,
  onChange,
  placeHolder,
  isShowResults,
  setInputValue,
  setIsShowResults,
}) => {
  const {
    getInputProps,
    getTagProps,
    getOptionProps,
    getListboxProps,
    value: selectedValues,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: matchedItems,
    getOptionLabel: (option: any) => option,
    value: values,
    onChange: onChange,
  });

  const { currentMsgType } = useChatMessenger();

  const onDelete = (selectedIndex: number) => {
    onChange(
      null,
      filter(values, (value, index) => selectedIndex !== index)
    );
  };

  const isResults =
    isShowResults && isResultsType({ type: currentMsgType, matchedItems });

  return (
    <S.Wrapper>
      {isResults && (
        <SearchResults
          headerName={headerName}
          matchedItems={matchedItems}
          matchedPart={matchedPart}
          getOptionProps={getOptionProps}
          getListboxProps={getListboxProps}
          setIsShowResults={setIsShowResults}
        />
      )}

      <S.InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
        {map(
          filter(selectedValues, (option) => !!option),
          (option: string, index: number) => (
            <Tag
              label={option}
              {...getTagProps({ index })}
              onDelete={() => onDelete(index)}
            />
          )
        )}

        <TextInput
          {...getInputProps()}
          onFocus={(e) => {
            const inputProps = getInputProps();
            inputProps?.onFocus?.(e);
          }}
          placeholder={placeHolder}
          value={value}
          onClick={(e) => {
            setIsShowResults(true);
          }}
          onChange={(event) => {
            const inputProps = getInputProps();
            inputProps.onChange && inputProps.onChange(event);
            setInputValue(event?.target.value);
          }}
        />
      </S.InputWrapper>
    </S.Wrapper>
  );
};
