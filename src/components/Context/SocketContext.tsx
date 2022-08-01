import { chatId } from "components/Chat";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";

import { FirebaseSocketReactivePagination } from "socket";
import { SocketCollectionPreset } from "socket/socket.options";
import { IMessage, ISnapshot } from "services/types";
import { useChatMessanger } from "./MessangerContext";
import { updateChatRoomMessages } from "firebase/config";

type PropsType = {
  children: React.ReactNode;
};

const socketDefaultState = {};
const SocketContext = createContext<any>(socketDefaultState);

const SocketProvider = ({ children }: PropsType) => {
  const { messages, setSnapshotMessages } = useChatMessanger();

  const onUpdateMessages = useCallback(
    (messagesSnapshots: ISnapshot<IMessage>[]) => {
      setSnapshotMessages(messagesSnapshots);
    },
    [chatId, messages]
  );
  console.log(messages);
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
