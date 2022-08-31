import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Chat } from './components/Chat';

import './App.css';

import { Intro } from './screens/intro';
import { ChatProvider } from 'contexts/MessangerContext';
import { SocketProvider } from 'contexts/SocketContext';
import { FileUploadProvider } from 'contexts/FileUploadContext';
import { ThemeContextProvider } from 'contexts/ThemeContext';

export const Container = styled.div`
  width: 370px;
  margin: 45px auto 15px;
  max-width: 100%;
`;

const App = () => {
  const [isSelectedOption, setIsSelectedOption] = useState(false);

  const renderContent = () => {
    if (isSelectedOption) {
      return <Chat setIsSelectedOption={setIsSelectedOption} />;
    }
    return <Intro setIsSelectedOption={setIsSelectedOption} />;
  };

  return (
    <Container>
      <ChatProvider>
        <ThemeContextProvider>
          <FileUploadProvider>
            <SocketProvider>{renderContent()}</SocketProvider>{' '}
          </FileUploadProvider>
        </ThemeContextProvider>
      </ChatProvider>
    </Container>
  );
};

export default App;
