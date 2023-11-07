/* eslint-disable react-hooks/exhaustive-deps */
import { useChatMessenger } from "./MessengerContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { IFileUploadContext } from "./types";
import { apiInstance } from "services/api";
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
  showJobTitles: false,
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
    dispatch,
    messages,
    submitMessage,
    currentMsgType,
    setJobPositions,
    _setMessages,
    candidateId,
  } = useChatMessenger();

  // ----------------------------- STATE ----------------------------- //
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<IResumeData | null>(null);
  const [isFileDownloading, setIsFileDownloading] = useState(false);
  const [isJobSearchingLoading, setIsJobSearchingLoading] = useState(false);
  const [showJobTitles, setShowJobTitles] = useState(false);
  // ---------------------------------------------------------------- //

  useEffect(() => {
    let timeout: undefined | NodeJS.Timeout;
    // return trigger to the default state (if active)
    if (showJobTitles) {
      timeout = setTimeout(() => setShowJobTitles(false), 1000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [showJobTitles]);

  useEffect(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (file && reader.result && candidateId) {
        const result = reader.result as string;

        const resumeData = {
          candidateId: candidateId,
          fileName: file.name,
          lastModified: `${new Date(file.lastModified).toISOString()}`,
          blob: result.replace(`data:${file.type};base64,`, ""),
        };
        setResumeData(resumeData);
        uploadCVHandler(resumeData);
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

  const uploadCVHandler = async (resumeData: IResumeData) => {
    setIsFileDownloading(true);
    try {
      const response = await apiInstance.uploadCV(resumeData);

      if (response.data?.resumeId) {
        setResumeId(response.data?.resumeId);

        const isLastMsgEqualToUploadType =
          messages[0].content.subType === MessageType.UPLOAD_CV;

        if (isLastMsgEqualToUploadType) {
          dispatch({ type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV });
        }
      }
    } catch (error) {
      // TODO: add error handler
    } finally {
      setIsFileDownloading(false);
    }
  };

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
          setShowJobTitles(true);

          dispatch({
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

  const showFile = useCallback(
    (file: File) => {
      if (file.size > 2097152) {
        setNotification("File may not be more than 2MB");
        setFile(null);

        return;
      }

      notification && setNotification(null);
      setFile(file);
    },
    [notification]
  );

  const resetFile = useCallback(() => {
    setFile(null);
    setNotification(null);
  }, []);

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
        showJobTitles,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

const useFileUploadContext = () => useContext(FileUploadContext);

export { FileUploadProvider, useFileUploadContext };
