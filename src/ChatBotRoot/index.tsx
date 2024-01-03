import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider, useChatMessenger } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { apiInstance } from "services/api";
import { IApiThemeResponse } from "utils/types";
import { EventIds, SessionStorage } from "utils/constants";
import { LOG, postMessToParent, regExpJWT, regExpUuid } from "utils/helpers";

export const ChatBotRoot: FC = () => {
  const { setChatBotToken } = useChatMessenger();

  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [chatBotID, setChatBotID] = useState<string | null>(null);
  const [chatBotRootProps, setChatBotRootProps] = useState();

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (regExpUuid.test(event.data?.guid)) {
        setChatBotID(event.data.guid);
      }

      LOG(event.data, "event.data");

      if (event.data?.style) {
        LOG(event.data?.style, "event.data?.style");
        setTheme(event.data.style);
      }
      if (event.data?.props) {
        setChatBotRootProps(event.data.props);
      }

      if (regExpJWT.test(event.data?.token)) {
        setChatBotToken(event.data?.token);
        sessionStorage.setItem(SessionStorage.Token, event.data.token);
        apiInstance.repeatLastRequest(event.data.token);
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
          <ChatProvider chatBotID={chatBotID}>
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
