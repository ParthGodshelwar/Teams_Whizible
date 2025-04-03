import React, { createContext, useEffect, useReducer, useState } from "react";
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
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user
      };
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
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchNewToken = async () => {
      try {
        await microsoftTeams.app.initialize();
        console.log("Teams SDK initialized");

        microsoftTeams.authentication.getAuthToken({
          successCallback: async (result) => {
            console.log("New Token Fetched:", result);
            setToken(result);
            sessionStorage.setItem("token", result);

            try {
              const decodedToken = jwtDecode(result);
              dispatch({ type: "LOGIN", payload: { isAuthenticated: true, user: decodedToken } });

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

              if (!userProfileResponse.ok) throw new Error("Error fetching user profile");
              const userProfileData = await userProfileResponse.json();
              setUserProfile(userProfileData);
              sessionStorage.setItem("user", JSON.stringify(userProfileData));

              const empID = userProfileData.data.employeeId;
              if (!empID) {
                sessionStorage.clear();
                toast.error("You are not a registered user");
                navigate("/UnauthorizedPage");
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

              if (!moduleAccessResponse.ok) throw new Error("Error fetching module access");
              const moduleAccessData = await moduleAccessResponse.json();

              sessionStorage.setItem("tAccess", JSON.stringify(moduleAccessData));
              const appAccess =
                moduleAccessData.data.length > 0 ? moduleAccessData.data[0].appAccess : null;

              if (appAccess === 0) {
                navigate("/UnauthorizedPage");
              } else {
                navigate("/landingpage");
              }
            } catch (apiError) {
              console.error("API Error:", apiError);
              sessionStorage.clear();
              toast.error("Authentication failed. Please try again.");
            }
          },
          failureCallback: (error) => {
            console.error("Microsoft authentication failed:", error);
            toast.error("Microsoft authentication failed.");
            dispatch({ type: "LOGOUT" });
          },
          timeout: 10000
        });
      } catch (err) {
        console.error("Teams SDK initialization error:", err);
      }
    };

    fetchNewToken();
  }, []); // Runs on every reload

  const logout = () => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
  };

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", logout }}>
      <ToastContainer position="top-right" autoClose={5000} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
