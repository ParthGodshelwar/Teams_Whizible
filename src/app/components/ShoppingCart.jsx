import React, { useState } from "react";
import { Button, TextField } from "@mui/material"; // Import MUI components
import { Drawer } from "@mui/material"; // Import Drawer from MUI
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome icons
import { faEye, faHistory } from "@fortawesome/free-solid-svg-icons"; // Import specific icons

const MyTimesheet = () => {
  const [activeTab, setActiveTab] = useState("Approved"); // Default active tab
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [showDetail, setShowDetail] = useState(false); // State for detail drawer
  const [showHistory, setShowHistory] = useState(false); // State for history drawer
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected item

  // Sample data for each tab. Replace these with your actual data or API calls.
  const approvedData = [
    {
      id: 1,
      submittedDate: "2024-10-01",
      period: "Q1 2024",
      actualHours: 8,
      status: "Approved",
      history: "Submitted on Oct 1",
      by: "User A",
      date: "2024-10-01",
      remark: "Good work"
    },
    {
      id: 2,
      submittedDate: "2024-10-05",
      period: "Q1 2024",
      actualHours: 7,
      status: "Approved",
      history: "Submitted on Oct 5",
      by: "User B",
      date: "2024-10-05",
      remark: "Well done"
    }
  ];

  const rejectedData = [
    {
      id: 3,
      submittedDate: "2024-10-07",
      period: "Q1 2024",
      actualHours: 5,
      status: "Rejected",
      history: "Submitted on Oct 7",
      by: "User C",
      date: "2024-10-07",
      remark: "Incomplete"
    },
    {
      id: 4,
      submittedDate: "2024-10-08",
      period: "Q1 2024",
      actualHours: 6,
      status: "Rejected",
      history: "Submitted on Oct 8",
      by: "User D",
      date: "2024-10-08",
      remark: "Insufficient hours"
    }
  ];

  const submittedData = [
    {
      id: 5,
      submittedDate: "2024-10-09",
      period: "Q1 2024",
      actualHours: 4,
      status: "Submitted",
      history: "Submitted on Oct 9",
      by: "User E",
      date: "2024-10-09",
      remark: "Pending approval"
    },
    {
      id: 6,
      submittedDate: "2024-10-10",
      period: "Q1 2024",
      actualHours: 3,
      status: "Submitted",
      history: "Submitted on Oct 10",
      by: "User F",
      date: "2024-10-10",
      remark: "Awaiting review"
    }
  ];

  const renderTable = (data) => (
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter(
            (item) =>
              item.submittedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.history.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.by.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.remark.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <tr key={item.id}>
              <td>{item.submittedDate}</td>
              <td>{item.period}</td>
              <td>{item.actualHours}</td>
              <td>{item.status}</td>
              <td>{item.history}</td>
              <td>{item.by}</td>
              <td>{item.date}</td>
              <td>{item.remark}</td>
              <td>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDetail(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} /> View Details
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowHistory(true);
                  }}
                  className="ms-2"
                >
                  <FontAwesomeIcon icon={faHistory} /> History
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Set the active tab when clicked
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
        />
      </div>

      {/* Render the appropriate table based on the active tab */}
      <div className="tab-content" id="TS_entryTabContent">
        {activeTab === "Approved" && renderTable(approvedData)}
        {activeTab === "Rejected" && renderTable(rejectedData)}
        {activeTab === "Submitted" && renderTable(submittedData)}
      </div>

      {/* Detail Drawer */}
      <Drawer anchor="right" open={showDetail} onClose={() => setShowDetail(false)}>
        <div style={{ padding: "20px", width: "300px" }}>
          <h2>Details</h2>
          {selectedItem && (
            <div>
              <h5>Submitted Date: {selectedItem.submittedDate}</h5>
              <p>Period: {selectedItem.period}</p>
              <p>Actual Hours: {selectedItem.actualHours}</p>
              <p>Status: {selectedItem.status}</p>
              <p>History: {selectedItem.history}</p>
              <p>By: {selectedItem.by}</p>
              <p>Date: {selectedItem.date}</p>
              <p>Approve/Reject Remark: {selectedItem.remark}</p>
            </div>
          )}
        </div>
      </Drawer>

      {/* History Drawer */}
      <Drawer anchor="right" open={showHistory} onClose={() => setShowHistory(false)}>
        <div style={{ padding: "20px", width: "300px" }}>
          <h2>History</h2>
          {selectedItem && <p>{selectedItem.history}</p>}
        </div>
      </Drawer>
    </div>
  );
};

export default MyTimesheet;
