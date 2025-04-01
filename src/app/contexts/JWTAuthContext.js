import React, { createContext, useEffect, useReducer, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as microsoftTeams from "@microsoft/teams-js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import UnauthorizedPage from "app/views/UnauthorizedPage";
import LandingPage from "app/views/LandingPage";

// Initialize Fluent UI icons
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
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  login: () => {},
  logout: () => {},
  handleMicrosoftSignIn: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [isUnregistered, setIsUnregistered] = useState(false);
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [moduleAccess, setModuleAccess] = useState(null);
  const [teamsInitialized, setTeamsInitialized] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (user && token) {
      dispatch({
        type: "INIT",
        payload: { isAuthenticated: true, user: JSON.parse(user) }
      });
    } else {
      dispatch({
        type: "INIT",
        payload: { isAuthenticated: false, user: null }
      });
    }
  }, []);

  useEffect(() => {
    const initializeTeams = async () => {
      try {
        await microsoftTeams.app.initialize();
        console.log("Teams SDK initialized");
        setTeamsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize Teams SDK:", err);
      }
    };
    initializeTeams();
  }, []);

  const handleMicrosoftSignIn = async () => {
    try {
      if (!teamsInitialized) {
        toast.error("Teams SDK not initialized. Please reload the app.");
        return;
      }

      microsoftTeams.authentication.getAuthToken({
        successCallback: async (result) => {
          setToken(result);
          sessionStorage.setItem("token", result);

          try {
            const decodedToken = jwtDecode(result);
            const emailId = decodedToken.preferred_username;

            const userProfileResponse = await fetch(
              `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/UserProfile/Get?emailId=${emailId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${result}`,
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
                  Authorization: `Bearer ${result}`,
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

            const appAccess =
              moduleAccessData.data.length > 0 ? moduleAccessData.data[0].appAccess : null;

            if (appAccess === 0) {
              navigate("/UnauthorizedPage");
              toast.error("You do not have access to this application.");
              return;
            }

            dispatch({
              type: "LOGIN",
              payload: { user: userProfileData }
            });

            // Move the toast.success here, to ensure it only happens once per successful Login.
            toast.success("Microsoft login successful");
            navigate("/landingpage");
          } catch (apiError) {
            setError("Error calling API: " + apiError.message);
            sessionStorage.clear();
            toast.error("An error occurred during login. Please try again.");
          }
        },
        failureCallback: (error) => {
          setError("Error getting token: " + error);
          toast.error("Failed to authenticate. Please try again.");
        }
      });
    } catch (err) {
      setError("Initialization error: " + err.message);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        logout,
        handleMicrosoftSignIn
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
