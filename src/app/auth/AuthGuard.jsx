import { Navigate, useLocation } from "react-router-dom";
// HOOK
import { useState } from "react";
import useAuth from "app/hooks/useAuth";
import LoadingPage from "app/views/LoadingPage";
import { useEffect } from "react";
// CUSTOM COMPONENT

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  console.log("AuthGuard", isAuthenticated, isInitialized);
  const [initialized, setInitialized] = useState(isInitialized);

  // useEffect(() => {
  //   if (!isInitialized) {
  //     // return <LoadingPage />; // Show loading spinner while initializing
  //     return <div>Loading AG....</div>; // Show loading spinner while initializing
  //   }

  //   if (isAuthenticated) {
  //     return <>{children}</>;
  //   }
  // }, [isAuthenticated, isInitialized]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInitialized(isInitialized);
    }, 1000); // Adjust interval as needed (1000ms = 1 sec)

    return () => clearInterval(interval);
  }, [isInitialized]);

  if (!isInitialized) {
    // return <LoadingPage />; // Show loading spinner while initializing
    return <div>Loading AG....</div>; // Show loading spinner while initializing
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate replace to="/signin" state={{ from: pathname }} />;
}
