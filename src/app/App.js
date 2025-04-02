import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import * as microsoftTeams from "@microsoft/teams-js";
import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import "@fluentui/react/dist/css/fabric.css";
import msalInstance from "./contexts/JWTAuthContext";
import { useNavigate } from "react-router-dom";
import { WhizTheme } from "./components";

// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
import TeamsInitWrapper from "./TeamsInitWrapper";
// FAKE SERVER
import "../fake-db";

import "./app.css";

const App = () => {
  const navigate = useNavigate();
  const content = useRoutes(routes);
  useEffect(() => {
    // Delay execution by 10 seconds
    const timer = setTimeout(() => {
      // Check if user data exists in sessionStorage
      if (!sessionStorage.getItem("user")) {
        navigate("/UnauthorizedPage"); // Redirect to the unauthorized route
      }
    }, 7000); // 10 seconds delay

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <TeamsInitWrapper>
      <SettingsProvider>
        <AuthProvider>
          <WhizTheme>
            <CssBaseline />
            {content}
          </WhizTheme>
        </AuthProvider>
      </SettingsProvider>
    </TeamsInitWrapper>
  );
};

export default App;
