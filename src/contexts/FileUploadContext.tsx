/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import { IFileUploadContext } from './types';
import { fileUploadDefaultState } from 'utils/helpers';
import { useChatMessenger } from './MessangerContext';
import { CHAT_ACTIONS, MessageType } from 'utils/types';
import { apiInstance } from 'services';

type PropsType = {
    children: React.ReactNode;
};

export interface IResumeData {
    candidateId: number;
    fileName: string;
    lastModified: string;
    blob: string | ArrayBuffer;
}

const FileUploadContext = createContext<IFileUploadContext>(fileUploadDefaultState);

const FileUploadProvider = ({ children }: PropsType) => {
    const { triggerAction, messages, submitMessage } = useChatMessenger();
    const [file, setFile] = useState<File | null>(null);
    const [messageId, setMessageId] = useState<number | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [resumeData, setResumeData] = useState<IResumeData | null>(null);

    const showSearchWithResumeMsg = (file: File) => {
        const isLastMsgEqualToUploadType = messages[0].content.subType === MessageType.UPLOAD_CV;
        isLastMsgEqualToUploadType && triggerAction({ type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV });
        saveResume(file);
    };

    useEffect(() => {
        let reader = new FileReader();

        reader.onloadend = () => {
            if (file && reader.result) {
                const result = reader.result as string;

                const data = {
                    candidateId: 50994334,
                    fileName: file.name,
                    lastModified: `${new Date(file.lastModified).toISOString()}`,
                    blob: result.replace(`data:${file.type};base64,`, ''),
                };
                setResumeData(data);
            }
        };

        if (file) {
            showSearchWithResumeMsg(file);
        }

        file && reader.readAsDataURL(file);
    }, [file]);

    useEffect(() => {
        if (messageId) {
            submitMessage({
                type: MessageType.FILE,
                messageId,
            });
        }
    }, [messageId]);

    const searchWithResume = async () => {
        if (resumeData) {
            const { blob, ...data } = resumeData;
            const response = await apiInstance.searchWithResume({ ...data, resumeBlob: blob });

            response.data &&
                triggerAction({
                    type: CHAT_ACTIONS.SEARCH_WITH_RESUME,
                    payload: { items: response.data.requisitions },
                });
        }

        setFile(null);
    };

    const saveResume = async (file: File) => {
        if (resumeData) {
            const response = await apiInstance.uploadCV(resumeData);
            response.data?.resumeId && setMessageId(response.data?.resumeId); // REPLACE when backend messages scheme is ready
        }
    };

    const showFile = (file: File) => {
        if (file.size > 2097152) {
            setNotification('File may not be more than 2MB');
            setFile(null);
            return;
        }
        notification && setNotification(null);
        setFile(file);
    };

    const resetFile = () => {
        triggerAction({ type: CHAT_ACTIONS.RESET_FILE });
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
            }}
        >
            {children}
        </FileUploadContext.Provider>
    );
};

const useFileUploadContext = () => useContext(FileUploadContext);

export { FileUploadProvider, useFileUploadContext };
