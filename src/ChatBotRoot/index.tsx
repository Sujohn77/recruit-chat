import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { IApiThemeResponse } from "utils/types";
import { EventIds, SessionStorage } from "utils/constants";
import { LOG, postMessToParent } from "utils/helpers";

export const ChatBotRoot: FC = () => {
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [chatBotID, setChatBotID] = useState<string | null>(null);
  const [companyName, setReferralCompanyName] = useState<string | null>(null);
  const [isReferralEnabled, setIsReferralEnabled] = useState<boolean>(false);
  const [chatBotToken, setChatBotToken] = useState("");

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      LOG(event.data, "event.data");
      if (event.data?.style) {
        setTheme(event.data.style);
      }
      if (event.data?.props) {
        setIsReferralEnabled(event.data?.props?.referralEnabled === "true");

        event.data.props?.companyName &&
          setReferralCompanyName(event.data.props?.companyName);
      }

      if (event.data?.token) {
        setChatBotToken(event.data?.token);
        sessionStorage.setItem(SessionStorage.Token, event.data.token);
      }
      if (event.data?.guid) {
        setChatBotID(event.data.guid);
      }
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
            companyName={companyName}
            isReferralEnabled={isReferralEnabled}
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
