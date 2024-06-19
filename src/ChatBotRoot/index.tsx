import { ChatProvider } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { IApiThemeResponse, IPrivacyPolicy } from "utils/types";
import {
  LOG,
  isStringArray,
  locationsStrToArray,
  postMessToParent,
} from "utils/helpers";
import { EventIds, SessionStorage, isMobile } from "utils/constants";
import { COLORS } from "utils/colors";

type BooleanInString = "true" | "false";

export interface IParentMessage {
  guid?: string;
  style?: IApiThemeResponse;
  token?: string;
  props?: {
    referralEnabled?: BooleanInString;
    companyName?: string;
    referralListDomain?: string;
    clientApiToken?: string;
    jobSourceId?: string;
    multiLanguage?: boolean;
    languages?: string;
    queueId?: string;
    alertTemplateId?: string;
    defaultLanguage?: string;
    // privacy policy
    consentOptIn?: string;
    consentOptInContinueLinkInnerText?: string;
    footerPrivacyLink?: string;
    inlineDisclaimer?: string;
    privacyPolicyLinkInnerText?: string;
    privacyPolicyLinkUrl?: string;
    jobsearchEnabled?: BooleanInString;
  };
  companyName?: string;
  referralListDomain?: string;
  clientApiToken?: string;
  hostname?: string;
  pathname?: string;
}

export const ChatBotRoot: FC = () => {
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [chatBotID, setChatBotID] = useState<string | null>(null);
  const [companyName, setReferralCompanyName] = useState<string | null>(null);
  const [isReferralEnabled, setIsReferralEnabled] = useState<boolean>(false);
  const [chatBotToken, setChatBotToken] = useState("");
  const [chatBotRefBaseURL, setChatBotRefBaseURL] = useState("");
  const [clientApiToken, setClientApiToken] = useState("");
  const [jobSourceId, setJobSourceId] = useState("");
  const [hostname, setHostname] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [isMultiLanguage, seTisMultiLanguage] = useState(false);
  const [chatQueueId, setChatQueueId] = useState<number | null>(null);
  const [alertTemplateId, setAlertTemplateId] = useState<number>();
  const [withFindJobOption, setWithFindJobOption] = useState(false);
  const [parentPathname, setParenPathname] = useState("/");

  // PP
  const [consentOptIn, setConsentOptIn] = useState<IPrivacyPolicy | null>(null);
  const [inlineDisclaimer, setInlineDisclaimer] =
    useState<IPrivacyPolicy | null>(null);
  const [footerPrivacyLink, setFooterPrivacyLink] =
    useState<IPrivacyPolicy | null>(null);
  const [PPLinkUrl, setPPLinkUrl] = useState<string | null>(null);

  useEffect(() => {
    postMessToParent(EventIds.IsMobile, { isMobile: isMobile });
    postMessToParent(EventIds.ChatbotVersion, {
      CODE_VERSION: process.env.REACT_APP_CODE_VERSION,
      ENV_TYPE: process.env.REACT_APP_ENV_TYPE,
    });
  }, []);

  useEffect(() => {
    const onMessage = ({ data }: MessageEvent<IParentMessage>) => {
      LOG(data, "data", COLORS.BLACK, COLORS.WHITE);
      const { props, style, hostname, token, guid, pathname } = data;
      hostname && setHostname(hostname);
      style && setTheme(style);

      if (props) {
        const {
          clientApiToken,
          companyName,
          jobSourceId,
          referralEnabled,
          referralListDomain,
          multiLanguage,
          languages: apiLanguages,
          queueId,
          alertTemplateId,
          defaultLanguage,

          consentOptIn,
          footerPrivacyLink,
          inlineDisclaimer,
          privacyPolicyLinkUrl,
          jobsearchEnabled,
        } = props;

        if (jobsearchEnabled === "true") {
          setWithFindJobOption(true);
        }
        alertTemplateId && setAlertTemplateId(+alertTemplateId);
        queueId && setChatQueueId(+queueId);
        setIsReferralEnabled(referralEnabled === "true");
        companyName && setReferralCompanyName(companyName);
        referralListDomain && setChatBotRefBaseURL(referralListDomain);
        clientApiToken && setClientApiToken(clientApiToken);
        jobSourceId && setJobSourceId(jobSourceId);
        seTisMultiLanguage(!!multiLanguage);

        const chatbotLanguages = locationsStrToArray(apiLanguages);
        chatbotLanguages?.length &&
          isStringArray(chatbotLanguages) &&
          setLanguages(chatbotLanguages);

        if (defaultLanguage && chatbotLanguages.includes(defaultLanguage)) {
          setDefaultLanguage(defaultLanguage);
        }

        if (consentOptIn) {
          setConsentOptIn(JSON.parse(consentOptIn));
        }
        if (footerPrivacyLink) {
          setFooterPrivacyLink(JSON.parse(footerPrivacyLink));
        }

        if (inlineDisclaimer) {
          setInlineDisclaimer(JSON.parse(inlineDisclaimer));
        }

        pathname && setParenPathname(pathname);
        privacyPolicyLinkUrl && setPPLinkUrl(privacyPolicyLinkUrl);
      }

      if (token) {
        setChatBotToken(token);
        sessionStorage.setItem(SessionStorage.Token, token);
      }

      if (guid) {
        const storedLastActivity = localStorage.getItem(
          hostname + "lastActivity"
        );
        if (storedLastActivity) {
          const date = new Date().getTime();
          const lastDate = new Date(storedLastActivity).getTime();
          const timeDifference = (date - lastDate) / (1000 * 60 * 60);

          if (timeDifference > 0.5) {
            localStorage.clear();
          }
        }

        setChatBotID(guid);
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    // for Safari (iframe.onload didn't work)
    let timeout: NodeJS.Timeout;
    if (!chatBotID) {
      timeout = setTimeout(() => {
        postMessToParent(EventIds.GetChatBotData);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [chatBotID]);

  return (
    <Container id="chat-bot" isMobile={isMobile}>
      {chatBotID && (
        <ChatProvider
          PPLinkUrl={PPLinkUrl}
          inlineDisclaimer={inlineDisclaimer}
          footerPrivacyLink={footerPrivacyLink}
          consentOptIn={consentOptIn}
          chatQueueId={chatQueueId}
          chatBotToken={chatBotToken}
          clientApiToken={clientApiToken}
          companyName={companyName}
          chatBotRefBaseURL={chatBotRefBaseURL}
          isReferralEnabled={isReferralEnabled}
          jobSourceID={jobSourceId}
          hostname={hostname}
          languages={languages}
          isMultiLanguage={isMultiLanguage}
          alertTemplateId={alertTemplateId}
          defaultLanguage={defaultLanguage}
          withFindJobOption={withFindJobOption}
          parentPathname={parentPathname}
          chatBotId={chatBotID}
        >
          <ThemeContextProvider value={theme}>
            <FileUploadProvider>
              <Content />
            </FileUploadProvider>
          </ThemeContextProvider>
        </ChatProvider>
      )}
    </Container>
  );
};
