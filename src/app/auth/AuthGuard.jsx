import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// HOOK
import useAuth from "app/hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      setCheckedAuth(true);
    }
  }, [isInitialized]);

  if (!checkedAuth) {
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
