/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "./MessengerContext";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";

import { FirebaseSocketReactivePagination } from "socket";
import { SocketCollectionPreset } from "socket/socket.options";
import { IMessage, ISnapshot } from "services/types";
import { chatId } from "utils/constants";

interface ISocketProviderProps {
  children: React.ReactNode;
}

const socketDefaultState = {};
const SocketContext = createContext<any>({ socketDefaultState });

const SocketProvider = ({ children }: ISocketProviderProps) => {
  const { setSnapshotMessages, setIsInitialized } = useChatMessenger();

  const onUpdateMessages = useCallback(
    (messagesSnapshots: ISnapshot<IMessage>[]) => {
      setSnapshotMessages(messagesSnapshots);
      setIsInitialized(true);
    },
    [chatId]
  );

  /* ------ Socket Connection ------ */
  const messagesSocketConnection = React.useRef(
    new FirebaseSocketReactivePagination<IMessage>(
      SocketCollectionPreset.Messages,
      chatId
    )
  );

  useEffect(() => {
    const savedSocketConnection = messagesSocketConnection.current;
    savedSocketConnection.subscribe(onUpdateMessages);
    return () => savedSocketConnection?.unsubscribe();
  }, []);

  const onLoadNextMessagesPage = useCallback(() => {
    messagesSocketConnection.current?.loadNextPage(onUpdateMessages);
  }, []);

  return (
    <SocketContext.Provider value={{ onLoadNextMessagesPage }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketProvider, useSocketContext };
