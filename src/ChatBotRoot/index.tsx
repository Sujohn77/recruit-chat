import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider, useChatMessenger } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { LOG, regExpJWT, regExpUuid } from "utils/helpers";
import { SessionStorage } from "utils/constants";
import { IApiThemeResponse } from "utils/api";
import { apiInstance } from "services/api";

export const ChatBotRoot: FC = () => {
  const { setChatBotToken } = useChatMessenger();

  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [chatBotID, setChatBotID] = useState<string | null>(null);

  useEffect(() => {
    const onPostMessage = (event: MessageEvent) => {
      LOG(event.data, "message from parent");

      if (regExpUuid.test(event.data?.guid)) {
        setChatBotID(event.data.guid);
      }

      if (event.data?.style) {
        setTheme(event.data.style);
      }

      if (regExpJWT.test(event.data?.token)) {
        setChatBotToken(event.data?.token);
        sessionStorage.setItem(SessionStorage.Token, event.data.token);
        apiInstance.repeatLastRequest(event.data.token);
      }
    };

    window.addEventListener("message", onPostMessage);

    return () => {
      window.removeEventListener("message", onPostMessage);
    };
  }, []);

  const isChatBot = process.env.NODE_ENV !== "production" || chatBotID;

  return (
    <Container id="chat-bot">
      <AuthProvider>
        {isChatBot && (
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
