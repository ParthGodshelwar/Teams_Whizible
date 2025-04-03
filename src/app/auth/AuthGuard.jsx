import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import { useEffect } from "react";
// CUSTOM COMPONENT

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  console.log("AuthGuard", isAuthenticated, isInitialized);

  useEffect(() => {
    // This effect runs when the component mounts and checks if the user is authenticated
    // You can add any side effects or additional logic here if needed
    console.log("AuthGuard effect triggered", isAuthenticated, isInitialized);
  }, [isInitialized, isAuthenticated]);

  if (!isInitialized) {
    return <div>Loading...</div>; // Show a loading state until auth context is ready
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate replace to="/signin" state={{ from: pathname }} />;
}
