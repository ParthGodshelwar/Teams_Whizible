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
      console.log("New state:", { ...state, isAuthenticated: true, user: action.payload.user });
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

  // useEffect(() => {
  //   // Check if user data exists in sessionStorage
  //   if (!sessionStorage.getItem("user")) {
  //     navigate("/UnauthorizedPage"); // Redirect to the unauthorized route
  //   }
  // }, [navigate, isUnregistered]);
  const handleMicrosoftSignIn = async () => {
    try {
      dispatch({ type: "LOGIN", payload: { isAuthenticated: true } });

      await microsoftTeams.app.initialize();
      console.log("Teams SDK initialized");

      microsoftTeams.authentication.getAuthToken({
        successCallback: async (result) => {
          console.log("Token received:", result);
          setToken(result);
          sessionStorage.setItem("token", result);
          dispatch({ type: "LOGIN", payload: { isAuthenticated: true } });

          toast.success("Microsoft login successful");
          // Decode the JWT token to get the preferred_username
          try {
            const decodedToken = jwtDecode(result);
            const emailId = decodedToken.preferred_username;

            // Call the API with the Bearer token
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
            // Extract empID from userProfileData
            const empID = userProfileData.data.employeeId;
            if (!empID) setIsUnregistered(true);
            console.log("employeeId", userProfileData.data);
            // Call the second API with empID
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
            const empId = moduleAccessData.data.length > 0 ? moduleAccessData.data[0].empId : null;
            const appAccess =
              moduleAccessData.data.length > 0
                ? moduleAccessData.data[0].appAccess
                : null;
            if (appAccess == 0) {
              navigate("/UnauthorizedPage");            
            }    
            if (empId && appAccess == 1) navigate("/landingpage");
          } catch (apiError) {
            setError("Error calling API: " + apiError.message);
            // Clear cache if userProfileData is null
            if (!userProfile) {
              sessionStorage.clear();
              toast.error("You are not a registered user");
              setIsUnregistered(true);
            }
          }
        },
        failureCallback: (error) => {
          setError("Error getting token: " + error);
        }
      });
    } catch (err) {
      setError("Initialization error: " + err.message);
    }
  };

  // useEffect(() => {
  //   const user = sessionStorage.getItem("user");

  //   console.log("UnauthorizedPage", user);
  //   if (!user) {
  //     navigate("/UnauthorizedPage");
  //   }
  // }, [isUnregistered, navigate]);
  const logout = () => {
    sessionStorage.removeItem("access_token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
  };
  console.log("userProfile", sessionStorage.getItem("user"));

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
