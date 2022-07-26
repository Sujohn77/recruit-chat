import { chatId } from "components/Chat";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useUpdateChatRoomMessagesCallback } from "socket/hooks";
import { FirebaseSocketReactivePagination } from "socket";
import { SocketCollectionPreset } from "socket/socket.options";
import { IMessage } from "services/types";

type PropsType = {
  children: React.ReactNode;
};

const socketDefaultState = {};
const SocketContext = createContext<any>(socketDefaultState);

const SocketProvider = ({ children }: PropsType) => {
  const onUpdateMessages = useUpdateChatRoomMessagesCallback(chatId);

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
  }, [onUpdateMessages]);

  const onLoadNextMessagesPage = useCallback(() => {
    messagesSocketConnection.current?.loadNextPage(onUpdateMessages);
  }, [onUpdateMessages]);

  return (
    <SocketContext.Provider value={{ onLoadNextMessagesPage }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketProvider, useSocketContext };
