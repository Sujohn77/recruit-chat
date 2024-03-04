import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useMemo } from "react";
import { useTheme } from "styled-components";

import { OptionList } from "./OptionList";
import { LocationList, LocationItem } from "./styles";
import { renderSendingTime } from "..";
import * as S from "../styles";
import { Icon } from "../../styles";
import { ICONS } from "assets";
import { getMessageProps } from "utils/helpers";
import { MessageOptionTypes, MessageStatuses } from "utils/constants";
import { COLORS } from "utils/colors";
import { ThemeType } from "utils/theme/default";
import { ILocalMessage, MessageType } from "utils/types";

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
  const { referralCompanyName, offerJobs } = useChatMessenger();

  const messageText = useMemo(() => {
    const withMaxTextWidth =
      message.optionList?.type !== MessageOptionTypes.AvailableJobs;
    const jobOffer = offerJobs.find(
      (o) => o.id.toString() === message.jobId?.toString()
    );

    if (jobOffer?.title && message?.content?.text?.includes(jobOffer?.title)) {
      const index = message.content.text.indexOf(jobOffer?.title);
      return (
        <S.MessageText>
          {message?.content?.text.substring(0, index)}
          <S.MessageText fontWeight={700}>{jobOffer?.title}</S.MessageText>
          {message.content.text.substring(index + jobOffer?.title.length)}
        </S.MessageText>
      );
    }

    if (
      referralCompanyName &&
      message?.content?.text?.includes(referralCompanyName)
    ) {
      const index = message.content.text.indexOf(referralCompanyName);

      return (
        <S.MessageText withMaxWidth={withMaxTextWidth}>
          {message?.content?.text.substring(0, index)}
          <S.MessageText fontWeight={700}>{referralCompanyName}</S.MessageText>
          {message.content.text.substring(index + referralCompanyName.length)}
        </S.MessageText>
      );
    } else {
      return (
        <S.MessageText withMaxWidth={withMaxTextWidth}>
          {message?.content?.text}
        </S.MessageText>
      );
    }
  }, []);

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
  );
};
