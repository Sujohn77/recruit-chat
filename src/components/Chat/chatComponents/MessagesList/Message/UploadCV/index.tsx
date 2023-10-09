import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import { ChangeEvent, FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";

import { ICONS } from "assets";
import { DragAndDrop } from "components";
import { ThemeType } from "utils/theme/default";
import { resumeElementId } from "utils/constants";
import { Close } from "components/Intro/DefaultMessages/styles";
import * as S from "./styles";
import * as ChatStyles from "../../../../styles";
import { ButtonsOptions } from "utils/types";

interface IUploadCVProps {
  isLastMessage?: boolean;
  withoutMargin?: boolean;
}

export const UploadCV: FC<IUploadCVProps> = ({
  isLastMessage,
  withoutMargin,
}) => {
  const { t } = useTranslation();
  const theme = useTheme() as ThemeType;
  const inputFile = useRef<HTMLInputElement>(null);
  const { file, notification, resetFile, showFile } = useFileUploadContext();
  const { chooseButtonOption } = useChatMessenger();

  useEffect(() => {
    return () => {
      resetFile();
    };
  }, []);

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.files?.length) {
      const file = event.target.files[0];
      showFile(file);
    }
  };

  const onHandleUpload = () => inputFile.current?.click();

  const onClearFile = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
    }
    resetFile();
    chooseButtonOption(ButtonsOptions.CANCEL_JOB_SEARCH_WITH_RESUME);
  };

  return (
    <S.Wrapper style={{ marginBottom: withoutMargin ? 0 : 32 }}>
      <DragAndDrop handleDrop={showFile}>
        <S.Circle onClick={onHandleUpload}>
          <S.UploadImg />
        </S.Circle>

        <S.Text>{t("messages:uploadCV")}</S.Text>

        <S.Text>or</S.Text>
        <S.Button htmlFor={isLastMessage ? resumeElementId : ""}>
          {t("buttons:browse")}
        </S.Button>

        <input
          hidden
          type="file"
          name="myfile"
          accept=".pdf,.doc,.docx"
          id={resumeElementId}
          ref={inputFile}
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

      {/* {uploadedFileName && (
        <ChatStyles.Notification>
          {uploadedFileName && <ChatStyles.Icon src={ICONS.ATTACHED_FILE} />}

          <ChatStyles.NotificationText>
            {uploadedFileName}
          </ChatStyles.NotificationText>
        </ChatStyles.Notification>
      )} */}
    </S.Wrapper>
  );
};
