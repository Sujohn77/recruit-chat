import { useChatMessenger } from "contexts/MessengerContext";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FocusEvent,
  SetStateAction,
  useEffect,
} from "react";
import { useAutocomplete, Tooltip } from "@mui/material";
import { useDebounce } from "use-debounce";
import filter from "lodash/filter";
import map from "lodash/map";

import * as S from "./styles";
import { Tag } from "./tag";
import { TextInput } from "components/Layout/Input/styles";
import { SearchResults } from "components/Chat/ChatComponents/ChatInput/Autocomplete/SearchResults";
import { isResultsType } from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";

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
  disabled: boolean;
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
  disabled,
}) => {
  const {
    currentMsgType,
    searchLocation,
    currentLanguage,
    isJobSearchLocationMultiSelect,
  } = useChatMessenger();
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
    onChange,
  });
  const [debouncedValue] = useDebounce(value, 500, {
    maxWait: 2000,
  });

  const autocompleteInputProps = getInputProps();
  const isResults =
    isShowResults && isResultsType({ type: currentMsgType, matchedItems });

  useEffect(() => {
    if (
      debouncedValue.trim() &&
      currentMsgType === CHAT_ACTIONS.SET_LOCATIONS
    ) {
      searchLocation(debouncedValue);
    }
  }, [currentMsgType, debouncedValue]);

  useEffect(() => {
    onChange(null, []);
  }, [currentMsgType]);

  const onDelete = (selectedIndex: number) => {
    onChange(
      null,
      filter(values, (value, index) => selectedIndex !== index)
    );
  };

  const onInputClick = () => setIsShowResults(true);

  const onInputFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    autocompleteInputProps?.onFocus?.(e);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    autocompleteInputProps?.onChange?.(e);
    setInputValue(e?.target.value);
  };

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
        {isJobSearchLocationMultiSelect && (
          <div style={{ maxHeight: "45px", overflow: "auto" }}>
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
          </div>
        )}

        {currentLanguage === "fr" ? (
          <Tooltip title={placeHolder} hidden={!!value.length}>
            <TextInput
              {...autocompleteInputProps}
              onFocus={onInputFocus}
              placeholder={placeHolder}
              value={value}
              onClick={onInputClick}
              onChange={onChangeHandler}
              disabledWithPlaceholder={
                (disabled || currentMsgType === CHAT_ACTIONS.ASK_QUESTION) &&
                !!placeHolder?.trim()
              }
            />
          </Tooltip>
        ) : (
          <TextInput
            {...autocompleteInputProps}
            onFocus={onInputFocus}
            placeholder={placeHolder}
            value={value}
            onClick={onInputClick}
            onChange={onChangeHandler}
          />
        )}
      </S.InputWrapper>
    </S.Wrapper>
  );
};
