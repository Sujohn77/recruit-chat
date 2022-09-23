import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Chat } from './components/Chat';

import './App.css';

import { Intro } from './screens/intro';
import { ChatProvider } from 'contexts/MessangerContext';
import { SocketProvider } from 'contexts/SocketContext';
import { FileUploadProvider } from 'contexts/FileUploadContext';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import { apiInstance } from 'services';
import { IApiThemeResponse } from 'utils/api';

export const Container = styled.div`
  width: 370px;
  // margin: 45px auto 15px;
  position: absolute;
  bottom: 0px;

  max-width: 100%;
`;

const App = () => {
  const [isSelectedOption, setIsSelectedOption] = useState<boolean | null>(null);
  const [isAccess, setIsAccess] = useState(false);
  const [theme, setTheme] = useState<IApiThemeResponse | null>(null);

  useEffect(() => {
    const vefiryChat = async () => {
      const response = await apiInstance.verify({ chatBotId: 2 });
      if (response.data?.isDomainVerified) {
        setIsAccess(true);
        setTheme(response.data.chatBotStyle);
      }

    }
    vefiryChat();
  }, []);

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
                <Chat setIsSelectedOption={setIsSelectedOption} isSelectedOption={isSelectedOption} />
              )}
              <Intro setIsSelectedOption={setIsSelectedOption} isSelectedOption={isSelectedOption} />
            </SocketProvider>
          </FileUploadProvider>
        </ThemeContextProvider>
      </ChatProvider>
    </Container>
  );
};

export default App;
