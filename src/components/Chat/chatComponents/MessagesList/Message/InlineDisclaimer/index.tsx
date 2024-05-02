import { useChatMessenger } from "contexts/MessengerContext";
import { FC, useMemo } from "react";
import Linkify from "linkify-react";

import { Link } from "./styles";
import * as S from "../styles";
import { renderSendingTime } from "..";
import { getMessageProps } from "utils/helpers";
import { ILocalMessage } from "utils/types";
import { useTheme } from "styled-components";
import { DefaultThemeType } from "utils/theme/default";

interface IInlineDisclaimerProps {
  message: ILocalMessage;
}

export const InlineDisclaimer: FC<IInlineDisclaimerProps> = ({ message }) => {
  const { inlineDisclaimer, PPLinkUrl, PPLinkInnerText, currentLanguage } =
    useChatMessenger();
  const messageProps = { ...getMessageProps(message) };

  const theme = useTheme() as DefaultThemeType;
  const backgroundColor = messageProps.isOwn
    ? theme.primaryColor
    : theme.message.chat.backgroundColor;

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

  return !!disclaimerText ? (
    <S.Wrapper>
      {message.sender?.firstName && (
        <S.Sender isOwn={!!message.isOwn}>
          {message.sender?.firstName} {message.sender?.lastName}
        </S.Sender>
      )}
      <S.MessageBox
        {...messageProps}
        style={{
          background: message.background || backgroundColor,
          border: message.border,
        }}
      >
        <S.MessageContent
          withOptions={!!message?.optionList}
          isOwn={message.isOwn}
        >
          <span>
            <Linkify
              options={{
                render: () => (
                  <Link target="_blank" href={PPLinkUrl || ""}>
                    {PPLinkInnerText}
                  </Link>
                ),
              }}
            >
              {disclaimerText}
            </Linkify>
          </span>

          {renderSendingTime(message)}
        </S.MessageContent>
      </S.MessageBox>
    </S.Wrapper>
  ) : null;
};
