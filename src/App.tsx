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
