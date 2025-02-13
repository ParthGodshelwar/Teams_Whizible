import React, { useState, useEffect } from "react";
import { Button, TextField, Box, IconButton } from "@mui/material";
import { Drawer } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TimesheetHistoryDrawer from "./TimesheetHistoryDrawer";
import TimesheetDetailDrawer from "./TimesheetDetailDrawer";

const MyTimesheet = () => {
  const [activeTab, setActiveTab] = useState("Approved"); // Default active tab
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [showDetail, setShowDetail] = useState(false); // State for detail drawer
  const [showHistory, setShowHistory] = useState(false); // State for history drawer
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected item

  const [approvedData, setApprovedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);

  const accessToken = sessionStorage.getItem("token");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust items per page as needed
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;
  // Function to fetch timesheet data based on status
  const fetchTimesheetData = (status) => {
    return fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheet/GetMyTimesheetList?UserID=${employeeId}&Status=${status}&PageNo=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json, text/plain, */*"
        }
      }
    ).then((response) => response.json());
  };

  // Fetch data based on the active tab
  useEffect(() => {
    const statusMap = {
      Approved: "R", // Status 'R' for Approved
      Rejected: "J", // Status 'J' for Rejected
      Submitted: "S" // Status 'S' for Submitted
    };

    const status = statusMap[activeTab];

    fetchTimesheetData(status).then((response) => {
      const timesheetData = response?.data?.listMyTimesheetListEntity || [];

      if (Array.isArray(timesheetData)) {
        if (activeTab === "Approved") {
          setApprovedData(timesheetData);
        } else if (activeTab === "Rejected") {
          setRejectedData(timesheetData);
        } else if (activeTab === "Submitted") {
          setSubmittedData(timesheetData);
        }
      } else {
        console.error("API returned unexpected data format:", response);
      }
    });
  }, [activeTab]);

  const renderTable = (data) => {
    // Get the current items based on pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = data
      .filter(
        (item) =>
          item.submittedDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.period?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.history?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.remark?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <table className="table table-bordered w-100">
          <thead>
            <tr>
              <th>Submitted Date</th>
              <th>Period</th>
              <th>Actual Hours</th>
              <th>Status</th>
              <th>History</th>
              <th>By</th>
              <th>Date</th>
              <th>Approve/Reject Remark</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr
                key={item.id}
                style={{
                  transition: "background-color 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                <td>{item.submittedDate}</td>
                <td>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowHistory(true);
                    }}
                    sx={{
                      border: "none",
                      backgroundColor: "transparent",
                      "&:hover": {
                        border: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.1)"
                      }
                    }}
                  >
                    {item.period}
                  </Button>
                </td>
                <td>{item.actualHours}</td>
                <td>{item.status}</td>
                <td>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetail(true);
                    }}
                    sx={{
                      border: "none",
                      backgroundColor: "transparent",
                      "&:hover": {
                        border: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.1)"
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </td>
                <td>{item.by}</td>
                <td>{item.date}</td>
                <td>{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2
          }}
        >
          <IconButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <span>{currentPage}</span>
          <IconButton
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / itemsPerPage)))
            }
            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </>
    );
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Set the active tab when clicked
    setCurrentPage(1); // Reset to the first page when the tab changes
  };

  return (
    <div className="allWorkflowTabsDiv allTabsDivStructure d-flex flex-column ms-4 mt-4">
      {/* Tabs */}
      <ul className="nav nav-tabs pe-3 justify-content-end" id="AllEntityTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link position-relative ${activeTab === "Approved" ? "active" : ""}`}
            onClick={() => handleTabClick("Approved")}
            role="tab"
            aria-selected={activeTab === "Approved"}
          >
            Approved
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link position-relative ${activeTab === "Rejected" ? "active" : ""}`}
            onClick={() => handleTabClick("Rejected")}
            role="tab"
            aria-selected={activeTab === "Rejected"}
          >
            Rejected
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link position-relative ${activeTab === "Submitted" ? "active" : ""}`}
            onClick={() => handleTabClick("Submitted")}
            role="tab"
            aria-selected={activeTab === "Submitted"}
          >
            Submitted
          </button>
        </li>
      </ul>

      {/* Search Field */}
      <div className="d-flex justify-content-end mb-3 mt-2">
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }} // Adjust the width as needed
          InputProps={{
            style: {
              height: "30px" // Adjust the height as needed
            }
          }}
        />
      </div>

      {/* Render the appropriate table based on the active tab */}
      <div className="tab-content" id="TS_entryTabContent">
        {activeTab === "Approved" && renderTable(approvedData)}
        {activeTab === "Rejected" && renderTable(rejectedData)}
        {activeTab === "Submitted" && renderTable(submittedData)}
      </div>

      <TimesheetDetailDrawer
        showHistory={showDetail}
        setShowHistory={setShowDetail}
        timesheetID={selectedItem?.timesheetID}
        selectedItem={selectedItem}
      />

      <TimesheetHistoryDrawer
        showDetail={showHistory}
        setShowDetail={setShowHistory}
        timesheetID={selectedItem?.timesheetID}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default MyTimesheet;
