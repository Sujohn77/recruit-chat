import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useMemo } from "react";
import Linkify from "linkify-react";
import { IntermediateRepresentation } from "linkifyjs";

import { Link, Text } from "./styles";
import * as S from "../styles";
import { getIsNextMsgFromSameSender, getMessageProps } from "utils/helpers";
import { ILocalMessage } from "utils/types";
import { useTheme } from "styled-components";
import { DefaultThemeType } from "utils/theme/default";
import { useTranslation } from "react-i18next";

const NOTICE_LINK = "https://gms.loop.jobs/notice-link";

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
    cookiePPLinkUrl,
  } = useChatMessenger();
  const msgProps = { ...getMessageProps(message) };

  const theme = useTheme() as DefaultThemeType;
  const backgroundColor = msgProps.isOwn
    ? theme.userMessageBubbleColor
    : theme.messageBubbleColor;

  const disclaimerText = useMemo<string>(() => {
    let text = "";
    const ppLink = PPLinkUrl?.trim() || " ";
    const cookiesPPLink = cookiePPLinkUrl?.trim() || " ";

    switch (currentLanguage) {
      case "en":
        if (inlineDisclaimer?.content_en) {
          text = inlineDisclaimer.content_en?.replace(
            "{privacyPolicyLink}",
            ppLink
          );
        }
        break;
      case "fr":
        if (inlineDisclaimer?.content_fr) {
          text = inlineDisclaimer.content_fr?.replace(
            "{privacyPolicyLink}",
            ppLink
          );
        }
        break;
      default:
        break;
    }

    return text
      .replaceAll("{companyName}", companyName || "")
      .replaceAll("{secondaryPrivacyPolicyLink}", NOTICE_LINK)
      .replaceAll("{cookiePolicyLink}", cookiesPPLink)
      .trim();
  }, [
    currentLanguage,
    inlineDisclaimer,
    PPLinkUrl,
    cookiePPLinkUrl,
    companyName,
  ]);

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
          <span
            style={{ fontWeight: 400, fontSize: 12, whiteSpace: "pre-line" }}
          >
            <Linkify
              options={{
                render: (ir: IntermediateRepresentation) => {
                  let linkName = t(
                    "labels:privacy_policy_withpout_company_name"
                  );

                  const isCookiesLink =
                    ir.attributes.href === cookiePPLinkUrl?.trim();

                  if (isCookiesLink) {
                    linkName = t("labels:cookies_policy");
                  }
                  return (
                    <Link
                      target="_blank"
                      href={(isCookiesLink ? cookiePPLinkUrl : PPLinkUrl) || ""}
                    >
                      {linkName}
                    </Link>
                  );
                },
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
