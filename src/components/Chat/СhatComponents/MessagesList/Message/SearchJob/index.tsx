import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import * as S from "../styles";
import { useGetMessageText } from "utils/hooks";
import { getMessageProps } from "utils/helpers";
import { resumeElementId } from "utils/constants";
import { ILocalMessage, ButtonsOptions } from "utils/types";

interface IProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const SearchJob: FC<IProps> = ({ message, isLastMess }) => {
  const { t } = useTranslation();
  const { chooseButtonOption } = useChatMessenger();
  const { resetFile, searchWithResume, isJobSearchingLoading, file } =
    useFileUploadContext();
  const messageText = useGetMessageText(message);

  const onSearchWithResume = () => {
    if (isLastMess) {
      if (file?.name) {
        chooseButtonOption(ButtonsOptions.UPLOADED_CV, file?.name);
      }
      searchWithResume();
    }
  };

  const onResetResume = () => {
    if (isLastMess) {
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
      <span>{messageText}</span>

      <S.SearchButton
        onClick={onSearchWithResume}
        disabled={isJobSearchingLoading || !isLastMess}
      >
        {t("buttons:searchJobs")}
      </S.SearchButton>

      <S.Cancel
        onClick={onResetResume}
        disabled={isJobSearchingLoading || !isLastMess}
      >
        {t("buttons:cancel")}
      </S.Cancel>
    </S.MessageBox>
  );
};
