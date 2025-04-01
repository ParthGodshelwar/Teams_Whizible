import React, { createContext, useEffect, useReducer, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import axios from "axios";
import fetchUserProfile from "../hooks/fetchUserProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import msalInstance from "./msalConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as microsoftTeams from "@microsoft/teams-js";
import UnauthorizedPage from "app/views/UnauthorizedPage";
import { CircularProgress, Box } from "@mui/material";

initializeIcons();

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null };
    case "REGISTER":
      return { ...state, isAuthenticated: true, user: action.payload.user };
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  login: () => {},
  logout: () => {},
  register: () => {},
  handleMicrosoftSignIn: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { instance } = useMsal();
  const [msalInitialized, setMsalInitialized] = useState(false);
  const navigate = useNavigate();
  const [isUnregistered, setIsUnregistered] = useState(false);
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [moduleAccess, setModuleAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamsInitialized, setTeamsInitialized] = useState(false);
  const [isInTeams, setIsInTeams] = useState(false);

  useEffect(() => {
    // Check if running in Teams context
    const isTeams =
      window.parent !== window &&
      (window.parent.location.href.includes("teams.microsoft.com") ||
        window.parent.location.href.includes("teams.skype.com"));
    setIsInTeams(isTeams);

    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (user && token) {
      dispatch({
        type: "INIT",
        payload: { isAuthenticated: true, user: JSON.parse(user) }
      });
      setLoading(false);
    } else {
      dispatch({
        type: "INIT",
        payload: { isAuthenticated: false, user: null }
      });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInTeams) return;

    const initializeTeams = async () => {
      try {
        await microsoftTeams.app.initialize();
        console.log("Teams SDK initialized");
        setTeamsInitialized(true);

        // Get context to verify we're in Teams
        const context = await microsoftTeams.app.getContext();
        console.log("Teams context:", context);

        // Auto-trigger auth flow if not authenticated
        if (!state.isAuthenticated) {
          handleMicrosoftSignIn();
        }
      } catch (err) {
        console.error("Failed to initialize Teams SDK:", err);
        setTeamsInitialized(true); // Continue anyway
      }
    };

    initializeTeams();
  }, [isInTeams]);

  const handleMicrosoftSignIn = async () => {
    try {
      if (isInTeams && !teamsInitialized) {
        toast.info("Initializing Teams connection...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!teamsInitialized) {
          toast.error("Teams connection timeout. Please reload the app.");
          return;
        }
      }

      // Different auth flow for Teams vs standalone
      if (isInTeams) {
        await teamsAuthFlow();
      } else {
        await standaloneAuthFlow();
      }
    } catch (err) {
      console.error("Authentication error:", err);
      toast.error("Authentication failed. Please try again.");
      setError(err.message);
    }
  };

  const teamsAuthFlow = async () => {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.getAuthToken({
        successCallback: async (result) => {
          try {
            await processToken(result);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        failureCallback: (error) => {
          console.error("Teams auth failed:", error);
          toast.error("Teams authentication failed. Please try again.");
          reject(error);
        }
      });
    });
  };

  const standaloneAuthFlow = async () => {
    // Implement your non-Teams auth flow here
    // This is just a placeholder - replace with your actual standalone auth logic
    toast.info("Redirecting to authentication...");
    // Example: window.location.href = "/signin";
  };

  const processToken = async (token) => {
    setToken(token);
    sessionStorage.setItem("token", token);

    const decodedToken = jwtDecode(token);
    const emailId = decodedToken.preferred_username;

    const userProfileResponse = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/UserProfile/Get?emailId=${emailId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!userProfileResponse.ok) {
      throw new Error(`Error fetching user profile: ${userProfileResponse.statusText}`);
    }

    const userProfileData = await userProfileResponse.json();
    setUserProfile(userProfileData);
    sessionStorage.setItem("user", JSON.stringify(userProfileData));
    sessionStorage.setItem("UserProfilePic", userProfileData?.data?.profilePicURL);

    const empID = userProfileData.data.employeeId;
    if (!empID) {
      setIsUnregistered(true);
      navigate("/UnauthorizedPage");
      toast.error("You are not a registered user");
      return;
    }

    const moduleAccessResponse = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ModuleAccess/Get?empID=${empID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!moduleAccessResponse.ok) {
      throw new Error(`Error fetching module access: ${moduleAccessResponse.statusText}`);
    }

    const moduleAccessData = await moduleAccessResponse.json();
    setModuleAccess(moduleAccessData);
    sessionStorage.setItem("tAccess", JSON.stringify(moduleAccessData));

    const appAccess = moduleAccessData.data.length > 0 ? moduleAccessData.data[0].appAccess : null;

    if (appAccess === 0) {
      navigate("/UnauthorizedPage");
      toast.error("You do not have access to this application.");
      return;
    }

    dispatch({
      type: "LOGIN",
      payload: { user: userProfileData }
    });
    toast.success("Authentication successful");
    navigate("/landingpage");
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");

    if (isInTeams) {
      microsoftTeams.authentication.authenticate({
        url: window.location.origin + "/signin",
        width: 600,
        height: 535,
        successCallback: () => {
          window.location.reload();
        },
        failureCallback: (reason) => {
          console.error("Logout failed:", reason);
          window.location.href = "/signin";
        }
      });
    } else {
      window.location.href = "/signin";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        logout,
        handleMicrosoftSignIn,
        isInTeams,
        teamsInitialized
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
