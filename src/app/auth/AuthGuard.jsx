import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import LoadingPage from "app/views/LoadingPage";
// CUSTOM COMPONENT

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  console.log("AuthGuard", isAuthenticated, isInitialized);

  if (!isInitialized) {
    // return <LoadingPage />; // Show loading spinner while initializing
    return <div>Loading AG....</div>; // Show loading spinner while initializing
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate replace to="/signin" state={{ from: pathname }} />;
}
