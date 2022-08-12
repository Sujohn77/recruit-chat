import React, { createContext, useContext, useState } from 'react';

import { IFileUploadContext } from './types';
import { fileUploadDefaultState } from 'utils/helpers';
import { useChatMessanger } from './MessangerContext';
import { CHAT_ACTIONS } from 'utils/types';
import { apiInstance } from 'services';

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
  const { triggerAction } = useChatMessanger();
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const sendFile = async (file: File) => {
    triggerAction({
      type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV,
      payload: { item: file.name },
      isResponseFirst: true,
    });
    setFile(null);

    // const data = {
    //   candidateId: 12345,
    //   fileName: file.name,
    //   lastModified: `${file.lastModified}`,
    //   blob: new Blob([new Uint8Array(await file.arrayBuffer())]),
    // };
    // apiInstance.uploadCV(data);
  };

  const saveFile = (file: File) => {
    if (file.size > 2097152) {
      setNotification('File may not be more than 2MB');
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
