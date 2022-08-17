import { isResultsType } from 'components/Chat/MessageInput';
import { SearchResults } from 'components/Chat/MessageInput/SearchResults';
import { useChatMessanger } from 'contexts/MessangerContext';
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
} from 'react';
import { CHAT_ACTIONS } from 'utils/types';
import { TextField } from '..';
import { INPUT_TYPES } from '../types';

type PropsType = {
  value: string;
  matchedItems: string[];
  headerName: string;
  matchedPart: string;
  setInputValue: (value: string | null) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  type:
    | CHAT_ACTIONS.SET_CATEGORY
    | CHAT_ACTIONS.SET_LOCATIONS
    | CHAT_ACTIONS.SET_ALERT_CATEGORY;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  isFocus: boolean;
};

export const Autocomplete: FC<PropsType> = (props) => {
  // const [isFocus, setIsFocus] = useState(false);
  const { triggerAction, lastActionType } = useChatMessanger();
  const {
    matchedItems,
    value,
    headerName,
    matchedPart,
    onChange,
    placeHolder,
    type,
    setInputValue,
    isFocus,
    setIsFocus,
  } = props;

  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    setInputValue(null);
    triggerAction({ type, payload: { item: e.currentTarget.textContent } });
  };

  // TODO: test
  const isShowResults = isFocus && isResultsType(lastActionType);
  const inputType =
    lastActionType !== CHAT_ACTIONS.APPLY_EMAIL
      ? INPUT_TYPES.TEXT
      : INPUT_TYPES.NUMBER;

  return (
    <div>
      {isShowResults && !!matchedItems.length && (
        <SearchResults
          type={type}
          headerName={headerName}
          matchedItems={matchedItems}
          matchedPart={matchedPart}
          onClick={onClick}
          setIsFocus={setIsFocus}
        />
      )}

      <TextField
        type={inputType}
        value={value}
        onChange={onChange}
        placeHolder={placeHolder}
        setIsInputFocus={setIsFocus}
      />
    </div>
  );
};
