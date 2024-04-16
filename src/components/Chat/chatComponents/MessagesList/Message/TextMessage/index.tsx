import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useMemo } from "react";
import { useTheme } from "styled-components";

import { OptionList } from "./OptionList";
import { LocationList, LocationItem } from "./styles";
import { renderSendingTime } from "..";
import * as S from "../styles";
import { Icon } from "../../styles";
import { ICONS } from "assets";
import { LOG, getMessageProps } from "utils/helpers";
import { MessageOptionTypes, MessageStatuses } from "utils/constants";
import { COLORS } from "utils/colors";
import { ThemeType } from "utils/theme/default";
import { ILocalMessage, MessageType } from "utils/types";
import { useGetMessageText } from "utils/hooks";
import { useTranslation } from "react-i18next";

interface ITextMessageProps {
  message: ILocalMessage;
  isLastMess: boolean;
  setSelectedReferralJobId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

export const TextMessage: FC<ITextMessageProps> = ({
  message,
  isLastMess,
  setSelectedReferralJobId,
}) => {
  const theme = useTheme() as ThemeType;
  const { referralCompanyName, offerJobs, currentLanguage } =
    useChatMessenger();
  const altMessText = useGetMessageText(message);
  const { t, i18n } = useTranslation();

  const messageText = useMemo(() => {
    const { content } = message;
    const withMaxTextWidth =
      message.optionList?.type !== MessageOptionTypes.AvailableJobs;
    const jobOffer = offerJobs.find(
      (o) => o.id.toString() === message.jobId?.toString()
    );

    if (jobOffer?.title && content?.text?.includes(jobOffer?.title)) {
      const index = content?.text?.indexOf(jobOffer?.title);
      return (
        <S.MessageText>
          {content?.text?.substring(0, index)}
          <S.MessageText fontWeight={700}>{jobOffer?.title}</S.MessageText>
          {content?.text?.substring(index + jobOffer?.title.length)}
        </S.MessageText>
      );
    }

    if (referralCompanyName && content?.text?.includes(referralCompanyName)) {
      let text = content?.text;
      let index = text.indexOf(referralCompanyName);

      if (message.content.i18n && i18n.exists(message.content.i18n)) {
        text = t(message.content.i18n, {
          companyName: referralCompanyName,
        });
        index = text.indexOf(referralCompanyName);
      }

      return (
        <S.MessageText withMaxWidth={withMaxTextWidth}>
          {text.substring(0, index)}
          <S.MessageText fontWeight={700}>{referralCompanyName}</S.MessageText>
          {text.substring(index + referralCompanyName.length)}
        </S.MessageText>
      );
    } else {
      return (
        <S.MessageText withMaxWidth={withMaxTextWidth}>
          {altMessText}
        </S.MessageText>
      );
    }
  }, [currentLanguage]);

  const isErrorMessage = message.content.isError;
  const messageProps = { ...getMessageProps(message) };
  const subType = message?.content.subType;
  const isFile = subType === MessageType.FILE;
  // TODO: fix
  const wrongMess = !!message.isOwn && !!message.optionList;
  const isWarningMess = message?.optionList?.status === MessageStatuses.warning;
  const backgroundColor =
    isWarningMess || isErrorMessage
      ? COLORS.PIPPIN
      : messageProps.isOwn
      ? theme.primaryColor
      : theme.message.chat.backgroundColor;

  return wrongMess ? null : (
    <S.Wrapper>
      {message.sender?.firstName && (
        <S.Sender isOwn={!!message.isOwn}>
          {message.sender?.firstName} {message.sender?.lastName}
        </S.Sender>
      )}
      <S.MessageBox
        {...messageProps}
        isWarningMess={isWarningMess || !!message.background}
        isError={isErrorMessage}
        style={{
          background: message.background || backgroundColor,
          border: message.border,
        }}
      >
        <S.MessageContent
          isError={isErrorMessage}
          isFile={isFile}
          withOptions={!!message?.optionList}
          isOwn={message.isOwn}
        >
          {isFile && <Icon src={ICONS.ATTACHED_FILE} />}

          {message.content.locations ? (
            <LocationList>
              {message.content.locations.map((l, i) => (
                <LocationItem key={`${l}-${i}`}>{l}</LocationItem>
              ))}
            </LocationList>
          ) : (
            messageText
          )}

          {renderSendingTime(message)}

          <OptionList
            setSelectedReferralJobId={setSelectedReferralJobId}
            message={message}
            isLastMess={isLastMess}
          />
        </S.MessageContent>
      </S.MessageBox>
    </S.Wrapper>
  );
};
