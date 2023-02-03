import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Buffer } from 'buffer';
import { Chat } from '../components/Chat';

import '../App.css';

import { Intro } from '../screens/intro';
import { ChatProvider } from 'contexts/MessangerContext';
import { SocketProvider } from 'contexts/SocketContext';
import { FileUploadProvider } from 'contexts/FileUploadContext';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import { apiInstance, authInstance } from 'services';
import { IApiThemeResponse } from 'utils/api';
import { useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuthContext } from 'contexts/AuthContext';
import { HomeContent } from 'components/HomeContent';

export const Container = styled.div`
  width: 370px;
  // margin: 45px auto 15px;
  position: absolute;
  bottom: 0px;

  max-width: 100%;
`;

const regExpUuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const Home = () => {
  const [isAccess, setIsAccess] = useState(false);
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [originDomain, setOriginDomain] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const [chatBotID, setChatBotID] = useState<string | null>(null);

  useEffect(() => {
    const onPostMessage = (event: MessageEvent) => {
      if (regExpUuid.test(event.data)) {
        setChatBotID(event.data);
      }

      const origin = event.origin.match(/:\/\/(.[^/]+)/);
      const isOrigin = originDomain == null && !!origin?.length;
      if (isOrigin && window.location.href.indexOf(origin[1]) === -1) {
        setOriginDomain(origin[1]);
      }
    };

    window.addEventListener('message', onPostMessage);

    return () => {
      window.removeEventListener('message', onPostMessage);
    };
  }, [originDomain]);

  useEffect(() => {
    const newChatBotId = searchParams.get('chatBotId');
    if (newChatBotId) {
      setChatBotID(newChatBotId);
    }
  }, [searchParams]);

  useEffect(() => {
    const vefiryChat = async (guid: string, originDomain: string) => {
      const bufferKey = Buffer.from(`${guid}:${originDomain}`);
      const encodedKey = bufferKey.toString('base64');
      const response = await authInstance.verify(encodedKey);

      if (response.data?.isDomainVerified) {
        setIsAccess(true);
        response.data.chatBotStyle &&
          setTheme(JSON.parse(response.data.chatBotStyle));
      } else {
        setChatBotID(null);
        setOriginDomain(null);
      }
    };

    if (originDomain && chatBotID) {
      vefiryChat(chatBotID, originDomain);
    }
  }, [originDomain, chatBotID]);

  if (!isAccess) {
    return null;
  }

  return (
    <Container id="chat-bot">
      <AuthProvider>
        <ChatProvider>
          <ThemeContextProvider value={theme}>
            <FileUploadProvider>
              <HomeContent />
            </FileUploadProvider>
          </ThemeContextProvider>
        </ChatProvider>
      </AuthProvider>
    </Container>
  );
};
