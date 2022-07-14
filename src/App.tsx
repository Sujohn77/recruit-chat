import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import { Chat } from "./components/Chat";
import { Intro } from "./screens/intro";

import "./App.css";

export const FindJob = () => {
  return <Chat>Find a job</Chat>;
};

export const FAQ = () => {
  return <Chat>Ask a question</Chat>;
};

const routes = [
  {
    path: "/",
    exact: true,
    component: Intro,
  },
  {
    path: "/findJob",
    component: FindJob,
  },
  {
    path: "/faq",
    component: FAQ,
  },
];

export const Container = styled.div`
  width: 385px;
  margin: 50px auto;
  max-width: 100%;
`;

function App() {
  return (
    <Router basename={"/"}>
      <Switch>
        <Container>
          {routes.map((route) => (
            <Route {...route} />
          ))}
        </Container>
      </Switch>
    </Router>
  );
}

export default App;
