/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "./MessengerContext";
import React, { createContext, useContext, useEffect, useState } from "react";

import { IFileUploadContext } from "./types";
import { apiInstance } from "services";
import { replaceItemsWithType } from "utils/helpers";
import { getChatActionResponse } from "utils/constants";
import { CHAT_ACTIONS, MessageType } from "utils/types";

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
    _setMessages,
  } = useChatMessenger();
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<IResumeData | null>(null);
  const [isFileDownloading, setIsFileDownloading] = useState(false);
  const [isJobSearchingLoading, setIsJobSearchingLoading] = useState(false);

  const uploadCVHandler = async (file: File, resumeData: IResumeData) => {
    setIsFileDownloading(true);
    try {
      const response = await apiInstance.uploadCV(resumeData);

      if (response.data?.resumeId) {
        setResumeId(response.data?.resumeId);

        const isLastMsgEqualToUploadType =
          messages[0].content.subType === MessageType.UPLOAD_CV;

        if (isLastMsgEqualToUploadType) {
          triggerAction({ type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV });
        }
      }
    } catch (error) {
      // TODO: add error handler
    } finally {
      setIsFileDownloading(false);
    }
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
        uploadCVHandler(file, resumeData);
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

        if (response.data) {
          resetFile();
          const updatedMessages = replaceItemsWithType({
            type: MessageType.BUTTON,
            messages,
            excludeItem: CHAT_ACTIONS.UPLOADED_CV,
          });
          const responseMessages = getChatActionResponse({
            type: CHAT_ACTIONS.UPLOADED_CV,
            param: resumeData.fileName,
          });
          _setMessages([...responseMessages, ...updatedMessages]);

          triggerAction({
            type: CHAT_ACTIONS.SEARCH_WITH_RESUME,
            payload: { items: response.data.requisitions },
          });
        }
      } catch (error) {
      } finally {
        setIsJobSearchingLoading(false);
      }
    }

    // setFile(null);
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
