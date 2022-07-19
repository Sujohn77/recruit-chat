import { Loader } from "components/Layout/Loader";
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushMessage } from "redux/slices";
import { IState } from "redux/slices/types";
import { getMessageColorProps } from "utils/helpers";
import { mockData } from "../mockData";
import * as S from "./styles";

type PropsType = {
  draftMessage: string | null;
  setDraftMessage: Dispatch<SetStateAction<string | null>>;
};

export const MessagesBody: FC<PropsType> = ({
  draftMessage,
  setDraftMessage,
}) => {
  const dispatch = useDispatch();
  const { messages } = useSelector<IState, IState>((state) => state);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        draftMessage && dispatch(pushMessage(draftMessage));
        setDraftMessage(null);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftMessage]);

  const chatMessages = useMemo(() => {
    return messages.map((msg) => {
      return (
        <S.Message
          key={`own-message-${msg.createdAt}-index`}
          {...getMessageColorProps(!msg.isReceived)}
        >
          {msg.content.text}
        </S.Message>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  // TODO: check if we have last own message
  const isLastOwnMessage = draftMessage !== "" && !!draftMessage;

  return (
    <S.MessagesArea>
      <S.InitialMessage>{mockData.initialMessage}</S.InitialMessage>
      {chatMessages}

      {isLastOwnMessage && <Loader isShow={isLastOwnMessage} />}
    </S.MessagesArea>
  );
};
