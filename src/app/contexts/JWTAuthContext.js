import React, { createContext, useEffect, useReducer, useState, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as microsoftTeams from "@microsoft/teams-js";

// Initialize Fluent UI icons
initializeIcons();

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true,
  hasFirstLogin: false // Track if first login completed
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return { ...state, isInitialized: true };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
        hasFirstLogin: true
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        hasFirstLogin: false
      };
    case "LOADING":
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  logout: () => {},
  handleMicrosoftSignIn: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const emailId = decodedToken.preferred_username;

      const userProfileResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/UserProfile/Get?emailId=${emailId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!userProfileResponse.ok) throw new Error("Failed to fetch profile");

      const userProfileData = await userProfileResponse.json();
      sessionStorage.setItem("user", JSON.stringify(userProfileData));
      sessionStorage.setItem("UserProfilePic", userProfileData?.data?.profilePicURL);

      const empID = userProfileData.data.employeeId;
      if (!empID) throw new Error("No employee ID found");

      const moduleAccessResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ModuleAccess/Get?empID=${empID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!moduleAccessResponse.ok) throw new Error("Failed to fetch module access");

      const moduleAccessData = await moduleAccessResponse.json();
      sessionStorage.setItem("tAccess", JSON.stringify(moduleAccessData));

      return { userProfileData, moduleAccessData };
    } catch (error) {
      sessionStorage.clear();
      throw error;
    }
  }, []);

  const handleMicrosoftSignIn = useCallback(
    async (forceLogin = false) => {
      // Skip if we already have a valid session and not forcing login
      if (!forceLogin && sessionStorage.getItem("token") && state.hasFirstLogin) {
        try {
          const existingUser = JSON.parse(sessionStorage.getItem("user"));
          dispatch({ type: "LOGIN", payload: { user: existingUser } });
          return;
        } catch (e) {
          sessionStorage.clear();
        }
      }

      dispatch({ type: "LOADING", payload: true });

      try {
        const authToken = await new Promise((resolve, reject) => {
          microsoftTeams.authentication.getAuthToken({
            successCallback: resolve,
            failureCallback: reject
          });
        });

        setToken(authToken);
        sessionStorage.setItem("token", authToken);

        const { userProfileData, moduleAccessData } = await fetchUserData(authToken);

        dispatch({ type: "LOGIN", payload: { user: userProfileData } });

        const appAccess = moduleAccessData.data[0]?.appAccess;
        if (appAccess === 1) {
          navigate("/landingpage");
          if (forceLogin) {
            toast.success("Signed in successfully");
          }
        } else {
          navigate("/UnauthorizedPage");
        }
      } catch (err) {
        sessionStorage.clear();
        dispatch({ type: "LOADING", payload: false });
        toast.error(
          err.message.includes("profile")
            ? "You are not a registered user"
            : "Sign in failed. Please try again."
        );
        navigate("/UnauthorizedPage");
      }
    },
    [fetchUserData, navigate, state.hasFirstLogin]
  );

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await microsoftTeams.app.initialize();
        dispatch({ type: "INIT" });

        // Check if we have an existing valid session
        if (sessionStorage.getItem("token")) {
          try {
            const existingUser = JSON.parse(sessionStorage.getItem("user"));
            dispatch({ type: "LOGIN", payload: { user: existingUser } });
          } catch (e) {
            sessionStorage.clear();
            handleMicrosoftSignIn(true);
          }
        } else {
          // First-time login
          handleMicrosoftSignIn(true);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        dispatch({ type: "INIT" });
        handleMicrosoftSignIn(true);
      }
    };

    initializeApp();
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
    handleMicrosoftSignIn(true);
  }, [handleMicrosoftSignIn]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        logout,
        handleMicrosoftSignIn,
        error
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover closeOnClick />
      {state.isLoading ? (
        <div className="full-page-loader">
          <p>Loading application...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
