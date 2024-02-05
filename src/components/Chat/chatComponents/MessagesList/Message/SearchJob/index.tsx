import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ILocalMessage, ButtonsOptions } from "utils/types";
import { getMessageProps } from "utils/helpers";
import { resumeElementId } from "utils/constants";
import * as S from "../styles";
import { renderSendingTime } from "..";

interface IProps {
  message: ILocalMessage;
  isLastMessage?: boolean;
}

//TODO: text isLastMessage

export const SearchJob: FC<IProps> = ({ message, isLastMessage }) => {
  const { t } = useTranslation();
  const { chooseButtonOption } = useChatMessenger();
  const { resetFile, searchWithResume, isJobSearchingLoading, file } =
    useFileUploadContext();

  const onSearchWithResume = () => {
    if (isLastMessage) {
      if (file?.name) {
        chooseButtonOption(ButtonsOptions.UPLOADED_CV, file?.name);
      }
      searchWithResume();
    }
  };

  const onResetResume = () => {
    if (isLastMessage) {
      const resumeInput = document.getElementById(
        resumeElementId
      ) as HTMLInputElement;

      if (resumeInput) {
        resumeInput.value = "";
        resetFile();
      }

      chooseButtonOption(ButtonsOptions.CANCEL_JOB_SEARCH_WITH_RESUME);
    }
  };

  return (
    <S.MessageBox {...getMessageProps(message)}>
      {message?.content?.text && (
        <S.MessageText>{message.content.text}</S.MessageText>
      )}

      <S.ActionButton
        onClick={onSearchWithResume}
        disabled={isJobSearchingLoading || !isLastMessage}
      >
        {t("buttons:searchJobs")}
      </S.ActionButton>

      {renderSendingTime(message)}

      <S.Cancel
        onClick={onResetResume}
        disabled={isJobSearchingLoading || !isLastMessage}
      >
        {t("buttons:cancel")}
      </S.Cancel>
    </S.MessageBox>
  );
};
