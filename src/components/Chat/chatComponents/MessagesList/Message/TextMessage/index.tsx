import { useChatMessenger } from "contexts/MessengerContext";
import { FC, ReactNode, useMemo } from "react";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";
import Linkify from "linkify-react";

import { OptionList } from "./OptionList";
import { LocationList, LocationItem, LinkWrapper, SendingTime } from "./styles";
import { renderSendingTime } from "..";
import * as S from "../styles";
import { Icon } from "../../styles";
import { ICONS } from "assets";
import { COLORS } from "utils/colors";
import { useGetMessageText } from "utils/hooks";
import { ILocalMessage, MessageType } from "utils/types";
import { MessageOptionTypes, MessageStatuses } from "utils/constants";
import { getIsNextMsgFromSameSender, getMessageProps } from "utils/helpers";
import { DefaultThemeType } from "utils/theme/default";

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
  const { messages, chatbotName } = useChatMessenger();
  const theme = useTheme() as DefaultThemeType;
  const {
    companyName: referralCompanyName,
    offerJobs,
    currentLanguage,
    consentOptIn,
    firstName,
    lastName,
  } = useChatMessenger();
  const altMessText = useGetMessageText(message);
  const { t, i18n } = useTranslation();

  const senderName = useMemo<string>(
    () =>
      message.isOwn
        ? firstName && lastName
          ? `${firstName} ${lastName}`
          : `${message.sender?.firstName || ""} ${
              message.sender?.lastName || ""
            }`
        : message.sender?.firstName
        ? `${message.sender?.firstName || ""} ${message.sender?.lastName || ""}`
        : chatbotName || "",
    [message, firstName, lastName, chatbotName]
  );

  const messageText = useMemo((): ReactNode => {
    const { content } = message;
    const withMaxTextWidth =
      message.optionList?.type !== MessageOptionTypes.AvailableJobs;
    const jobOffer = offerJobs.find(
      (o) => o.id.toString() === message.jobId?.toString()
    );

    if (message.optionList?.type === MessageOptionTypes.Consent) {
      return (
        <S.MessageText>
          {currentLanguage === "en" && consentOptIn?.content_en
            ? consentOptIn?.content_en
            : consentOptIn?.content_fr || altMessText}
        </S.MessageText>
      );
    } else if (jobOffer?.title && content?.text?.includes(jobOffer?.title)) {
      const index = content?.text?.indexOf(jobOffer?.title);
      return (
        <S.MessageText>
          {content?.text?.substring(0, index)}
          <S.MessageText>{jobOffer?.title}</S.MessageText>
          {content?.text?.substring(index + jobOffer?.title.length)}
        </S.MessageText>
      );
    } else if (
      referralCompanyName &&
      content?.text?.includes(referralCompanyName)
    ) {
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
          <S.MessageText>{referralCompanyName}</S.MessageText>
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
  }, [currentLanguage, consentOptIn]);

  const isNextMessFromSameSender = getIsNextMsgFromSameSender({
    isLastMess,
    currentMess: message,
    messages: messages,
  });

  const isErrorMessage = message.content.isError;
  const messageProps = { ...getMessageProps(message) };
  const subType = message?.content.subType;
  const isFile = subType === MessageType.FILE;
  const wrongMess = !!message.isOwn && !!message.optionList;
  const isWarningMess = message?.optionList?.status === MessageStatuses.warning;
  const backgroundColor =
    isWarningMess || isErrorMessage
      ? COLORS.PIPPIN
      : messageProps.isOwn
      ? theme.userMessageBubbleColor
      : theme.messageBubbleColor;

  return wrongMess ? null : (
    <S.Wrapper position="relative">
      <S.MessageBox
        {...messageProps}
        isWarningMess={
          isWarningMess || !!message.background || isNextMessFromSameSender
        }
        nextMessFromSameSender={isNextMessFromSameSender}
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
          ) : message.isOwn ? (
            messageText
          ) : (
            <Linkify
              options={{
                render: ({ attributes, content }) => (
                  <LinkWrapper
                    style={{
                      color: theme?.linkColor,
                    }}
                    onClick={() => {
                      const newTab = window.open(
                        `${attributes.href}`,
                        "_blank"
                      );
                      newTab?.focus();
                    }}
                    {...attributes.props}
                  >
                    {content}
                  </LinkWrapper>
                ),
              }}
            >
              <S.Text style={{ fontWeight: "400" }}>{messageText}</S.Text>
            </Linkify>
          )}

          <OptionList
            setSelectedReferralJobId={setSelectedReferralJobId}
            message={message}
            isLastMess={isLastMess}
          />
        </S.MessageContent>
      </S.MessageBox>

      {!isNextMessFromSameSender && (
        <SendingTime isOwn={message.isOwn}>
          <S.Sender isOwn={!!message.isOwn}>{senderName}</S.Sender>
          {renderSendingTime(message)}
        </SendingTime>
      )}
    </S.Wrapper>
  );
};
