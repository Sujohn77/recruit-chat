import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { IApiThemeResponse } from "utils/types";
import { postMessToParent } from "utils/helpers";
import { EventIds, SessionStorage } from "utils/constants";

export const ChatBotRoot: FC = () => {
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [chatBotID, setChatBotID] = useState<string | null>(null);
  const [companyName, setReferralCompanyName] = useState<string | null>(null);
  const [isReferralEnabled, setIsReferralEnabled] = useState<boolean>(false);
  const [chatBotToken, setChatBotToken] = useState("");
  const [chatBotRefBaseURL, setChatBotRefBaseURL] = useState("");
  const [clientApiToken, setClientApiToken] = useState("");
  const [jobSourceId, setJobSourceId] = useState("");

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // LOG(event.data, "event.data");
      if (event.data?.style) {
        setTheme(event.data.style);
      }
      if (event.data?.props) {
        setIsReferralEnabled(event.data?.props?.referralEnabled === "true");

        event.data.props?.companyName &&
          setReferralCompanyName(event.data.props?.companyName);

        event.data.props?.referralListDomain &&
          setChatBotRefBaseURL(event.data.props?.referralListDomain);

        event.data.props?.clientApiToken &&
          setClientApiToken(event.data.props?.clientApiToken);

        event.data.props.jobSourceId &&
          setJobSourceId(event.data.props.jobSourceId);
      }

      if (event.data?.token) {
        setChatBotToken(event.data?.token);
        sessionStorage.setItem(SessionStorage.Token, event.data.token);
      }

      event.data?.guid && setChatBotID(event.data.guid);
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    postMessToParent(EventIds.HideSpinner); // hide spinner from the parent page
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
      <AuthProvider>
        {chatBotID && (
          <ChatProvider
            chatBotId={chatBotID}
            chatBotToken={chatBotToken}
            clientApiToken={clientApiToken}
            companyName={companyName}
            chatBotRefBaseURL={chatBotRefBaseURL}
            isReferralEnabled={isReferralEnabled}
            jobSourceID={jobSourceId}
          >
            <ThemeContextProvider value={theme}>
              <FileUploadProvider>
                <Content />
              </FileUploadProvider>
            </ThemeContextProvider>
          </ChatProvider>
        )}
      </AuthProvider>
    </Container>
  );
};
