import { SearchResults } from "components/Chat/MessageInput/SearchResults";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import * as S from "./styles";
import { AutocompleteGetTagProps } from "@mui/base/AutocompleteUnstyled";

import { useAutocomplete } from "@mui/material";
import { Input } from "..";
import { CHAT_ACTIONS } from "utils/types";
import { useChatMessanger } from "components/Context/MessangerContext";
import {
  SearchBody,
  SearchPosition,
} from "components/Chat/MessageInput/styles";
import { Close } from "screens/intro/styles";
import { colors } from "utils/colors";

type PropsType = {
  value: string;
  matchedItems: string[];
  headerName: string;
  matchedPart: string;
  setValue: (result: string | null) => void;
  onChange: (values: string[]) => void;
  placeHolder: string;
  options: string[];
  type: CHAT_ACTIONS.SET_CATEGORY | CHAT_ACTIONS.SET_LOCATIONS;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  isFocus: boolean;
};

export interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

export function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;

  return (
    <S.TagWrapper>
      <span>{label}</span>
      <Close onClick={onDelete} color={colors.gray} />
    </S.TagWrapper>
  );
}

export const MultiSelectInput: FC<PropsType> = ({
  matchedItems,
  value,
  headerName,
  matchedPart,
  setValue,
  placeHolder,
  type,
  options,
  isFocus,
  setIsFocus,
}) => {
  const {
    getInputProps,
    getTagProps,
    getOptionProps,
    getListboxProps,
    value: values,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options,
    getOptionLabel: (option: any) => option,
  });
  const { triggerAction, locations } = useChatMessanger();

  useEffect(() => {
    setValue(null);
    setIsFocus(false);
    triggerAction({
      type,
      payload: { items: values },
    });
  }, [values.length]);

  const onClick = () => {};

  return (
    <div>
      {((!!matchedItems?.length && matchedPart) || !matchedPart) && isFocus && (
        <SearchResults
          type={type}
          headerName={headerName}
          matchedItems={matchedItems}
          matchedPart={matchedPart}
          getOptionProps={getOptionProps}
          getListboxProps={getListboxProps}
          onClick={onClick}
          setIsFocus={setIsFocus}
        />
      )}

      <S.InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
        {locations.map((option: string, index: number) => (
          <Tag label={option} {...getTagProps({ index })} />
        ))}
        <Input
          {...getInputProps()}
          placeholder={placeHolder}
          value={value}
          onClick={(e) => {
            setIsFocus(true);
          }}
          onChange={(event) => {
            const inputProps = getInputProps();
            inputProps.onChange && inputProps.onChange(event);
            setValue(event?.target.value);
          }}
        />
      </S.InputWrapper>
    </div>
  );
};
