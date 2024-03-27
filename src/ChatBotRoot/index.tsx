import { ChatProvider } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { IApiThemeResponse } from "utils/types";
import { LOG, isStringArray, postMessToParent } from "utils/helpers";
import { EventIds, SessionStorage } from "utils/constants";
import { COLORS } from "utils/colors";

interface IParentMessage {
  guid?: string;
  style?: IApiThemeResponse;
  token?: string;
  props?: {
    referralEnabled?: "true" | "false";
    companyName?: string;
    referralListDomain?: string;
    clientApiToken?: string;
    jobSourceId?: string;
    multiLanguage?: boolean;
    languages?: string[];
  };
  companyName?: string;
  referralListDomain?: string;
  clientApiToken?: string;
  hostname?: string;
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
  const [languages, setLanguages] = useState<string[]>(["en", "fr"]);
  const [isMultiLanguage, seTisMultiLanguage] = useState(false);

  useEffect(() => {
    const onMessage = ({ data }: MessageEvent<IParentMessage>) => {
      LOG(data, "data", COLORS.BLACK, COLORS.WHITE, true);
      const { props, style, hostname, token, guid } = data;
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
        } = props;

        setIsReferralEnabled(referralEnabled === "true");
        companyName && setReferralCompanyName(companyName);
        referralListDomain && setChatBotRefBaseURL(referralListDomain);
        clientApiToken && setClientApiToken(clientApiToken);
        jobSourceId && setJobSourceId(jobSourceId);
        seTisMultiLanguage(!!multiLanguage);
        apiLanguages?.length &&
          isStringArray(apiLanguages) &&
          setLanguages(apiLanguages);

        // seTisMultiLanguage(true);
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
    <Container id="chat-bot">
      {chatBotID && (
        <ChatProvider
          chatBotId={chatBotID}
          chatBotToken={chatBotToken}
          clientApiToken={clientApiToken}
          companyName={companyName}
          chatBotRefBaseURL={chatBotRefBaseURL}
          isReferralEnabled={isReferralEnabled}
          jobSourceID={jobSourceId}
          hostname={hostname}
          languages={languages}
          isMultiLanguage={isMultiLanguage}
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
