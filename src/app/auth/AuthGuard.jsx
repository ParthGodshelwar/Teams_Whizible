import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// HOOK
import useAuth from "app/hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";
// CUSTOM COMPONENT

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  console.log("AuthGuard", isAuthenticated, isInitialized);

  useEffect(() => {
    // Add a small delay to ensure all auth checks complete
    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 500);

    setIsLoading(false);

    // return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
