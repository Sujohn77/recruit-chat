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

const FileUploadContext = createContext<IFileUploadContext>(fileUploadDefaultState);

const FileUploadProvider = ({ children }: PropsType) => {
    const { triggerAction, messages, submitMessage } = useChatMessenger();
    const [file, setFile] = useState<File | null>(null);
    const [fileResult, setFileResult] = useState<string | ArrayBuffer | null>(null);
    const [messageId, setMessageId] = useState<number | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const showSearchWithResumeMsg = (file: File) => {
        const isLastMsgEqualToUploadType = messages[0].content.subType === MessageType.UPLOAD_CV;
        isLastMsgEqualToUploadType && triggerAction({ type: CHAT_ACTIONS.SUCCESS_UPLOAD_CV });
        saveResume(file);
    };

    useEffect(() => {
        let reader = new FileReader();

        reader.onloadend = () => {
            if (fileResult !== reader.result && file && reader.result) {
                const result = reader.result as string;
                setFileResult(result.replace(`data:${file.type};base64,`, ''));
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

    const sendFile = async (file: File) => {
        triggerAction({
            type: CHAT_ACTIONS.SEARCH_WITH_RESUME,
            payload: { item: file.name },
        });

        setFile(null);
    };

    const saveResume = async (file: File) => {
        const data = {
            candidateId: 50994334,
            fileName: file.name,
            lastModified: `${new Date(file.lastModified).toISOString()}`,
            blob: fileResult!,
        };
        const response = await apiInstance.uploadCV(data);
        response.data?.resumeId && setMessageId(response.data?.resumeId); // REPLACE when backend messages scheme is ready
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
