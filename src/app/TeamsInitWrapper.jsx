import { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import LoadingPage from "app/views/LoadingPage";

export default function TeamsInitWrapper({ children }) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await microsoftTeams.app.initialize();
        setInitialized(true);
      } catch (err) {
        setError(err);
        setInitialized(true); // Still continue to render children
      }
    };

    initialize();
  }, []);

  if (!initialized) {
    return <LoadingPage message="Initializing Teams..." />;
  }

  if (error) {
    console.error("Teams initialization error:", error);
  }

  return children;
}
