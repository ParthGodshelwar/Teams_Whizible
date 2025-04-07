import React, { useState, useEffect, useRef } from "react";
import ApprovedTimesheet from "./ApprovedTimesheet";
import RejectedTimesheet from "./RejectedTimesheet";
import SubmittedTimesheet from "./SubmittedTimesheet";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import axios from "axios";
// import "./TimesheetMobileView.css";
// import "../css/style.css";
// import "../css/style_bk.css";
// import "../css/style_Madhuri.css";

import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Tooltip } from "@mui/material";
// import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import TimesheetEntryTab from "./TimesheetEntryTab";

// const MyTimesheetTab = () => {
//   const [activeSubTab, setActiveSubTab] = useState("Approved");

//   const handleSubTabChange = (tab) => {
//     setActiveSubTab(tab);
//   };

//   return (
//     <>

//     </>
//   );
// };

// export default MyTimesheetTab;

const statusMap = {
  Approved: "v", // 'R' for Approved
  Rejected: "j", // 'J' for Rejected
  Submitted: "r", // 'S' for Submitted
};

const MyTimesheetTab = ({}) => {
  const [selectedTab, setSelectedTab] = useState("Submitted");
  const [timesheetData, setTimesheetData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null); // For drawer visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [timesheetID, setTimesheetID] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [timesheetHistory, setTimesheetHistory] = useState([]);

  const accessToken = sessionStorage.getItem("token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;
  const dropdownRef = useRef(null);

  const [activeCard, setActiveCard] = useState(null); // Tracks clicked card
  const [isFullHeight, setIsFullHeight] = useState(false);
  const scrollRef = useRef(null);
  const lastScrollTop = useRef(0);

  const toggleActions = (timesheetID) => {
    // setActiveCard(activeCard === timesheetID ? null : timesheetID);
    if (showActions === timesheetID) {
      setShowActions(null); // Close if already open
    } else {
      setShowActions(timesheetID); // Open for the clicked entry
    } // Toggle active state
  };

  const fetchTimesheetData = async (status, page, reset = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheet/GetMyTimesheetList?UserID=${employeeId}&Status=${status}&PageNo=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json, text/plain, */*",
          },
        }
      );
      const data = await response.json();

      // if (data && data.data && Array.isArray(data.data.listMYTimesheet)) {
      //   setTimesheetData(data.data.listMYTimesheet);
      // } else {
      //   setTimesheetData([]); // Set empty array if response is not valid
      //   console.error("Unexpected API response format:", data);
      // }
      // setTimesheetData(data || []); // Ensure data is an array

      if (
        data?.data?.listMYTimesheet &&
        Array.isArray(data.data.listMYTimesheet)
      ) {
        setTimesheetData((prevData) =>
          reset
            ? data.data.listMYTimesheet
            : [...prevData, ...data.data.listMYTimesheet]
        );
        setHasMore(data.data.listMYTimesheet.length >= 5);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(null);
      }
    }

    // Add event listener when dropdown is open
    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  // useEffect(() => {
  //   fetchTimesheetData(statusMap[selectedTab], currentPage);
  // }, [selectedTab, currentPage]);

  useEffect(() => {
    setTimesheetData([]); // Clear previous tab data
    setCurrentPage(1); // Reset pagination
    setHasMore(true); // Reset 'Load More' availability
    fetchTimesheetData(statusMap[selectedTab], 1, true);
  }, [selectedTab]);

  const loadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage > 1) {
      fetchTimesheetData(statusMap[selectedTab], currentPage);
    }
  }, [currentPage]);

  const openDrawer = (entry) => {
    setSelectedTimesheet(entry);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedTimesheet(null);
    setIsDrawerOpen(false);
  };

  const openHisDrawer = (timesheetID) => {
    // setSelectedTimesheet(entry);
    setTimesheetID(timesheetID);
    setIsHistoryDrawerOpen(true);
  };

  const closeHisDrawer = () => {
    // setSelectedTimesheet(null);
    setIsHistoryDrawerOpen(false);
  };

  useEffect(() => {
    if (isHistoryDrawerOpen) {
      fetchTimesheetHistory();
    }
  }, [isHistoryDrawerOpen, timesheetID]);

  const fetchTimesheetHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheet/GetMyTimesheetHistory?TimesheetID=${timesheetID}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTimesheetHistory(response.data.data.myTimesheetHistoryListEntity);
    } catch (error) {
      console.error("Error fetching timesheet history:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "badge-success";
      case "Pending":
        return "badge-warning";
      case "Rejected":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  useEffect(() => {
    const drawer = scrollRef.current;
    if (!drawer) return;

    const handleScroll = () => {
      const currentScroll = drawer.scrollTop;

      // If scrolling down
      if (currentScroll > lastScrollTop.current + 10) {
        closeDrawer(); // close on scroll down
      }

      // If scrolling up
      if (currentScroll < lastScrollTop.current - 10) {
        setIsFullHeight(true); // make it full screen
      }

      lastScrollTop.current = currentScroll;
    };

    drawer.addEventListener("scroll", handleScroll);
    return () => drawer.removeEventListener("scroll", handleScroll);
  }, [closeDrawer]);

  // useEffect(() => {
  //   fetchTimesheetData(statusMap.Approved, currentPage); // Load initial data
  // }, [currentPage]); // Trigger fetch when page changes

  return (
    <div className="container">
      {/* Tabs Section */}
      <div className="allWorkflowTabsDiv d-flex justify-content-start ms-4">
        <ul className="nav nav-tabs mx-auto gap-3 mb-3">
          {["Approved", "Rejected", "Submitted"].map((tab) => (
            <li className="nav-item" key={tab}>
              <a
                href="javascript:;"
                className={selectedTab === tab ? "active" : ""}
                onClick={() => {
                  setSelectedTab(tab);
                  // setCurrentPage(1); // Reset to page 1 when switching tabs
                }}
              >
                {tab === "Approved" && (
                  <i className="fa-regular fa-thumbs-up text-green"></i>
                )}
                {tab === "Rejected" && (
                  <i className="fa-regular fa-thumbs-down text_red"></i>
                )}
                {tab === "Submitted" && (
                  <i className="fa-regular fa-share-from-square blueTxt"></i>
                )}{" "}
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Timesheet Cards */}
      {isLoading ? (
        <div className="text-center mt-3">
          <i className="fa fa-spinner fa-spin fa-2x"></i>
        </div>
      ) : (
        <div className="row">
          {timesheetData.length === 0 ? (
            <div className="text-center">No records found</div>
          ) : (
            timesheetData.map((entry, index) => (
              <div className="col-12" key={index}>
                <div
                  className={`card shadowBox mb-2 ${
                    selectedTab === "Approved"
                      ? "greenCardBrdr"
                      : selectedTab === "Rejected"
                      ? "redCardBrdr"
                      : "skyBlueCardBrdr"
                  }`}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-end flex-column">
                      <div></div>
                      <Tooltip title="More Details">
                        <a
                          href="javascript:;"
                          // data-bs-toggle="offcanvas"
                          // data-bs-target="#MyTS_SubmittedDetlsOffcanvas"
                          // onClick={() => setShowActions(!showActions)} // Toggle visibility
                          onClick={() => toggleActions(entry.timesheetID)}
                        >
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </a>
                      </Tooltip>

                      {/* Conditional Buttons: Show only for active card */}
                      {showActions === entry.timesheetID && (
                        // <div className="mt-2 d-flex gap-2">
                        //   <button className="btn btn-primary">Details</button>
                        //   <button className="btn btn-secondary">History</button>
                        // </div>
                        // <>
                        //   <div className="action-buttons mt-2 p-2 bg-white shadow rounded">
                        //     <button
                        //       className="btn btn-primary btn-sm d-block mb-1"
                        //       // data-bs-toggle="offcanvas"
                        //       // data-bs-target="#timesheetDrawer"
                        //       onClick={() => openDrawer(entry)}
                        //     >
                        //       Details
                        //     </button>
                        //     <button className="btn btn-secondary btn-sm d-block mb-1">
                        //       History
                        //     </button>
                        //   </div>
                        // </>

                        <div
                          ref={dropdownRef}
                          className="action-buttons mt-2 p-2 bg-white shadow rounded"
                          style={{ position: "absolute", zIndex: 1000 }}
                        >
                          <div className="dropdown">
                            <ul
                              className="dropdown-menu show"
                              style={{ position: "static", display: "block" }}
                            >
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setFromDate(entry.fromDate);
                                    openDrawer(entry);
                                    setShowActions(null); // Close the dropdown after selection
                                  }}
                                >
                                  Details
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    openHisDrawer(entry.timesheetID);
                                    setShowActions(null);
                                  }} // Close the dropdown after selection
                                >
                                  History
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Details */}
                    {[
                      { label: "Submitted Date", value: entry.dateOfCreation },
                      { label: "Period", value: entry.period },
                      { label: "Actual Hours", value: entry.actualHours },
                      {
                        label: "Status",
                        value: (
                          <div className="statusDiv1 d-flex align-items-center">
                            <span
                              className={`statusBox mx-2 ${
                                selectedTab === "Approved"
                                  ? "statusApproved"
                                  : selectedTab === "Rejected"
                                  ? "statusRejected"
                                  : "statusSubmitted"
                              }`}
                            >
                              &nbsp;
                            </span>
                            <label className="">
                              {entry.statusDescription}
                            </label>
                          </div>
                        ),
                      },
                      {
                        label: "Approved By",
                        value: (
                          <>
                            {/* <img
                              src={entry.approvedImg}
                              alt=""
                              className="img-fluid resImg mx-2"
                            /> */}
                            {entry.by}
                          </>
                        ),
                      },
                      // { label: "Date", value: entry.date },
                      { label: "Approve/Reject Remark", value: entry.comment },
                    ].map((item, idx) => (
                      <div className="card-item_ mb-1" key={idx}>
                        <div className="cardContent">
                          <div className="row">
                            <div className="col-5 col-sm-5 text-end">
                              <span className="CardsTitle">{item.label} :</span>
                            </div>
                            <div className="col-7 col-sm-7">
                              <span>{item.value ? item.value : "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center my-3">
          <button
            onClick={loadMore}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/*Details Drawer */}
      {isDrawerOpen && selectedTimesheet && (
        <>
          <div
            className="drawer-backdrop"
            onClick={closeDrawer} // or remove this if you want it to be non-clickable
          ></div>
          {/* <div
            className="offcanvas offcanvas-bottom offcanvasHeight-75 show box_shodow"
            style={{ display: "block", overflowY: "auto" }}
          > */}
          <div
            ref={scrollRef}
            className={`offcanvas offcanvas-bottom box_shodow show ${
              isFullHeight ? "full-height" : "offcanvasHeight-75"
            }`}
            style={{
              display: "block",
              overflowY: "auto",
              transition: "height 0.3s ease",
            }}
          >
            <div className="offcanvas-body">
              <div className="TimesheetEntryDetlsSec">
                <div className="stickyOffHeader pt-3">
                  <div className="greyCloseOffcanvas" onClick={closeDrawer}>
                    &nbsp;
                  </div>
                </div>
                <TimesheetEntryTab timesheetdate={fromDate} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* History Drawer */}
      {isHistoryDrawerOpen && timesheetHistory && (
        <>
          <div
            className="drawer-backdrop"
            onClick={closeHisDrawer} // or remove this if you want it to be non-clickable
          ></div>
          <div
            className="offcanvas offcanvas-bottom offcanvasHeight-75 box_shodow show d-flex flex-column"
            style={{ display: "block", height: "75vh" }}
          >
            <div className="offcanvas-body d-flex flex-column pt-0">
              <div className="TimesheetEntryDetlsSec d-flex flex-column flex-grow-1">
                <div className="stickyOffHeader bg-white pt-3">
                  <div
                    className="greyCloseOffcanvas mb-3"
                    onClick={closeHisDrawer}
                  >
                    &nbsp;
                  </div>

                  <h5 className=" pgtitle">My Timesheet History</h5>
                </div>

                {/* History Cards */}
                <div
                  className="history-card-container flex-grow-1"
                  style={{ overflowY: "auto", paddingRight: "10px" }}
                >
                  {timesheetHistory.length > 0 ? (
                    timesheetHistory.map((history, index) => (
                      <div
                        className="card mb-3 shadow-sm border-0 rounded-lg"
                        key={index}
                      >
                        <div className="card-body p-4">
                          {/* <div className="d-flex justify-content-between align-items-center mb-3">
                          <span
                            className={`badge ${getStatusBadgeClass(
                              history.statusDescription
                            )}`}
                          >
                            {history.statusDescription}
                          </span>
                        </div> */}
                          <div className="mb-2">
                            <small className="text-muted">Status:</small>
                            <p className="mb-0 font-weight-bold">
                              {history.statusDescription}
                            </p>
                          </div>

                          <div className="mb-2">
                            <small className="text-muted">
                              Generation Date:
                            </small>
                            <p className="mb-0 font-weight-bold">
                              {formatDate(history.createdDate)}
                            </p>
                          </div>

                          <div className="mb-2">
                            <small className="text-muted">Updated Date:</small>
                            <p className="mb-0 font-weight-bold">
                              {history.updatedDate
                                ? formatDate(history.updatedDate)
                                : "N/A"}
                            </p>
                          </div>

                          <div className="mb-2">
                            <small className="text-muted">
                              Action Taken By:
                            </small>
                            <p className="mb-0 font-weight-bold">
                              {history.actionTakenBy || "N/A"}
                            </p>
                          </div>

                          <div className="mb-2">
                            <small className="text-muted">Action Taken:</small>
                            <p className="mb-0 font-weight-bold">
                              {history.actionTaken}
                            </p>
                          </div>

                          <div className="mb-0">
                            <small className="text-muted">Approver Name:</small>
                            <p className="mb-0 font-weight-bold">
                              {history.approverName || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted py-4">
                      No history available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyTimesheetTab;
