import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import { Chat } from "./components/Chat";
import { CHAT_OPTIONS, Intro } from "./screens/intro";

import "./App.css";
import { Provider, useSelector } from "react-redux";
import { IRootState, store } from "redux/store";
// import { FindJob } from "screens/findJob";

// export const FAQ = () => {
//   return <Chat>Ask a question</Chat>;
// };

// const routes = [
//   {
//     path: "/",
//     exact: true,
//     component: Intro,
//   },
//   {
//     path: "/findJob",
//     component: FindJob,
//   },
//   {
//     path: "/faq",
//     component: FAQ,
//   },
// ];

export const Container = styled.div`
  width: 385px;
  margin: 50px auto;
  max-width: 100%;
`;

const scenarios = {
  [CHAT_OPTIONS.FIND_JOB]: {
    initialMessages: ["Lorem ipsum dolor sit amet"],
    initialOwnMessages: ["Find a job"],
  },
  [CHAT_OPTIONS.ASK_QUESTION]: {
    initialMessages: ["Lorem ipsum dolor sit amet"],
    initialOwnMessages: ["Ask a question"],
  },
};

export type ScenarioType = typeof scenarios[CHAT_OPTIONS.ASK_QUESTION];

const App = () => {
  const option = useSelector<IRootState, CHAT_OPTIONS | null>(
    (state) => state.option
  );
  return (
    <Container>
      {!option ? <Intro /> : <Chat scenario={scenarios[option]} />}
    </Container>
  );
};

export default App;
