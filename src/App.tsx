import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Chat } from "./components/Chat";

import "./App.css";

import { Intro } from "./screens/intro";
import { ChatProvider } from "components/Context/MessangerContext";
import { SocketProvider } from "components/Context/SocketContext";
import { FIREBASE_TOKEN } from "firebase/config";
import { handleSignInWithCustomToken } from "firebase/config";

export const Container = styled.div`
  width: 385px;
  margin: 50px auto;
  max-width: 100%;
`;

const App = () => {
  const [isSelectedOption, setIsSelectedOption] = useState(false);

  useEffect(() => {
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
        <SocketProvider>{renderContent()}</SocketProvider>
      </ChatProvider>
    </Container>
  );
};

export default App;
