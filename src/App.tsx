import { colors } from "@material-ui/core";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { Chat } from "./components/Chat";
import { Intro } from "./screens/intro";

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
  width: 450px;
  margin: 0 auto;
  padding: 50px;
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
