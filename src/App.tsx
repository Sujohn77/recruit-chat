import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Chat } from './components/Chat';

import './App.css';

import { Intro } from './screens/intro';
import { ChatProvider } from 'contexts/MessangerContext';
import { SocketProvider } from 'contexts/SocketContext';
import { FIREBASE_TOKEN } from 'firebase/config';
import { handleSignInWithCustomToken } from 'firebase/config';
import { FileUploadProvider } from 'contexts/FileUploadContext';
import defaultTheme from 'utils/theme/default';
import { useApiKey } from 'utils/hooks';
import { api } from 'utils/api';
import { ThemeProvider } from 'contexts/ThemeContext';

export const Container = styled.div`
  width: 370px;
  margin: 30px auto;
  max-width: 100%;
`;

const App = () => {
  const [isSelectedOption, setIsSelectedOption] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const apiKey: any = useApiKey();

  useEffect(() => {
    if (apiKey) {
      api.test(apiKey).then((res) => {
        console.log('Bot data: ', res.data);
        setTheme({
          color: res.data.fontColor,
          backgroundColor: res.data.backgroundColor,
          backgroundImage: `url("${res.data.imageUrl}")`,
        });
      });
    }
  }, [apiKey]);

  const [testData, setTestData] = React.useState<any>(null);

  useEffect(() => {
    api.test(apiKey).then((data: any) => {
      console.log('Bot Data', data.data);
      setTestData(data.data);
    });
  }, [apiKey]);

  useEffect(() => {
    // DELETE: after backend is ready
    handleSignInWithCustomToken(FIREBASE_TOKEN);
  }, []);

  const renderContent = () => {
    if (isSelectedOption) {
      return <Chat setIsSelectedOption={setIsSelectedOption} />;
    }
    return <Intro setIsSelectedOption={setIsSelectedOption} />;
  };

  return (
    <Container>
      <ChatProvider>
        <ThemeProvider>
          <FileUploadProvider>
            <SocketProvider>{renderContent()}</SocketProvider>{' '}
          </FileUploadProvider>
        </ThemeProvider>
      </ChatProvider>
    </Container>
  );
};

export default App;
