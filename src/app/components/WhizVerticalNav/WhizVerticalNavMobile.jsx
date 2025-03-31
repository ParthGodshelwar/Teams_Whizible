import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardIcon from "../../../assets/latest/img/e-dashboard.svg";
import timesheetIcon from "../../../assets/latest/img/Timesheet.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon
import "./SidebarComponent.css";

const WhizVerticalNavMobile = ({activeNav,setActiveNav}) => {
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.data?.employeeId;
  const navigate = useNavigate();
  const [tAccess, setTAccess] = useState(0); // State to store the tAccess value
  // const [activeNav, setActiveNav] = useState("/landingpage"); // Track the active navigation

  const handleNavigation = (path) => {
    
    setActiveNav(path); // Update the active navigation path
    navigate(path);
  };

  useEffect(() => {
    const fetchModuleAccess = async () => {
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ModuleAccess/Get?empID=${UserID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Add the token in the Authorization header
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Module Access Data:", data); // Log the response

          if (data?.data?.length > 0) {
            setTAccess(data.data[0].tAccess); // Update tAccess state
          }
        } else {
          console.error("Failed to fetch module access:", response.status);
        }
      } catch (error) {
        console.error("Error fetching module access:", error);
      }
    };

    fetchModuleAccess();
  }, [UserID]); // Add UserID as a dependency to ensure it's available
  
  return (
    <ul className="sidebar-nav">
      <li className={activeNav === "/landingpage" ? "active" : ""}>
        <a
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/landingpage");
          }}
          title="My Dashboard"
        >
          <img src={dashboardIcon} alt="My Dashboard" className="IconImg mx-2" />
          <span className="nav_title ml-4">My Dashboard</span>
        </a>
      </li>
      {tAccess === 1 && ( // Conditionally render "My Timesheet" based on tAccess
        <li className={activeNav === "/Timesheet_Entry" ? "active" : ""}>
          <a
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/Timesheet_Entry");
            }}
            title="My Timesheet"
          >
            <img src={timesheetIcon} alt="My Timesheet" className="IconImg mx-2" />
            <span className="nav_title ml-4">My Timesheet</span>
          </a>
        </li>
      )}
      <li className={activeNav === "/My_Approvals" ? "active" : ""}>
        <a
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/My_Approvals");
          }}
          title="My Approvals"
        >
          <FontAwesomeIcon
            icon={faUserCheck}
            className="IconImg mx-2"
            style={{ color: "grey" }}
            size="2x"
          />
          <span className="nav_title px-1 ml-4">My Approvals</span>
        </a>
      </li>
    </ul>
  );
};

export default WhizVerticalNavMobile;
