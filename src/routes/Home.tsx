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
import { apiInstance } from 'services';
import { IApiThemeResponse } from 'utils/api';
import { useParams, useSearchParams } from 'react-router-dom';

export const Container = styled.div`
  width: 370px;
  // margin: 45px auto 15px;
  position: absolute;
  bottom: 0px;

  max-width: 100%;
`;
interface IUrlParams {
  chatBotId: string;
}

const regExpUuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const Home = () => {
  const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(
    null
  );

  const [isAccess, setIsAccess] = useState(false);
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);
  const [originDomain, setOriginDomain] = useState<string | null>(null);

  const [chatBotId, setChatBotId] = useState(null);
  useEffect(() => {
    window.addEventListener('message', onPostMessage);

    return () => {
      window.removeEventListener('message', onPostMessage);
    };
  }, []);

  useEffect(() => {
    if (originDomain && chatBotId) {
      vefiryChat(chatBotId, originDomain);
    }
  }, [originDomain, chatBotId]);

  const vefiryChat = async (guid: string, originDomain: string) => {
    const encodedKey = Buffer.from(`${guid}:${originDomain}`).toString(
      'base64'
    );
    const response = await apiInstance.verify(encodedKey);
    if (response.data?.isDomainVerified) {
      setIsAccess(true);
      response.data.chatBotStyle &&
        setTheme(JSON.parse(response.data.chatBotStyle));
    } else {
      setChatBotId(null);
    }
  };

  const onPostMessage = (event: MessageEvent) => {
    console.log(event.data);
    console.log(event.origin);
    if (regExpUuid.test(event.data)) {
      setChatBotId(event.data);
    }
    setOriginDomain(event.origin);
    // Security: Validate message origin
  };

  if (!isAccess) {
    return <div>Access Denied</div>;
  }

  return (
    <Container id="chat-bot">
      <ChatProvider>
        <ThemeContextProvider value={theme}>
          <FileUploadProvider>
            <SocketProvider>
              {isSelectedOption !== null && (
                <Chat
                  setIsSelectedOption={setIsSelectedOption}
                  isSelectedOption={isSelectedOption}
                />
              )}
              <Intro
                setIsSelectedOption={setIsSelectedOption}
                isSelectedOption={isSelectedOption}
              />
            </SocketProvider>
          </FileUploadProvider>
        </ThemeContextProvider>
      </ChatProvider>
    </Container>
  );
};
