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
  const { triggerAction, addMessage, lastActionType } = useChatMessanger();
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
  const isShowResults = isFocus && !!matchedItems.length;
  return (
    <div>
      {isShowResults && (
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
        type={INPUT_TYPES.TEXT}
        value={value}
        onChange={onChange}
        placeHolder={placeHolder}
        setIsInputFocus={setIsFocus}
      />
    </div>
  );
};
