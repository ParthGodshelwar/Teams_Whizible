import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
// CUSTOM COMPONENT

export default async function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = await useAuth();
  const { pathname } = useLocation();
  console.log("AuthGuard", isAuthenticated, isInitialized);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate replace to="/signin" state={{ from: pathname }} />;
}
