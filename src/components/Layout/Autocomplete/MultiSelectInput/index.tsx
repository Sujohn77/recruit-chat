import { SearchResults } from 'components/Chat/MessageInput/SearchResults';
import React, { Dispatch, FC, SetStateAction } from 'react';

import * as S from './styles';
import { AutocompleteGetTagProps } from '@mui/base/AutocompleteUnstyled';

import { useAutocomplete } from '@mui/material';

import { Close } from 'screens/intro/styles';
import { colors } from 'utils/colors';
import { useChatMessenger } from 'contexts/MessangerContext';
import { isResultsType } from 'utils/helpers';
import { TextInput } from 'components/Layout/Input/styles';

type PropsType = {
    value: string;
    values: string[];
    matchedPart: string;
    matchedItems: string[];
    headerName: string;
    setInputValue: (value: string | null) => void;
    onChange: (event: any, values: string[]) => void;
    placeHolder: string;
    setIsShowResults: Dispatch<SetStateAction<boolean>>;
    isShowResults: boolean;
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
        id: 'customized-hook-demo',
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
            values.filter((value, index) => selectedIndex !== index)
        );
    };

    const isResults = isShowResults && isResultsType({ type: currentMsgType, matchedItems });

    return (
        <div>
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

            <S.InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
                {selectedValues
                    .filter((option) => !!option)
                    .map((option: string, index: number) => (
                        <Tag label={option} {...getTagProps({ index })} onDelete={() => onDelete(index)} />
                    ))}
                <TextInput
                    {...getInputProps()}
                    onFocus={(e) => {
                        const inputProps = getInputProps();
                        inputProps.onFocus && inputProps.onFocus(e);
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
        </div>
    );
};
