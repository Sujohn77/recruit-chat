import { useChatMessenger } from "contexts/MessengerContext";
import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";

import { DefaultInput } from "components/Layout";
import { isResultsType } from "utils/helpers";
import { TextFieldTypes } from "utils/constants";
import { SearchResults } from "components/Chat/chatComponents/ChatInput/SearchResults";

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
  disabled?: boolean;
  errorText?: string;
}

export const Autocomplete: FC<IAutocompleteProps> = ({
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
  disabled = false,
  errorText,
}) => {
  const { dispatch, currentMsgType, error } = useChatMessenger();

  const isResults =
    isShowResults && isResultsType({ type: currentMsgType, matchedItems });

  useEffect(() => {
    !isResults && setHeight(0);
  }, [isResults]);

  const onClick = useCallback(
    (e: MouseEvent<HTMLLIElement>) => {
      setInputValue(null);

      if (currentMsgType) {
        dispatch({
          type: currentMsgType,
          payload: { item: e.currentTarget.textContent },
        });
      }

      setIsShowResults(false);
    },
    [currentMsgType]
  );

  return (
    <div>
      {isResults && (
        <SearchResults
          isSingleSelection
          setIsShowResults={setIsShowResults}
          headerName={headerName}
          matchedItems={matchedItems}
          matchedPart={matchedPart}
          onClick={onClick}
          setHeight={setHeight}
        />
      )}

      <DefaultInput
        value={value}
        onChange={onChange}
        placeHolder={placeHolder}
        setIsShowResults={setIsShowResults}
        error={error || errorText}
        disabled={disabled}
      />
    </div>
  );
};
