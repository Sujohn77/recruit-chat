import { SearchResults } from 'components/Chat/MessageInput/SearchResults';
import React, { Dispatch, FC, SetStateAction } from 'react';

import * as S from './styles';
import { AutocompleteGetTagProps } from '@mui/base/AutocompleteUnstyled';

import { useAutocomplete } from '@mui/material';
import { TextInput } from '..';
import { CHAT_ACTIONS } from 'utils/types';

import { Close } from 'screens/intro/styles';
import { colors } from 'utils/colors';

type PropsType = {
  value: string;
  values: string[];
  matchedPart: string;
  matchedItems: string[];
  headerName: string;
  setInputValue: (value: string | null) => void;
  onChange: (event: any, values: string[]) => void;
  placeHolder: string;
  options: string[];
  type: CHAT_ACTIONS.SET_LOCATIONS;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  isFocus: boolean;
};

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

export const MultiSelectInput: FC<PropsType> = ({
  matchedItems,
  value,
  values,
  headerName,
  matchedPart,
  onChange,
  placeHolder,
  type,
  options,
  isFocus,
  setInputValue,
  setIsFocus,
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
    id: 'customized-hook-demo',
    multiple: true,
    options,
    getOptionLabel: (option: any) => option,
    value: values,
    onChange: onChange,
  });

  const onDelete = (selectedIndex: number) => {
    onChange(
      null,
      values.filter((value, index) => selectedIndex !== index)
    );
  };

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
          setIsFocus={setIsFocus}
        />
      )}

      <S.InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
        {selectedValues.map((option: string, index: number) => (
          <Tag
            label={option}
            {...getTagProps({ index })}
            onDelete={() => onDelete(index)}
          />
        ))}
        <TextInput
          {...getInputProps()}
          placeholder={placeHolder}
          value={value}
          onClick={(e) => {
            setIsFocus(true);
          }}
          onChange={(event) => {
            const inputProps = getInputProps();
            inputProps.onChange && inputProps.onChange(event);
            setInputValue(event?.target.value);
          }}
        />
      </S.InputWrapper>
    </div>
  );
};
