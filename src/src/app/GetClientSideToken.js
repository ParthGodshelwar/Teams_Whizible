import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { jwtDecode } from "jwt-decode"; // You'll need to install this package

const GetClientSideToken = () => {
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeTeams = async () => {
      try {
        await microsoftTeams.app.initialize();
        console.log("Teams SDK initialized");

        microsoftTeams.authentication.getAuthToken({
          successCallback: async (result) => {
            console.log("Token received:", result);
            setToken(result);

            // Decode the JWT token to get the preferred_username
            try {
              const decodedToken = jwtDecode(result);
              const emailId = decodedToken.preferred_username;

              // Call the API with the Bearer token
              const response = await fetch(
                `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/UserProfile/Get?emailId=${emailId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${result}`,
                    "Content-Type": "application/json"
                  }
                }
              );

              if (!response.ok) {
                throw new Error(`Error fetching user profile: ${response.statusText}`);
              }

              const data = await response.json();
              setUserProfile(data);
            } catch (apiError) {
              setError("Error calling API: " + apiError.message);
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

    initializeTeams();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {token ? (
        userProfile ? (
          <div>
            <p>Token: {token}</p>
            <pre>{JSON.stringify(userProfile, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading user profile...</p>
        )
      ) : (
        <p>Loading token...</p>
      )}
    </div>
  );
};

export default GetClientSideToken;
