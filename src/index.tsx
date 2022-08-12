import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./firebase/config";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
