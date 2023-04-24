import { useFileUploadContext } from "contexts/FileUploadContext";
import { FC, memo } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { IMAGES } from "assets";
import { ILocalMessage } from "utils/types";
import { getMessageProps } from "utils/helpers";
import { resumeElementId } from "utils/constants";
import { MS_1000 } from "..";
import * as S from "../styles";

interface IProps {
  message: ILocalMessage;
  isLastMessage?: boolean;
  buttonTxt: string;
}

export const SubmitFileMessage: FC<IProps> = memo(
  ({ message, isLastMessage, buttonTxt }) => {
    const { t } = useTranslation();
    const { resetFile, searchWithResume, isJobSearchingLoading } =
      useFileUploadContext();

    const createdAt = moment(message.dateCreated?.seconds! * MS_1000).format(
      "HH:mm A"
    );

    const renderSendingTime = (message: ILocalMessage) => {
      if (message.localId !== message._id && message.isOwn) {
        return message._id ? (
          <S.TimeText>{createdAt}</S.TimeText>
        ) : (
          <S.MessageUnsendIcon src={IMAGES.CLOCK} />
        );
      }

      return null;
    };

    const onResetResume = () => {
      const resumeInput = document.getElementById(
        resumeElementId
      ) as HTMLInputElement;

      if (resumeInput) {
        resumeInput.value = "";
        resetFile();
      }
    };

    return (
      <S.MessageBox {...getMessageProps(message)} isLastMessage={isLastMessage}>
        {message.content.text && (
          <S.MessageText>{message.content.text}</S.MessageText>
        )}

        {!!buttonTxt && (
          <S.ActionButton
            disabled={isJobSearchingLoading}
            onClick={searchWithResume}
          >
            {buttonTxt}
          </S.ActionButton>
        )}

        {renderSendingTime(message)}

        {<S.Cancel onClick={onResetResume}>{t("buttons:cancel")}</S.Cancel>}
      </S.MessageBox>
    );
  }
);
