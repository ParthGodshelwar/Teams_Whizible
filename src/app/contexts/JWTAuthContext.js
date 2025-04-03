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
    case "INIT": {
      return { ...state, isInitialized: true };
    }
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

  // Clear previous session on initial load to force new token generation
  useEffect(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("tAccess");
  }, []);

  const fetchUserData = useCallback(async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const emailId = decodedToken.preferred_username;

      // Fetch user profile
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

      // Fetch module access
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
      microsoftTeams.authentication.getAuthToken({
        successCallback: async (result) => {
          try {
            setToken(result);
            sessionStorage.setItem("token", result);

            const { userProfileData, moduleAccessData } = await fetchUserData(result);

            dispatch({
              type: "LOGIN",
              payload: {
                user: userProfileData
              }
            });

            // Handle navigation based on access
            const appAccess = moduleAccessData.data[0]?.appAccess;
            if (appAccess === 1) {
              navigate("/landingpage");
              toast.success("Microsoft login successful");
            } else {
              navigate("/UnauthorizedPage");
            }
          } catch (error) {
            dispatch({ type: "LOADING", payload: false });
            toast.error("You are not a registered user");
            navigate("/UnauthorizedPage");
          }
        },
        failureCallback: (error) => {
          dispatch({ type: "LOADING", payload: false });
          setError("Error getting token: " + error);
          navigate("/UnauthorizedPage");
        }
      });
    } catch (err) {
      dispatch({ type: "LOADING", payload: false });
      setError("Login error: " + err.message);
      navigate("/UnauthorizedPage");
    }
  }, [fetchUserData, navigate]);

  const initializeTeams = useCallback(async () => {
    try {
      await microsoftTeams.app.initialize();
      console.log("Teams SDK initialized");
      dispatch({ type: "INIT" });
      handleMicrosoftSignIn(); // Trigger auth flow after initialization
    } catch (error) {
      console.error("Teams SDK initialization failed:", error);
      dispatch({ type: "INIT" });
      handleMicrosoftSignIn(); // Still attempt auth flow
    }
  }, [handleMicrosoftSignIn]);

  useEffect(() => {
    initializeTeams();
  }, [initializeTeams]);

  const logout = useCallback(() => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
    handleMicrosoftSignIn(); // Start new auth flow after logout
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
          {/* Add your loading spinner here */}
          <p>Loading application...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
