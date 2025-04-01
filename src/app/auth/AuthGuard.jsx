import { Navigate, useLocation } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import * as microsoftTeams from "@microsoft/teams-js";
import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [teamsReady, setTeamsReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeTeams = async () => {
      try {
        await microsoftTeams.app.initialize();
        console.log("Teams SDK initialized successfully");
        setTeamsReady(true);
      } catch (error) {
        console.error("Teams initialization failed:", error);
        setTeamsReady(true); // Continue anyway to show error UI
      } finally {
        setInitializing(false);
      }
    };

    // Check if running in Teams
    if (window.parent !== window && window.parent.location.href.includes("teams.microsoft.com")) {
      initializeTeams();
    } else {
      // Not in Teams, proceed without Teams initialization
      setTeamsReady(true);
      setInitializing(false);
    }
  }, []);

  if (initializing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isInitialized) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate replace to="/signin" state={{ from: pathname }} />;
}
