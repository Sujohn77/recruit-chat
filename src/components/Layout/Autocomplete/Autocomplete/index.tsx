import { useChatMessenger } from "contexts/MessengerContext";
import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useEffect,
} from "react";

import { DefaultInput } from "components/Layout";
import { INPUT_TYPES, TextFieldTypes } from "utils/constants";
import { isResultsType } from "utils/helpers";
import { CHAT_ACTIONS } from "utils/types";
import { SearchResults } from "components/Chat/chatComponents/MessageInput/SearchResults";

interface IAutocompleteProps {
  value: string;
  matchedItems: string[];
  headerName: string;
  matchedPart: string;
  placeHolder: string;
  isShowResults: boolean;
  type: TextFieldTypes;
  setInputValue: (value: string | null) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setIsShowResults: Dispatch<SetStateAction<boolean>>;
  setHeight: Dispatch<SetStateAction<number>>;
}

export const Autocomplete: FC<IAutocompleteProps> = (props) => {
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
    setHeight,
  } = props;

  const { dispatch, currentMsgType, user, error } = useChatMessenger();

  const isResults =
    isShowResults && isResultsType({ type: currentMsgType, matchedItems });

  useEffect(() => {
    !isResults && setHeight(0);
  }, [isResults]);

  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    setInputValue(null);

    if (currentMsgType) {
      dispatch({
        type: currentMsgType,
        payload: { item: e.currentTarget.textContent },
      });
    }

    setIsShowResults(false);
  };

  const isNumberType = currentMsgType === CHAT_ACTIONS.APPLY_AGE && user?.email;

  const inputType = isNumberType ? INPUT_TYPES.NUMBER : INPUT_TYPES.TEXT;

  return (
    <div>
      {isResults && (
        <SearchResults
          setIsShowResults={setIsShowResults}
          headerName={headerName}
          matchedItems={matchedItems}
          matchedPart={matchedPart}
          onClick={onClick}
          setHeight={setHeight}
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
