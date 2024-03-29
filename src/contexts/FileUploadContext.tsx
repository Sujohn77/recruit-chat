/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import { IFileUploadContext } from './types';
import { fileUploadDefaultState } from 'utils/helpers';
import { useChatMessanger } from './MessangerContext';
import { CHAT_ACTIONS, MessageType } from 'utils/types';
import { apiInstance } from 'services';

type PropsType = {
  children: React.ReactNode;
};

const FileUploadContext = createContext<IFileUploadContext>(
  fileUploadDefaultState
);

const FileUploadProvider = ({ children }: PropsType) => {
  const { triggerAction, submitMessage } = useChatMessanger();
  const [file, setFile] = useState<File | null>(null);
  const [fileResult, setFileResult] = useState<string | ArrayBuffer | null>(
    null
  );
  const [messageId, setMessageId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let reader = new FileReader();

    reader.onloadend = () => {
      if (fileResult !== reader.result && file && reader.result) {
        const result = reader.result as string;
        setFileResult(result.replace(`data:${file.type};base64,`, ''));
      }
    };

    file && reader.readAsDataURL(file);
  }, [file?.size]);

  useEffect(() => {
    if (messageId) {
      submitMessage({
        type: MessageType.FILE,
        messageId,
      });
    }
  }, [messageId]);

  const sendFile = async (file: File) => {
    triggerAction({
      type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV,
      payload: { item: file.name },
    });

    const data = {
      candidateId: 50994334,
      fileName: file.name,
      lastModified: `${new Date(file.lastModified).toISOString()}`,
      blob: fileResult!,
    };
    setFile(null);

    const response = await apiInstance.uploadCV(data);
    response.data?.resumeId && setMessageId(response.data?.resumeId); // REPLACE when backend messages scheme is ready
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
