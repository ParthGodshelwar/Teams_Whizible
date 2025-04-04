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
  isLoading: true
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
        isLoading: false
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false
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
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isTeamsReload, setIsTeamsReload] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await microsoftTeams.app.initialize();

        // Check if this is a reload from Teams' more options
        const context = await microsoftTeams.app.getContext();
        if (context.page.subPageId === "reload") {
          setIsTeamsReload(true);
          sessionStorage.clear();
        }

        dispatch({ type: "INIT" });

        // Check for existing valid session if not a Teams reload
        if (!isTeamsReload && sessionStorage.getItem("token")) {
          try {
            const existingUser = JSON.parse(sessionStorage.getItem("user"));
            dispatch({ type: "LOGIN", payload: { user: existingUser } });
            return;
          } catch (e) {
            sessionStorage.clear();
          }
        }

        // Otherwise initiate authentication
        handleMicrosoftSignIn();
      } catch (error) {
        console.error("Initialization failed:", error);
        dispatch({ type: "INIT" });
        handleMicrosoftSignIn();
      }
    };

    initializeApp();
  }, []);

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

  const handleMicrosoftSignIn = useCallback(async () => {
    dispatch({ type: "LOADING", payload: true });

    try {
      const authToken = await new Promise((resolve, reject) => {
        microsoftTeams.authentication.getAuthToken({
          successCallback: resolve,
          failureCallback: reject
        });
      });

      setToken(authToken);
      toast.success("Microsoft login successful");
      sessionStorage.setItem("token", authToken);

      const { userProfileData, moduleAccessData } = await fetchUserData(authToken);

      dispatch({ type: "LOGIN", payload: { user: userProfileData } });

      const appAccess = moduleAccessData.data[0]?.appAccess;
      if (appAccess === 1) {
        navigate("/landingpage");
        toast.success("Signed in successfully");
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
  }, [fetchUserData, navigate]);

  const logout = useCallback(() => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
    handleMicrosoftSignIn();
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
          <p>Signing in...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
