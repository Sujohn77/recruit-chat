import React, { createContext, useContext, useState } from "react";

import { IFileUploadContext } from "./types";
import { fileUploadDefaultState, getChatResponseOnAction } from "utils/helpers";
import { useChatMessanger } from "./MessangerContext";
import { USER_CHAT_ACTIONS } from "utils/types";

type PropsType = {
  children: React.ReactNode;
};

const FileUploadContext = createContext<IFileUploadContext>(
  fileUploadDefaultState
);

// enum NOTIFICATIONS {
//   SUCCESS_SEND = "Your CV was uploaded",
// }

const FileUploadProvider = ({ children }: PropsType) => {
  const { pushMessages, popMessage } = useChatMessanger();
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const sendFile = (file: File) => {
    setFile(null);
    const responseMessages = getChatResponseOnAction(
      USER_CHAT_ACTIONS.SUCCESS_UPLOAD_CV,
      { text: file.name }
    );
    popMessage();
    pushMessages(responseMessages);
    // setNotification(NOTIFICATIONS.SUCCESS_SEND);
  };

  const saveFile = (file: File) => {
    if (file.size > 2097152) {
      setNotification("File may not be more than 2MB");
      setFile(null);
      return;
    }
    notification && setNotification(null);
    setFile(file);
  };

  const resetFile = () => {
    setFile(null);
    setNotification(null);
  };

  return (
    <FileUploadContext.Provider
      value={{
        file,
        saveFile,
        sendFile,
        resetFile,
        notification,
        setNotification,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

const useFileUploadContext = () => useContext(FileUploadContext);

export { FileUploadProvider, useFileUploadContext };
