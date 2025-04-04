import React, { createContext, useEffect, useReducer, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { ToastContainer, toast } from "react-toastify";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as microsoftTeams from "@microsoft/teams-js";
import UnauthorizedPage from "app/views/UnauthorizedPage";
import "react-toastify/dist/ReactToastify.css";
// import "./loader.css"; // <-- custom loader CSS

initializeIcons();

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
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
  const navigate = useNavigate();
  const [isUnregistered, setIsUnregistered] = useState(false);
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [moduleAccess, setModuleAccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // NEW STATE

  const handleMicrosoftSignIn = async () => {
    try {
      setIsLoading(true); // Show loader
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
            if (!empID) setIsUnregistered(true);

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

            const empId = moduleAccessData.data[0]?.empId ?? null;
            const appAccess = moduleAccessData.data[0]?.appAccess ?? null;

            if (appAccess == 0) navigate("/UnauthorizedPage");
            else if (empId && appAccess == 1) navigate("/landingpage");
          } catch (apiError) {
            setError("Error calling API: " + apiError.message);
            if (!userProfile) {
              sessionStorage.clear();
              toast.error("You are not a registered user");
              setIsUnregistered(true);
            }
          } finally {
            setIsLoading(false); // Hide loader
          }
        },
        failureCallback: (error) => {
          setError("Error getting token: " + error);
          setIsLoading(false); // Hide loader
        }
      });
    } catch (err) {
      setError("Initialization error: " + err.message);
      setIsLoading(false); // Hide loader
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
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
      {isLoading && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
