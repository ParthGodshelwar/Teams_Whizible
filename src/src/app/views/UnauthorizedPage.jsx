import React from "react";
import logo from "../../assets/img/Logo_01.png";
const UnauthorizedPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9", // Optional: for better visibility
        height: "100vh" // Full viewport height
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        {/* You can replace the following div with your icon component */}
        <div
          style={{
            fontSize: "64px", // Adjust size as needed
            color: "grey" // Icon color
          }}
        >
          🔒
        </div>
      </div>
      <p style={{ color: "grey", fontSize: "18px", margin: "10px 0" }}>You are not authorized</p>
      <p style={{ color: "lightblue", fontSize: "16px", margin: "10px 0" }}>
        It seems you don't have permission to use the App
      </p>
      <p style={{ color: "lightblue", fontSize: "16px", margin: "10px 0" }}>
        Please contact Whizible Administrator for more detail
      </p>
      <img
        src={logo} // Replace with your image path
        alt="Unauthorized Access"
      />
    </div>
  );
};

export default UnauthorizedPage;
