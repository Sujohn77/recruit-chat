import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useMemo } from "react";
import Linkify from "linkify-react";

import { Link, Text } from "./styles";
import * as S from "../styles";
import { getIsNextMsgFromSameSender, getMessageProps } from "utils/helpers";
import { ILocalMessage } from "utils/types";
import { useTheme } from "styled-components";
import { DefaultThemeType } from "utils/theme/default";
import { useTranslation } from "react-i18next";

interface IInlineDisclaimerProps {
  message: ILocalMessage;
  isLastMess: boolean;
}

export const InlineDisclaimer: FC<IInlineDisclaimerProps> = ({
  message,
  isLastMess,
}) => {
  const { t } = useTranslation();
  const {
    inlineDisclaimer,
    PPLinkUrl,
    currentLanguage,
    companyName,
    messages,
  } = useChatMessenger();
  const msgProps = { ...getMessageProps(message) };

  const theme = useTheme() as DefaultThemeType;
  const backgroundColor = msgProps.isOwn
    ? theme.userMessageBubbleColor
    : theme.messageBubbleColor;

  const disclaimerText = useMemo<string>(() => {
    let text = "";
    const link = PPLinkUrl ? PPLinkUrl : " ";
    switch (currentLanguage) {
      case "en":
        if (inlineDisclaimer?.content_en) {
          text = inlineDisclaimer.content_en?.replace(
            "{privacyPolicyLink}",
            link
          );
        }
        break;
      case "fr":
        if (inlineDisclaimer?.content_fr) {
          text = inlineDisclaimer.content_fr?.replace(
            "{privacyPolicyLink}",
            link
          );
        }
        break;
      default:
        break;
    }
    return text.trim();
  }, [currentLanguage, inlineDisclaimer, PPLinkUrl]);

  const isNextMessFromSameSender = getIsNextMsgFromSameSender({
    currentMess: message,
    messages: messages,
  });

  return !!disclaimerText ? (
    <S.Wrapper>
      <S.MessageBox
        {...msgProps}
        isWarningMess={isNextMessFromSameSender}
        style={{
          background: message.background || backgroundColor,
          border: message.border,
          marginBottom: isNextMessFromSameSender ? "4px" : "22px",
        }}
      >
        <S.MessageContent
          withOptions={!!message?.optionList}
          isOwn={message.isOwn}
        >
          <span style={{ fontWeight: 400, fontSize: 12 }}>
            <Linkify
              options={{
                render: () => (
                  <Link target="_blank" href={PPLinkUrl || ""}>
                    {t("labels:privacy_policy", { companyName })}
                  </Link>
                ),
              }}
            >
              <Text style={{ fontWeight: 400 }}>{disclaimerText}</Text>
            </Linkify>
          </span>
        </S.MessageContent>
      </S.MessageBox>
    </S.Wrapper>
  ) : null;
};
