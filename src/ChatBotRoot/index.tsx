import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";

import { Container } from "./styles";
import { Content } from "content";
import { IApiThemeResponse } from "utils/api";
import { regExpJWT, regExpUuid } from "utils/helpers";
import { SessionStorage, isDevMode } from "utils/constants";

export const ChatBotRoot: FC = () => {
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [chatBotID, setChatBotID] = useState<string | null>(null);

  useEffect(() => {
    const onPostMessage = (event: MessageEvent) => {
      if (regExpUuid.test(event.data?.guid)) {
        setChatBotID(event.data.guid);
      }
      if (event.data?.style) {
        setTheme(event.data.style);
      }
      if (regExpJWT.test(event.data?.token)) {
        if (isDevMode) {
          // console.log(event.data?.token);
        }
        sessionStorage.setItem(SessionStorage.Token, event.data.token);
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
