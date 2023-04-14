import { AuthProvider } from "contexts/AuthContext";
import { ChatProvider } from "contexts/MessengerContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { FileUploadProvider } from "contexts/FileUploadContext";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";

import { HomeContent } from "components";
import { IApiThemeResponse } from "utils/api";
import { SessionStorage } from "../utils/constants";
import "../App.css";

export const Container = styled.div`
  width: 370px;
  position: absolute;
  bottom: 0px;
  max-width: 100%;
`;

const regExpUuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const regExpJWT = /^[\w-]*\.[\w-]*\.[\w-]*$/i;

export const Home: FC = () => {
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
        if (process.env.NODE_ENV === "development") {
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
                <HomeContent />
              </FileUploadProvider>
            </ThemeContextProvider>
          </ChatProvider>
        )}
      </AuthProvider>
    </Container>
  );
};
