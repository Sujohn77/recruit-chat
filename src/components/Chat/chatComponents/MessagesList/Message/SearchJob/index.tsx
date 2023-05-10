import { useFileUploadContext } from "contexts/FileUploadContext";
import { useChatMessenger } from "contexts/MessengerContext";
import { FC, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { IMAGES } from "assets";
import { ILocalMessage, USER_INPUTS } from "utils/types";
import { getMessageProps } from "utils/helpers";
import { resumeElementId } from "utils/constants";
import { MS_1000 } from "..";
import * as S from "../styles";

interface IProps {
  message: ILocalMessage;
  isLastMessage?: boolean;
}

export const SearchJob: FC<IProps> = memo(({ message, isLastMessage }) => {
  const { t } = useTranslation();
  const { chooseButtonOption } = useChatMessenger();
  const { resetFile, searchWithResume, isJobSearchingLoading, file } =
    useFileUploadContext();

  const onSearchWithResume = () => {
    if (isLastMessage) {
      if (file?.name) {
        chooseButtonOption(USER_INPUTS.UPLOADED_CV, file?.name);
        resetFile();
      }
      searchWithResume();
    }
  };

  const renderSendingTime = useCallback((message: ILocalMessage) => {
    if (message.localId !== message._id && message.isOwn) {
      return message._id ? (
        <S.TimeText>
          {moment(message.dateCreated?.seconds! * MS_1000).format("HH:mm A")}
        </S.TimeText>
      ) : (
        <S.MessageUnsendIcon src={IMAGES.CLOCK} />
      );
    }

    return null;
  }, []);

  const onResetResume = () => {
    if (isLastMessage) {
      const resumeInput = document.getElementById(
        resumeElementId
      ) as HTMLInputElement;

      if (resumeInput) {
        resumeInput.value = "";
        resetFile();
      }

      chooseButtonOption(USER_INPUTS.CANCEL_JOB_SEARCH_WITH_RESUME);
    }
  };

  return (
    <S.MessageBox {...getMessageProps(message)} isLastMessage={isLastMessage}>
      {message.content.text && (
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
});
