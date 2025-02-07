import React, { useState, useEffect } from "react";
import TimesheetTable from "./TimesheetTable";
import ApprTabs from "./ApprTabs";
import SelectProjectDetlsModal from "./SelectProjectDetlsModal";
import DATypeDetlsModal from "./DATypeDetlsModal";
import EditMyTSoffcanvas from "./EditMyTSoffcanvas";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { toast, ToastContainer } from "react-toastify";
import EditMyTSRejectoffcanvas from "./EditMyTSRejectoffcanvas";
import EditMyTSsubmitoffcanvas from "./EditMyTSsubmitoffcanvas";
import TimesheetFilters from "./TimesheetFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import TimesheetAccordion from "./TimesheetAccordion"; // Import the accordion component
import MyTimesheet from "./MyTimesheet";
import Project_blu_icon from "./img/Project_blu_icon.svg";
import mytimesheet_blu_icon from "./img/mytimesheet_blu_icon.svg";
import TimesheetBottomSec from "../LandingPage/TimesheetBottomSec";
import axios from "axios";
import { Tooltip } from "@mui/material";
const TimesheetEntry = ({ projects, tasks }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedSubtask, setSelectedSubtask] = useState("");
  const [timesheetData, setTimesheetData] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // Manage filters visibility
  const [showAccordion, setShowAccordion] = useState(false); // Manage accordion visibility
  const [appliedFilters, setAppliedFilters] = useState({});
  const [activeTab, setActiveTab] = useState("timesheetEntry");
  const [newdate, setNewdate] = useState(""); // Manage active tab
  const [searchTerm, setSearchTerm] = useState("");
  const [topdata, setTopdata] = useState({});
  const [date1, setDate1] = useState({});
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.data?.employeeId;
  const [refresh1, setRefresh1] = useState(false);
  // Function to handle search term changes
  const [refresh12, setRefresh12] = useState(false);
  console.log("GetTimesheetEntryDetailsss9999", newdate);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // useEffect(() => {
  //   // Fetch the timesheet data from an API
  //   const fetchTimesheetData = async () => {
  //     try {
  //       const response = await fetch("YOUR_API_ENDPOINT"); // Replace with your actual API endpoint
  //       const data = await response.json();
  //       setTimesheetData(data);
  //     } catch (error) {
  //       console.error("Error fetching timesheet data:", error);
  //     }
  //   };

  //   fetchTimesheetData();
  // }, []);

  const toggleFilters = () => {
    setShowFilters((prevState) => !prevState); // Toggles the filter panel visibility
  };

  const toggleAccordion = () => {
    setShowAccordion((prevState) => !prevState); // Toggles the accordion visibility
  };
  useEffect(() => {
    // Set showFilters to true on the first render
    setShowFilters(true);

    // Set a timeout to make it false after 1 second
    const timer = setTimeout(() => {
      setShowFilters(false);
    }, 200); // 1000 milliseconds = 1 second

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    console.log("Applied Filters:", appliedFilters);
  }, [appliedFilters]);

  // const removeFilter = (filterKey) => {
  //   setAppliedFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [filterKey]: undefined
  //   }));
  // };

  const removeFilter = (filterKey) => {
    if (filterKey === "selectedProject") {
      // Clear all filters if the selected project filter is removed
      setAppliedFilters({});
    } else {
      // Remove the specific filter
      const newFilters = { ...appliedFilters };
      delete newFilters[filterKey];
      setAppliedFilters(newFilters);
    }
  };

  const handleSubmitTimesheet = async () => {
    console.log("timesheetData.listProjectDetailsEntity", timesheetData);

    // Retrieve selected tasks from sessionStorage
    const selectedTasksFromSession = JSON.parse(sessionStorage.getItem("selectedTasks")) || [];

    const payload = {
      userID: UserID, // Replace with actual userID value
      weekStartDate: new Date(
        new Date(timesheetData.listTimesheetEntryHeader[0].weekStartDate).getTime() -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0], // Format as 'YYYY-MM-DD'

      weekEndDate: new Date(
        new Date(timesheetData.listTimesheetEntryHeader[0].weekEndDate).getTime() -
          new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0],

      // Check if selectedTasks are available, otherwise include all tasks
      listDADetailsEntity: timesheetData.listProjectDetailsEntity.flatMap((project) =>
        project.listTaskDetailsEntity.flatMap(
          (task) =>
            [1, 2, 3, 4, 5, 6, 7]
              .map((day) => {
                const dayDateKey = `dayDate${day}`;
                const dayEffortsKey = `dayEfforst${day}`;
                const daySumTotalKey = `daySumTotal${day}`;
                const descriptionKey = `descriptiont${day}`;
                const daTypeKey = `daTypet${day}`;
                const daiD = `daiD${day}`;

                // Exclude task if duration is "00:00"
                if (task[dayEffortsKey] === "00:00") return null; // Skip this task

                // Check if task is in selectedTasks, only include it if selected
                // if (
                //   selectedTasksFromSession.length > 0 &&
                //   !selectedTasksFromSession.includes(task.taskID)
                // ) {
                //   return null; // Exclude tasks not in selectedTasks
                // }

                return {
                  dailyActivityEntryID: task[daiD],
                  taskID: task.taskID,
                  projectID: project.projectID,
                  entryDate: new Date(
                    new Date(
                      timesheetData.listTimesheetEntryHeader[0][dayDateKey]?.split("|")[0]
                    ).getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .split("T")[0],
                  duration: task[dayEffortsKey] || "0",
                  totalDuration: timesheetData.listTimesheetEntryHeader[0][daySumTotalKey] || "0",
                  description: task[descriptionKey] || "N/A",
                  taskTypeID: task.taskTypeID,
                  subTaskTypeID: 0,
                  isDurationChange: true,
                  isTaskComplete: false,
                  actualPercentComplete: 0,
                  isResourceTaskComplete: false,
                  overtime: "0",
                  daType: task[daTypeKey] || "N",
                  storyPoint: 0,
                  resourceTimesheetID: 0
                };
              })
              .filter(Boolean) // Remove null values (tasks with "00:00" duration or not selected)
        )
      )
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/SaveDailyActivity`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit timesheet");
      }

      const result = await response.json();
      console.log("Timesheet submit result:", result);

      // Extract validation data
      const validationData = result?.data;
      setRefresh1(!refresh1);
      if (validationData.validationMessage.includes("the Daily Activity will still be saved.")) {
        // Handle the case where the message contains the specific string
        toast.info(validationData.validationMessage);
      }
      if (!validationData || validationData.validationMessage === null) {
        toast.error("Please Fill Dailyactivity");
        console.error("Missing validation message in API response:", validationData);
      } else {
        let { validationMessage } = validationData;

        // Format the validation message properly
        if (validationMessage.toLowerCase().includes("success")) {
          // Show green toast for success
          toast.success("Daily Activity Saved Successfully!", {
            style: { backgroundColor: "green", color: "white" }
          });
        } else {
          // Replace '\r\n' with a new line `<br/>` for proper formatting
          const formattedMessage = validationMessage.split("\r\n").join("<br/>");

          // Show red toast for validation errors
          toast.error(<div dangerouslySetInnerHTML={{ __html: formattedMessage }} />, {
            style: { backgroundColor: "red", color: "white" }
          });
        }
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast.error("An error occurred while submitting the timesheet.");
    }
  };

  console.log("timesheetData.listProjectDetailsEntity", timesheetData);
  const handleSubmitTimesheet1 = async () => {
    console.log("timesheetData.listProjectDetailsEntity", timesheetData);
    const payload = {
      userID: UserID, // Replace with actual userID value
      weekStartDate: new Date(
        new Date(timesheetData.listTimesheetEntryHeader[0].weekStartDate).setDate(
          new Date(timesheetData.listTimesheetEntryHeader[0].weekStartDate).getDate() + 1
        )
      ).toISOString(),
      weekEndDate: new Date(
        new Date(timesheetData.listTimesheetEntryHeader[0].weekEndDate).setDate(
          new Date(timesheetData.listTimesheetEntryHeader[0].weekEndDate).getDate() + 1
        )
      ).toISOString()
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/SubmitDailyActivity`,
        payload,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("response.data?.data", response.data);

      const validationMessage = response.data?.data?.[0]?.validationMessage;
      const mailEntities = response.data?.data?.listDASendMailEntity;
      if (
        validationMessage &&
        (validationMessage.toLowerCase().includes("success") ||
          validationMessage.toLowerCase().includes("successful"))
      ) {
        toast.success("Timesheet submitted successfully");
      } else {
        toast.error(validationMessage);
      }
      if (mailEntities && mailEntities.length > 0) {
        for (const mail of mailEntities) {
          const { result, fromEmailID, toEmailID, ccEmailID, subject, body } = mail;

          if (result.toLowerCase() === "success" && fromEmailID) {
            toast.success("Timesheet submitted successfully");
            const requestBody = {
              fromAddress: fromEmailID,
              toAddress: toEmailID || "", // Ensure it doesn't break if empty
              ccAddress: ccEmailID || "", // Include CC if available
              subject: subject,
              body: body,
              isHtml: 1
            };

            console.log("Sending Email:", requestBody);

            await axios.post(
              `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`,
              requestBody,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                  "Content-Type": "application/json"
                }
              }
            );

            console.log("Email sent successfully!");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast.error("An error occurred while submitting the timesheet.");
    }
  };
  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Set active tab based on the button clicked
  };
  console.log("appliedFilters", appliedFilters);
  return (
    <section
      id="content-wrapper"
      className="content_wrapper"
      style={{ width: "130%", display: "block" }}
    >
      <div className="col-sm-12 col-lg-9">
        <div
          className="allWorkflowTabsDiv d-none d-lg-flex justify-content-start ms-4"
          id="DeskWF_TabsDiv"
        >
          <ul className="nav nav-tabs pe-3" id="AllEntityTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link position-relative ${
                  activeTab === "timesheetEntry" ? "active" : ""
                }`}
                onClick={() => handleTabClick("timesheetEntry")}
              >
                <img src={Project_blu_icon} alt="" className="ApprIcns" />
                Timesheet Entry
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link position-relative ${
                  activeTab === "myTimesheet" ? "active" : ""
                }`}
                onClick={() => handleTabClick("myTimesheet")}
              >
                <img src={mytimesheet_blu_icon} alt="" className="ApprIcns" />
                My Timesheet
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="tab-content" id="TS_entryTabContent">
        {/* Conditionally render content based on active tab */}
        {activeTab === "timesheetEntry" && (
          <div className="tab-pane ApprTabs fade show active" id="TSEntryTab" role="tabpanel">
            <div className="TimesheetTopSec mb-2">
              <div className="weekly_calender">
                <TimesheetAccordion
                  setDate={setDate}
                  date={date}
                  setTopdata={setTopdata}
                  topdata={topdata}
                  setDate1={setDate1}
                  date1={date1}
                  showAccordion={showAccordion}
                  toggleAccordion={toggleAccordion}
                  newdate={newdate}
                />
              </div>
            </div>
            <div className="TimesheetLeftSec">
              <div className="row">
                <div className="TopInfoSec">
                  <div className="row">
                    <div className="container">
                      {/* Search Section */}
                      <div className="row justify-content-center align-items-center mb-3">
                        <div className="col-sm-6 d-flex justify-content-center">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search Task"
                              value={searchTerm}
                              onChange={handleSearchChange}
                            />
                            <button className="btn btn-outline-secondary" type="button">
                              <FontAwesomeIcon
                                icon={faSearch}
                                style={{ fontSize: "16px", cursor: "pointer" }}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="col-sm-4 d-flex ms-auto justify-content-end">
                          <Tooltip title={`Filter`}>
                            <FontAwesomeIcon
                              icon={faFilter}
                              data-tip="Filter"
                              style={{
                                fontSize: "15px",
                                cursor: "pointer",
                                color: "inherit", // Maintain text color
                                background: "none", // Remove background
                                border: "none", // Remove border
                                marginRight: "10px", // Add margin to the right
                                position: "relative", // Use position relative to adjust the vertical position
                                top: "5px" // Move it a little down
                              }}
                              onClick={toggleFilters}
                            />
                          </Tooltip>
                          {topdata.timesheetStatus === "" && (
                            <>
                              {String(topdata.weekActualHours) !== "00:00" && (
                                <button
                                  className="btn borderbtn me-2"
                                  id="SubmitTimesheetBtn"
                                  data-bs-toggle="tooltip"
                                  title="Submit Timesheet"
                                  onClick={handleSubmitTimesheet1}
                                >
                                  Submit Timesheet
                                </button>
                              )}
                              <button
                                className="btn btnyellow me-3"
                                id="saveTimesheetBtn"
                                data-bs-toggle="tooltip"
                                title="Save"
                                onClick={handleSubmitTimesheet}
                              >
                                Save
                              </button>
                            </>
                          )}
                          {topdata.timesheetStatus === "Not Submitted" && (
                            <>
                              {String(topdata.weekActualHours) !== "00:00" && (
                                <button
                                  className="btn borderbtn me-2"
                                  id="SubmitTimesheetBtn"
                                  data-bs-toggle="tooltip"
                                  title="Submit Timesheet"
                                  onClick={handleSubmitTimesheet1}
                                >
                                  Submit Timesheet
                                </button>
                              )}
                              <button
                                className="btn btnyellow me-3"
                                id="saveTimesheetBtn"
                                data-bs-toggle="tooltip"
                                title="Save"
                                onClick={handleSubmitTimesheet}
                              >
                                Save
                              </button>
                            </>
                          )}

                          {topdata.timesheetStatus === "Rejected" && (
                            <>
                              {String(topdata.weekActualHours) !== "00:00" && (
                                <button
                                  className="btn borderbtn me-2"
                                  id="SubmitTimesheetBtn"
                                  data-bs-toggle="tooltip"
                                  title="Resubmit Timesheet"
                                  onClick={handleSubmitTimesheet1}
                                >
                                  Resubmit Timesheet
                                </button>
                              )}
                              <button
                                className="btn btnyellow me-3"
                                id="saveTimesheetBtn"
                                data-bs-toggle="tooltip"
                                title="Save"
                                onClick={handleSubmitTimesheet}
                              >
                                Save
                              </button>
                            </>
                          )}

                          {["Approved", "Submitted"].includes(topdata.timesheetStatus) && null}
                        </div>
                      </div>

                      {/* Buttons Section */}
                    </div>

                    {showFilters && (
                      <div className="filter-container">
                        <TimesheetFilters
                          appliedFilters={appliedFilters}
                          setAppliedFilters={setAppliedFilters}
                        />
                      </div>
                    )}

                    <div className="applied-filters mt-3">
                      <h6>Applied Filters:</h6>
                      <div className="d-flex flex-wrap">
                        {Object.entries(appliedFilters).map(([filterKey, filterValue]) => {
                          console.log("appliedFilters111", filterKey, filterValue);

                          if (filterKey === "billable") {
                            const billableValue = filterValue;
                            console.log("billableValue", billableValue);
                            return (
                              <>
                                {billableValue != null &&
                                  billableValue !== "" &&
                                  billableValue !== undefined && (
                                    <div
                                      key={filterKey}
                                      className="filter-item me-2"
                                      style={{
                                        backgroundColor: "#f0f0f0",
                                        padding: "8px",
                                        borderRadius: "5px",
                                        marginBottom: "5px"
                                      }}
                                    >
                                      <span>
                                        Billable:{" "}
                                        {billableValue === 0 ? "No" : billableValue ? "Yes" : ""}
                                      </span>
                                      <button
                                        className="btn-close ms-1"
                                        style={{ fontSize: "0.7rem" }}
                                        onClick={() => removeFilter(filterKey)} // Removes the specific filter
                                        aria-label={`Remove ${filterKey} filter`}
                                      />
                                    </div>
                                  )}
                              </>
                            );
                          }

                          // Handle other filters
                          if (filterValue && filterValue.length > 0) {
                            const localStorageKeyMap = {
                              taskCategories: "taskscategories",
                              subProject: "subproject",
                              taskType: "tasktype"
                            };
                            const localStorageKey = localStorageKeyMap[filterKey] || filterKey;
                            const storedFilterData =
                              JSON.parse(localStorage.getItem(localStorageKey)) || [];
                            const filterNames = Array.isArray(filterValue)
                              ? filterValue
                                  .map((id) => {
                                    const matchedFilter = storedFilterData.find(
                                      (item) => item.id?.toString() === id.toString()
                                    );
                                    return matchedFilter
                                      ? matchedFilter.name || matchedFilter.text
                                      : ` ${id}`;
                                  })
                                  .join(", ")
                              : (() => {
                                  const matchedFilter = storedFilterData.find(
                                    (item) =>
                                      item.id?.toString() === filterValue.toString() ||
                                      item.key?.toString() === filterValue.toString()
                                  );
                                  return matchedFilter
                                    ? matchedFilter.name || matchedFilter.text
                                    : `${filterValue}`;
                                })();

                            const displayKey =
                              filterKey === "selectedProject"
                                ? "Project"
                                : filterKey === "taskCategories"
                                ? "Task Categories"
                                : filterKey === "taskType"
                                ? "Task Type"
                                : filterKey.charAt(0).toUpperCase() + filterKey.slice(1);

                            return (
                              <div
                                key={filterKey}
                                className="filter-item me-2"
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  padding: "8px",
                                  borderRadius: "5px",
                                  marginBottom: "5px"
                                }}
                              >
                                <span>
                                  {displayKey}: {filterNames}
                                </span>
                                <button
                                  className="btn-close ms-1"
                                  style={{ fontSize: "0.7rem" }}
                                  onClick={() => removeFilter(filterKey)} // Removes the specific filter
                                  aria-label={`Remove ${filterKey} filter`}
                                />
                              </div>
                            );
                          }
                          return null; // Render nothing if filterValue is empty
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <TimesheetTable
                  setTimesheetData={setTimesheetData}
                  // timesheetData={timesheetData}
                  setDate1={setDate1}
                  date1={date1}
                  setTopdata={setTopdata}
                  topdata={topdata}
                  appliedFilters={appliedFilters}
                  timesheetData={timesheetData}
                  date={date}
                  searchTerm={searchTerm}
                  newdate={newdate}
                  setNewdate={setNewdate}
                  setRefresh1={setRefresh1}
                  refresh1={refresh1}
                />
                <TimesheetBottomSec timesheetData={timesheetData} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "myTimesheet" && (
          <div className="tab-pane ApprTabs fade show active" id="MyTS_ApprTab" role="tabpanel">
            <div className="MyTimesheetContent">
              <MyTimesheet setActiveTab1={setActiveTab} setNewdate={setNewdate} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimesheetEntry;
