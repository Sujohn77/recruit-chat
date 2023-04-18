import { useFileUploadContext } from "contexts/FileUploadContext";
import { ChangeEvent, FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

import { ICONS } from "assets";
import { DragAndDrop } from "components";
import { ThemeType } from "utils/theme/default";
import { resumeElementId } from "utils/constants";
import { Close } from "components/Intro/DefaultMessages/styles";
import * as S from "./styles";
import * as ChatStyles from "../../../../styles";

export const BrowseFile: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const inputFile = useRef<HTMLInputElement>(null);
  const { file, notification, resetFile, showFile } = useFileUploadContext();

  const handleDrop = (upload: File) => {
    showFile(upload);
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
    if (inputFile.current) {
      inputFile.current.value = "";
    }
    resetFile();
  };

  return (
    <S.Wrapper>
      <DragAndDrop handleDrop={handleDrop}>
        <S.Circle>
          <S.Avatar onClick={onHandleUpload} />
        </S.Circle>

        <S.Text>{t("messages:uploadCV")}</S.Text>
        <S.Text>or</S.Text>
        <S.Browse htmlFor={resumeElementId}>{t("buttons:browse")}</S.Browse>
        <input
          type="file"
          id={resumeElementId}
          name="myfile"
          ref={inputFile}
          accept=".pdf,.doc,.docx"
          hidden
          onChange={onChangeFile}
        />
        {file && (
          <S.Cancel onClick={onClearFile}>{t("buttons:cancel")}</S.Cancel>
        )}
      </DragAndDrop>

      {(file || notification) && (
        <ChatStyles.Notification>
          {file?.name && <ChatStyles.Icon src={ICONS.ATTACHED_FILE} />}

          <ChatStyles.NotificationText>
            {file?.name || notification}
          </ChatStyles.NotificationText>

          {file?.name && (
            <Close
              onClick={onClearFile}
              color={theme.primaryColor}
              style={{ top: "calc(50% - 8px)" }}
            />
          )}
        </ChatStyles.Notification>
      )}
    </S.Wrapper>
  );
};
