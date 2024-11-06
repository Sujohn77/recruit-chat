import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import map from "lodash/map";

import * as S from "../styles";
import { CHAT_ACTIONS, ILocalMessage } from "utils/types";
import { getMessageOptionText } from "utils/helpers";
import { useChatMessenger } from "contexts/MessengerContext";
import { IMessageOption } from "services/types";
import { ChatScreens } from "utils/constants";

interface IDefOptions {
  message: ILocalMessage;
}

export const DefOptions: FC<IDefOptions> = ({ message }) => {
  const { t } = useTranslation();
  const { dispatch, setChatScreen, sendNewMessage } = useChatMessenger();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onSelectOption = useCallback(
    (option: IMessageOption) => {
      setSelectedId(option.id);
      const isFindJob = option.id === 1;
      const isOnlyQnA = message.optionList?.options.length === 1;
      const screen =
        ChatScreens[isOnlyQnA ? "QnA" : isFindJob ? "FindAJob" : "QnA"];
      const type =
        CHAT_ACTIONS[
          isOnlyQnA ? "ASK_QUESTION" : isFindJob ? "FIND_JOB" : "ASK_QUESTION"
        ];

      sendNewMessage({
        isOwn: false,
        message: getMessageOptionText(option, t),
        localId: "DefOptions_null",
      });
      setChatScreen(screen);
      dispatch({
        type,
        payload: { item: getMessageOptionText(option, t), isChatMessage: true },
        i18nProps: option.i18nProps,
        i18n: option.i18nPhrase,
      });
    },
    [sendNewMessage]
  );

  return (
    <S.OptionListWrapper>
      {map(message.optionList?.options, (o) => (
        <S.ConsentOptionButton
          onClick={() => onSelectOption(o)}
          isSelected={o.id === selectedId}
        >
          {getMessageOptionText(o, t)}
        </S.ConsentOptionButton>
      ))}
    </S.OptionListWrapper>
  );
};
