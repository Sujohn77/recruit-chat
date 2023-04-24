/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "./MessengerContext";
import React, { createContext, useContext, useEffect, useState } from "react";

import { IFileUploadContext } from "./types";
import { CHAT_ACTIONS, MessageType } from "utils/types";
import { apiInstance } from "services";

interface IFileUploadProviderProps {
  children: React.ReactNode;
}

export interface IResumeData {
  candidateId: number;
  fileName: string;
  lastModified: string;
  blob: string | ArrayBuffer;
}

const fileUploadDefaultState: IFileUploadContext = {
  file: null,
  notification: null,
  resumeData: null,
  isFileDownloading: false,
  isJobSearchingLoading: false,
  resetFile: () => null,
  showFile: () => null,
  searchWithResume: () => null,
  setNotification: () => null,
};

const FileUploadContext = createContext<IFileUploadContext>(
  fileUploadDefaultState
);

const FileUploadProvider = ({ children }: IFileUploadProviderProps) => {
  const {
    triggerAction,
    messages,
    submitMessage,
    currentMsgType,
    setJobPositions,
  } = useChatMessenger();
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<IResumeData | null>(null);
  const [isFileDownloading, setIsFileDownloading] = useState(false);
  const [isJobSearchingLoading, setIsJobSearchingLoading] = useState(false);

  const showSearchWithResumeMsg = (file: File, resumeData: IResumeData) => {
    const isLastMsgEqualToUploadType =
      messages[0].content.subType === MessageType.UPLOAD_CV;
    isLastMsgEqualToUploadType &&
      triggerAction({ type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV });
    saveResume(file, resumeData);
  };

  useEffect(() => {
    let reader = new FileReader();

    reader.onloadend = () => {
      if (file && reader.result) {
        const result = reader.result as string;

        const resumeData = {
          candidateId: 50994334,
          fileName: file.name,
          lastModified: `${new Date(file.lastModified).toISOString()}`,
          blob: result.replace(`data:${file.type};base64,`, ""),
        };
        setResumeData(resumeData);
        showSearchWithResumeMsg(file, resumeData);
      }
    };

    file && reader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    if (currentMsgType === CHAT_ACTIONS.SET_LOCATIONS) {
      setJobPositions([]);
      resetFile();
    }
  }, [currentMsgType]);

  useEffect(() => {
    if (resumeId) {
      submitMessage({
        type: MessageType.FILE,
        messageId: resumeId,
      });
    }
  }, [resumeId]);

  const searchWithResume = async () => {
    if (resumeData && resumeId) {
      setIsJobSearchingLoading(true);

      try {
        const { blob, ...data } = resumeData;
        const payload = {
          ...data,
          resumeBlob: blob,
        };

        const response = await apiInstance.searchWithResume(payload);

        response.data &&
          triggerAction({
            type: CHAT_ACTIONS.SEARCH_WITH_RESUME,
            payload: { items: response.data.requisitions },
          });
      } catch (error) {
      } finally {
        setIsJobSearchingLoading(false);
      }
    }

    // setFile(null);
  };

  const saveResume = async (file: File, resumeData: IResumeData) => {
    setIsFileDownloading(true);
    try {
      const response = await apiInstance.uploadCV(resumeData);
      response.data?.resumeId && setResumeId(response.data?.resumeId);
    } catch (error) {
    } finally {
      setIsFileDownloading(false);
    }
  };

  const showFile = (file: File) => {
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
        showFile,
        searchWithResume,
        resetFile,
        notification,
        setNotification,
        resumeData,
        isFileDownloading,
        isJobSearchingLoading,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

const useFileUploadContext = () => useContext(FileUploadContext);

export { FileUploadProvider, useFileUploadContext };
