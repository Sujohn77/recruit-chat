import React, { ChangeEvent, FC, useRef } from 'react';
import { useFileUploadContext } from 'contexts/FileUploadContext';
import DragAndDrop from 'components/DragAndDrop';

import * as S from './styles';
import i18n from 'services/localization';

type PropsType = {};

export const BrowseFile: FC<PropsType> = () => {
    const { file, saveFile, resetFile } = useFileUploadContext();
    const inputFile = useRef<HTMLInputElement>(null);

    const handleDrop = (upload: File) => {
        saveFile(upload);
    };

    const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.files?.length) {
            const file = event.target.files[0];
            handleDrop(file);
        }
    };

    const onHandleUpload = () => {
        inputFile.current?.click();
    };

    const onClearFile = () => {
        resetFile();
    };
    const browseTxt = i18n.t('buttons:browse');
    const cancelTxt = i18n.t('buttons:cancel');
    const dragAndDropTxt = i18n.t('messages:uploadCV');

    return (
        <div>
            <DragAndDrop handleDrop={handleDrop}>
                <S.Circle>
                    <S.Avatar onClick={onHandleUpload} />
                </S.Circle>

                <S.Text>{dragAndDropTxt}</S.Text>
                <S.Text>or</S.Text>
                <S.Browse htmlFor="myfile">{browseTxt}</S.Browse>
                <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    ref={inputFile}
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={onChangeFile}
                />
                {file && <S.Cancel onClick={onClearFile}>{cancelTxt}</S.Cancel>}
            </DragAndDrop>
        </div>
    );
};
