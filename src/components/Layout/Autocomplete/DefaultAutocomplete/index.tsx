import { SearchResults } from 'components/Chat/MessageInput/SearchResults';
import { DefaultInput } from 'components/Layout/Input';
import { INPUT_TYPES } from 'components/Layout/Input/types';
import { useChatMessenger } from 'contexts/MessangerContext';
import React, { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction } from 'react';
import { TextFieldTypes } from 'utils/constants';
import { isResultsType } from 'utils/helpers';
import { CHAT_ACTIONS, MessageType } from 'utils/types';

type PropsType = {
    value: string;
    matchedItems: string[];
    headerName: string;
    matchedPart: string;
    setInputValue: (value: string | null) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeHolder: string;
    type: TextFieldTypes;
    setIsShowResults: Dispatch<SetStateAction<boolean>>;
    isShowResults: boolean;
};

export const Autocomplete: FC<PropsType> = (props) => {
    const { triggerAction, currentMsgType, user, error } = useChatMessenger();
    const {
        matchedItems,
        value,
        headerName,
        matchedPart,
        onChange,
        placeHolder,
        setInputValue,
        isShowResults,
        setIsShowResults,
    } = props;

    const onClick = (e: MouseEvent<HTMLLIElement>) => {
        setInputValue(null);
        currentMsgType &&
            triggerAction({
                type: currentMsgType,
                payload: { item: e.currentTarget.textContent },
            });
    };

    const isResults =
        isShowResults &&
        isResultsType(currentMsgType) &&
        !!matchedItems.length &&
        (value !== '' || currentMsgType === CHAT_ACTIONS.SEARCH_WITH_RESUME); // TODO : refactor
    const isNumberType = currentMsgType === CHAT_ACTIONS.APPLY_AGE && user?.email;
    const inputType = isNumberType ? INPUT_TYPES.NUMBER : INPUT_TYPES.TEXT;

    return (
        <div>
            {isResults && (
                <SearchResults
                    headerName={headerName}
                    matchedItems={matchedItems}
                    matchedPart={matchedPart}
                    onClick={onClick}
                    setIsShowResults={setIsShowResults}
                />
            )}

            <DefaultInput
                type={inputType}
                value={value}
                onChange={onChange}
                placeHolder={placeHolder}
                setIsShowResults={setIsShowResults}
                error={error}
            />
        </div>
    );
};
