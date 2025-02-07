import { lazy } from "react";

import AuthGuard from "./auth/AuthGuard";

import Loadable from "./components/Loadable";
import WhizLayout from "./components/WhizLayout/WhizLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const LoadingPage = Loadable(lazy(() => import("app/views/LoadingPage")));
const Timesheet = Loadable(lazy(() => import("app/views/Timesheet")));
const UnderConstruction = Loadable(lazy(() => import("app/views/UnderConstruction")));
const LandingPage = Loadable(lazy(() => import("app/views/LandingPage")));
const Dashboard = Loadable(lazy(() => import("app/views/Approvals/Dashboard")));
// const UnauthorizedPage = Loadable(lazy(() => import("app/views/UnauthorizedPage")));
const UnauthorizedPage = Loadable(lazy(() => import("app/views/UnauthorizedPage")));
const routes = [
  {
    element: (
      <AuthGuard>
        <WhizLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // dashboard route

      {
        path: "/under-construction",
        element: <UnderConstruction />
      },
      {
        path: "/Timesheet_Entry",
        element: <Timesheet />
      },

      {
        path: "/My_Approvals",
        element: <Dashboard />
      },
      { path: "/", element: <LandingPage /> },
      { path: "/landingPage", element: <LandingPage /> }
    ]
  },

  // session pages route

  { path: "/UnauthorizedPage", element: <UnauthorizedPage /> },
  { path: "/LoadingPage", element: <LoadingPage /> },
  { path: "/session/404", element: <NotFound /> },
  { path: "/signin", element: <JwtLogin /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
