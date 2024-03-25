import { useChatMessenger } from "contexts/MessengerContext";
import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useDebounce } from "use-debounce";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { PhoneInputWrapper } from "./styles";
import { useIsTabActive } from "services/hooks";
import { isResultsType } from "utils/helpers";
import { useDetectCountry } from "utils/hooks";
import { TextFieldTypes } from "utils/constants";
import { DefaultInput } from "components/Layout";
import { SearchResults } from "components/Chat/ChatComponents/ChatInput/Autocomplete/SearchResults";
import { CHAT_ACTIONS } from "utils/types";

interface IAutocompleteProps {
  value: string;
  matchedItems: string[];
  matchedPart: string;
  headerName: string;
  placeHolder: string;
  isShowResults: boolean;
  type: TextFieldTypes;
  setInputValue: (value: string | null) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setIsShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  isPhoneNumberMode: boolean;
  phoneValue: string;
  setPhoneValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  errorText?: string;
}

export const Autocomplete: React.FC<IAutocompleteProps> = ({
  value,
  matchedItems,
  matchedPart,
  headerName,
  onChange,
  placeHolder,
  setInputValue,
  isShowResults,
  setIsShowResults,
  setHeight,
  isPhoneNumberMode,
  phoneValue,
  setPhoneValue,
  errorText,
  disabled = false,
}) => {
  const {
    dispatch,
    currentMsgType,
    error,
    isChatLoading,
    searchRequisitionsByKeyword,
  } = useChatMessenger();
  const detectedCountry = useDetectCountry();
  const inputRef = useRef<HTMLInputElement>(null);
  const isTabActive = useIsTabActive();
  const [debouncedValue] = useDebounce(value, 500, {
    maxWait: 1000,
    leading: isChatLoading,
  });

  const isResults =
    isShowResults && isResultsType({ type: currentMsgType, matchedItems });

  useEffect(() => {
    if (debouncedValue.trim() && currentMsgType === CHAT_ACTIONS.SET_CATEGORY) {
      searchRequisitionsByKeyword(debouncedValue);
    }
  }, [currentMsgType, debouncedValue]);

  useEffect(() => {
    isTabActive && inputRef.current?.focus();
  }, [isTabActive]);

  useEffect(() => {
    !isResults && setHeight(0);
  }, [isResults]);

  useEffect(() => {
    !isChatLoading && inputRef.current?.focus();
  }, [isChatLoading]);

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

      {isPhoneNumberMode && !isChatLoading ? (
        <PhoneInputWrapper>
          <PhoneInput
            autoFocus
            style={{ width: "260px" }}
            defaultCountry={detectedCountry}
            value={phoneValue}
            onChange={(phone) => setPhoneValue(phone)}
          />
        </PhoneInputWrapper>
      ) : (
        <DefaultInput
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeHolder={isChatLoading ? "" : placeHolder}
          setIsShowResults={setIsShowResults}
          error={error || errorText}
          disabled={disabled || isChatLoading}
        />
      )}
    </div>
  );
};
