import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import TourneyJSClient from "./TourneyJSClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TourneyJSClient />
  </React.StrictMode>
);
