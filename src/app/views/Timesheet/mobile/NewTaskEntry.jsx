import React, { useState, useEffect, useRef } from "react";
import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Tooltip1 from "@mui/material/Tooltip";
import { FaCalendarCheck } from "react-icons/fa";
import { Callout, DirectionalHint } from "@fluentui/react";

const NewTaskEntry = ({ selectedDate, date1, setRefresh }) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formateddate = formatter.format(selectedDate);
  const date = selectedDate;
  const iconRef = useRef(null); // Reference for Callout positioning
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [timesheetData, setTimesheetData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [daTypes, setDATypes] = useState([]);
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const [selectedHour, setSelectedHour] = useState(
    timesheetData?.startHrh || "00"
  );
  const [selectedMinute, setSelectedMinute] = useState(
    timesheetData?.startMin || "00"
  );
  const [selectedHourT, setSelectedHourT] = useState(
    timesheetData?.toHrh || "00"
  );
  const [selectedMinuteT, setSelectedMinuteT] = useState(
    timesheetData?.toMin || "00"
  );
  const [selecteddaTypes, setSelecteddaTypes] = useState("N");
  const [efforts, setEfforts] = useState("00:00");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user.data.employeeId;
  const token = sessionStorage.getItem("token");

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    clearvalues();
  };

  useEffect(() => {
    if (date1 && typeof date1 === "string") {
      // Split date1 to get the time range "08:30 AM - 06:00 PM"
      const timeRange = date1.split("|")[1]?.trim(); // "08:30 AM - 06:00 PM"

      if (timeRange) {
        const [startTime, endTime] = timeRange.split(" - "); // ["08:30 AM", "06:00 PM"]

        // Extract start time (08:30 AM)
        const [startHour, startMinuteWithPeriod] = startTime.split(":");
        const startMinute = startMinuteWithPeriod.split(" ")[0]; // "30"
        const startPeriod = startMinuteWithPeriod.split(" ")[1]; // "AM"

        // Extract end time (06:00 PM)
        const [endHour, endMinuteWithPeriod] = endTime.split(":");
        const endMinute = endMinuteWithPeriod.split(" ")[0]; // "00"
        const endPeriod = endMinuteWithPeriod.split(" ")[1]; // "PM"

        // Update the state values
        setSelectedHour(startHour); // "08"
        setSelectedMinute(startMinute); // "30"
        setSelectedHourT(endHour); // "06"
        setSelectedMinuteT(endMinute); // "00"
        console.log("handleEffortsChange", startHour, startMinute);
      }
    } else {
      console.error("date1 is not a string or is undefined.");
    }
  }, [date1]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetailsDropDown?UserID=${userid}&FieldName=projectid`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setProjects(data.data.listTimesheetEntryDropDown);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetailsDropDown?UserID=${userid}&FieldName=Task`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setTasks(data.data.listTimesheetEntryDropDown);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Fetch Subtasks based on selected Task ID

    // Fetch DA Types
    const fetchDATypes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetailsDropDown?UserID=${userid}&FieldName=datype`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setDATypes(data.data.listTimesheetEntryDropDown);
      } catch (error) {
        console.error("Error fetching DA types:", error);
      }
    };

    // Handle task selection change

    fetchProjectDetails();

    fetchDATypes();
  }, []);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleEffortsChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    // Automatically add colon after 2 digits
    if (value.length > 2) {
      value = value.substring(0, 2) + ":" + value.substring(2, 4); // Keep first 2 digits, add colon and the next 2 digits
    }

    // Limit the value to 5 characters (hh:mm)
    if (value.length > 5) {
      value = value.substring(0, 5); // Ensure no more than 5 characters
    }

    // Ensure hours are in the valid 24-hour range (00-23)
    if (value.length >= 3) {
      const hours = parseInt(value.substring(0, 2), 10);
      if (hours > 23) {
        value = "23" + value.substring(2); // Limit hours to 23
      }
    }

    // Ensure minutes are in the valid range (00-59)
    if (value.length === 5) {
      const minutes = parseInt(value.substring(3), 10);
      if (minutes > 59) {
        value = value.substring(0, 3) + "59"; // Limit minutes to 59
      }
    }

    setEfforts(value); // Update the state with the formatted value
  };

  const handleTaskChange = (event) => {
    const taskId = event.target.value;
    setSelectedTask(taskId);
    fetchSubTasks(taskId); // Fetch subtasks based on the selected task
    setIsCalloutVisible(false);
  };
  const handleChange = (e) => {
    setSelectedProject(e.target.value);
    const pId = e.target.value;
    fetchTasks(pId);
  };
  const fetchTasks = async (pId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetailsDropDown?UserID=${userid}&ProjectID=${pId}&FieldName=Task`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setTasks(data.data.listTimesheetEntryDropDown);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const fetchSubTasks = async (taskId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDASubTaskDropDown?TaskID=${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setSubTasks(data.data.listTimesheetEntrySubTask);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  const handleSave = async () => {
    const hhmmRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/; // Regex for hh:mm format (24-hour)

    if (!hhmmRegex.test(efforts)) {
      toast.error("Please enter Efforts in HH:MM format");
      return;
    }
    console.log("ValidateDAEntry", date);
    const entryData = {
      entryDate: new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ).toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      // subTaskID: selectedsubTasks,
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description,
    };

    const entryData1 = {
      entryDate: new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ).toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      // subTaskID: selectedsubTasks,
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description,
      TotalDuration: `00:00`,
    };
    try {
      // Validate the entry first using POST with JSON body
      const validateResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/ValidateDAEntry`,
        {
          method: "POST", // Use POST to send data in the body
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entryData1), // Send the entryData in JSON body
        }
      );

      const validationResult = await validateResponse.json();
      console.log("validationResult", validationResult);

      // Check if validation message is success or not
      const validationErrors = validationResult?.data
        ?.filter((item) => item.validationMessage) // Extract items with validation messages
        .map((item) => item.validationMessage) // Extract the validation messages
        .join(", "); // Combine multiple messages into a single string
      console.log("postResult8888888", validationErrors);
      // If validation is successful, check the type value
      if (validationErrors == "Success") {
        // If validation is successful, check if type is 0
        const validationData = validationResult?.data?.[0]; // Assuming you want to check the first item in the data array

        if (validationData?.type === 0) {
          // If type is 0, call the PostDAEntryForDay API
          const postResponse = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/PostDAEntryForDay`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              body: JSON.stringify(entryData), // Send the entryData to post
            }
          );

          const postResult = await postResponse.json();

          // Check for the response validation message after posting the entry
          if (postResult?.data?.[0]?.validationMessage === "Success") {
            toast.success("Timesheet Entry saved successfully");
            // alert("w12");
            // clearvalues();
            // refreshGrid();
            setRefresh((prev) => !prev);
            closeDrawer();
          } else {
            const postValidationErrors = postResult?.data
              ?.filter(
                (item) =>
                  !item.validationMessage ||
                  item.validationMessage.trim() === ""
              ) // Check for null or empty validationMessage
              .map((item) => "Please fill Daily Activity")
              .concat(
                postResult?.data
                  ?.filter(
                    (item) =>
                      item.validationMessage &&
                      item.validationMessage.trim() !== ""
                  ) // Include non-empty validation messages
                  .map((item) => item.validationMessage)
              )
              .join(", ");

            toast.error(`Error: ${postValidationErrors}`);
          }
        }
      }

      // Add the case where validationErrors starts with "You were allocated ......"
      if (
        validationErrors?.startsWith("You were allocated") ||
        validationErrors?.startsWith("Entry date for")
      ) {
        toast.info(
          <div>
            <div style={{ marginBottom: "10px" }}>{validationErrors}</div>
            <button
              onClick={() => {
                toast.dismiss();
                yesClickHandler();
              }}
              style={{
                marginRight: "10px",
                padding: "5px 10px",
                border: "1px solid #ccc",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                toast.dismiss();
              }}
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                backgroundColor: "#f44336",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>,
          { autoClose: false }
        );
        // When "Yes" is clicked, call the post API again
        const yesClickHandler = async () => {
          const postResponse = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/PostDAEntryForDay`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              body: JSON.stringify(entryData), // Send the entryData to post
            }
          );

          const postResult = await postResponse.json();

          if (postResult?.data?.[0]?.validationMessage === "Success") {
            toast.success("Timesheet Entry saved successfully");
            // alert("w2");
            // clearvalues();
            // refreshGrid();
            setRefresh((prev) => !prev);
            closeDrawer();
          } else {
            const postValidationErrors = postResult?.data
              ?.filter(
                (item) =>
                  !item.validationMessage ||
                  item.validationMessage.trim() === ""
              ) // Check for null or empty validationMessage
              .map((item) => "Please fill Daily Activity")
              .concat(
                postResult?.data
                  ?.filter(
                    (item) =>
                      item.validationMessage &&
                      item.validationMessage.trim() !== ""
                  ) // Include non-empty validation messages
                  .map((item) => item.validationMessage)
              )
              .join(", ");

            toast.error(`Error: ${postValidationErrors}`);
          }
        };
      } else {
        if (validationErrors !== "Success") toast.error(validationErrors);
      }

      console.log("validationErrors99999999999", validationErrors);
    } catch (error) {
      console.error("Error during save:", error);
      toast("An error occurred. Please try again.", { type: "error" });
    }
  };

  const handleTaskHover = (taskId) => {
    fetchTaskDetails(taskId);
    setIsHovered(true);
  };

  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDATaskDetails?TaskID=${taskId}&UserID=${userid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setTaskDetails(data.data.listTimesheetEntryTaskDetails[0]);
      console.log("setTaskDetails", data.data.listTimesheetEntryTaskDetails[0]);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const clearvalues = () => {
    //Added by Parth.G to clear Values
    setSelectedProject("");
    setSelectedTask("");
    setSelecteddaTypes("N");
    setEfforts("00:00");
    setDescription("");
  };

  return (
    <>
      <div className="row mb-3 justify-content-end">
        <div className="ApplyFilSec d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              // handleSave();
              openDrawer();
            }}
          >
            New Task Entry
          </button>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className="offcanvas offcanvas-bottom offcanvasHeight-75 box_shodow show mb-3"
          style={{ overflowY: "hidden" }}
        >
          <div className="offcanvas-body" style={{ overflowY: "hidden" }}>
            <div>
              <div className="graybg container-fluid py-1 mb-2">
                <div className="row">
                  <div className="col-12 d-flex align-items-center justify-content-between">
                    <h5 className="pgtitle mb-0 ">Timesheet Entry</h5>
                    <Tooltip1 title="Close">
                      <button
                        type="button"
                        className="btn-close text-end"
                        onClick={closeDrawer}
                        aria-label="Close"
                      ></button>
                    </Tooltip1>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-6">
                  <div
                    style={{
                      textAlign: "center",
                      color: "#ed1c24",
                      fontSize: "15px",

                      margin: "20px 0",
                    }}
                  ></div>
                  <div className="calendarDate ps-3">
                    <FaCalendarCheck className="pe-1" />

                    {formateddate}

                    {/* <span className="ps-3">{timesheetData?.daMonth}</span> */}
                  </div>
                </div>
                <div className="col-sm-6 text-end">
                  <div className="pe-3">
                    (<span className="mandatoryTxt">*</span> Mandatory)
                  </div>
                  <div className="col-sm-12 text-end">
                    <div className="nextBtnDiv d-flex justify-content-end gap-2 pe-3">
                      <button
                        className="btn btnyellow"
                        id="saveTimesheetBtn"
                        data-bs-toggle="tooltip"
                        data-bs-original-title="Save"
                        onClick={() => {
                          handleSave();
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="TimesheetEntryDetlsSec"
              style={{
                // height: "320px",
                height: "100%",
                overflowY: "auto",
              }}
            >
              {/* <div className="stickyOffHeader pt-3">
                <div className="greyCloseOffcanvas" onClick={closeDrawer}>
                  &nbsp;
                </div>
              </div> */}

              <div>
                {/* <TimesheetEntryTab timesheetdate={fromDate} /> */}

                <div className="timesheetFields ">
                  <div className="row">
                    {/* <div className="row mb-3 justify-content-end">
                      <div className="ApplyFilSec d-flex justify-content-end">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleSave();
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div> */}

                    <div className="col-sm-12">
                      {/* Project */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-start required mt-2">
                          Project
                        </label>
                        <div className="col-sm-7">
                          <select
                            value={selectedProject} // need to add
                            onChange={handleChange}
                            style={{
                              width: "100%", // Ensures the select takes full width of its container
                              padding: "8px 12px", // Adds some padding for better visual space
                              fontSize: "12px", // Adjusts font size for readability
                              borderRadius: "4px", // Adds rounded corners for a modern look
                              border: "1px solid #ccc", // A soft border color
                              boxSizing: "border-box", // Makes sure padding doesn't affect the overall width
                            }}
                          >
                            <option>Select Project</option>
                            {Array.isArray(projects) && projects.length > 0 ? (
                              projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.name}{" "}
                                </option>
                              ))
                            ) : (
                              <option disabled>No projects available</option>
                            )}
                          </select>
                        </div>
                      </div>

                      {/* Task */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-start required mt-2">
                          Task
                        </label>
                        <div
                          className="col-sm-7"
                          style={{ position: "relative" }}
                        >
                          <select
                            onChange={handleTaskChange}
                            value={selectedTask}
                            style={{
                              width: "100%", // Ensures the select takes full width of its container
                              padding: "8px 12px", // Adds some padding for better visual space
                              fontSize: "12px", // Adjusts font size for readability
                              borderRadius: "4px", // Adds rounded corners for a modern look
                              border: "1px solid #ccc", // A soft border color
                              boxSizing: "border-box", // Makes sure padding doesn't affect the overall width
                            }}
                          >
                            <option value="">Select Task</option>
                            {tasks.map((task) => (
                              <option key={task.id} value={task.id}>
                                {task.name}
                              </option>
                            ))}
                          </select>

                          {/* <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "20px", // Move icon to the left by increasing the right value
                              transform: "translateY(-50%)", // Aligns the icon vertically in the middle
                              cursor: "pointer",
                            }}
                            onMouseEnter={() => handleTaskHover(selectedTask)}
                            onMouseLeave={() => setIsHovered(false)}
                          >
                            {selectedTask && (
                              <FaInfoCircle
                                style={{ fontSize: "15px", color: "#007bff" }}
                              />
                            )}
                          </div> */}

                          {selectedTask && (
                            <div
                              ref={iconRef}
                              style={{
                                position: "absolute",
                                top: "50%",
                                right: "27px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setIsCalloutVisible(!isCalloutVisible);
                                // handleTaskHover(selectedTask);
                                handleTaskHover(selectedTask);
                              }}
                            >
                              <FaInfoCircle
                                style={{ fontSize: "15px", color: "#007bff" }}
                              />
                            </div>
                          )}

                          {/* Task details Tooltip */}

                          {isCalloutVisible && (
                            <Callout
                              target={iconRef.current}
                              onDismiss={() => setIsCalloutVisible(false)}
                              directionalHint={DirectionalHint.rightCenter}
                              gapSpace={10}
                              setInitialFocus
                            >
                              <div
                                style={{ padding: "10px", maxWidth: "250px" }}
                              >
                                <div className="row">
                                  <div className="col-sm-6 col-12 txt_Blue">
                                    Start Date:
                                  </div>
                                  <div className="col-sm-6 col-12">
                                    {taskDetails?.startDate || "N/A"}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-sm-6 col-12 txt_Blue">
                                    End Date:
                                  </div>
                                  <div className="col-sm-6 col-12">
                                    {taskDetails?.endDate || "N/A"}
                                  </div>
                                </div>
                                {/* <div className="row">
                                                        <div className="col-sm-6 col-12 txt_Blue">Task Name :</div>
                                                        <div className="col-sm-6 col-12">{taskDetails?.taskName || "N/A"}</div>
                                                      </div> */}
                                <div className="row">
                                  <div className="col-sm-6 col-12 txt_Blue">
                                    Actual Effort:
                                  </div>
                                  <div className="col-sm-6 col-12">
                                    {taskDetails?.actualWork || "N/A"}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-sm-6 col-12 txt_Blue">
                                    Planned Efforts:
                                  </div>
                                  <div className="col-sm-6 col-12">
                                    {taskDetails?.plannedEfforts || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </Callout>
                          )}
                        </div>
                      </div>

                      {/* Sub Task */}
                      {/* <div className="row mb-3">
                                        <label className="col-sm-4 text-end mt-2">Sub Task</label>
                                        <div className="col-sm-7">
                                          <select
                                            onChange={handleSubTaskChange}
                                            style={{
                                              width: "100%", // Ensures the select takes full width of its container
                                              padding: "8px 12px", // Adds some padding for better visual space
                                              fontSize: "12px", // Adjusts font size for readability
                                              borderRadius: "4px", // Adds rounded corners for a modern look
                                              border: "1px solid #ccc", // A soft border color
                                              boxSizing: "border-box" // Makes sure padding doesn't affect the overall width
                                            }}
                                          >
                                            <option value="">Select Subtask</option>
                                            {subTasks.map((subTask) => (
                                              <option key={subTask.subTaskTypeID} value={subTask.subTaskTypeID}>
                                                {subTask.subTaskType}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div> */}

                      {/* From Time */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-start mt-2">
                          From Time
                        </label>
                        <div className="col-sm-7 d-flex">
                          <select
                            disabled
                            className="form-control w-50 mb-2"
                            // value={selectedHour || start?.hour} // Default to start.hour if selectedHour is not set
                            value={selectedHour || "aa"} // Default to start.hour if selectedHour is not set
                            onChange={(e) => setSelectedHour(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 15px",
                              fontSize: "15px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                            }}
                          >
                            <option>Hour</option>
                            {hours.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <label className="px-2">Hr</label>
                          <select
                            disabled
                            className="form-control w-50"
                            value={selectedMinute || "aa"} // Default to start.minute if selectedMinute is not set
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 12px",
                              fontSize: "15px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                            }}
                          >
                            <option>Minute</option>
                            {minutes.map((minute) => (
                              <option key={minute} value={minute}>
                                {minute}
                              </option>
                            ))}
                          </select>
                          <label className="px-2">Min</label>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-4 text-start mt-2">
                          To Time
                        </label>
                        <div className="col-sm-7 d-flex">
                          <select
                            disabled
                            className="form-control w-50"
                            value={selectedHourT || "aa"} // Default to end.hour if selectedHourT is not set
                            onChange={(e) => setSelectedHourT(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 12px",
                              fontSize: "16px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                            }}
                          >
                            <option>Hour</option>
                            {hours.map((hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                          <label className="px-2">Hr</label>
                          <select
                            disabled
                            className="form-control w-50"
                            value={selectedMinuteT || "aa"} // Default to end.minute if selectedMinuteT is not set
                            onChange={(e) => setSelectedMinuteT(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 12px",
                              fontSize: "15px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                            }}
                          >
                            <option>Minute</option>
                            {minutes.map((minute) => (
                              <option key={minute} value={minute}>
                                {minute}
                              </option>
                            ))}
                          </select>
                          <label className="px-2">Min</label>
                        </div>
                      </div>

                      {/* DA Type */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-start  mt-2">
                          DA Type
                        </label>
                        <div className="col-sm-7">
                          <select
                            style={{
                              width: "100%", // Ensures the select takes full width of its container
                              padding: "8px 12px", // Adds some padding for better visual space
                              fontSize: "12px", // Adjusts font size for readability
                              borderRadius: "4px", // Adds rounded corners for a modern look
                              border: "1px solid #ccc", // A soft border color
                              boxSizing: "border-box", // Makes sure padding doesn't affect the overall width
                            }}
                            value={selecteddaTypes}
                            onChange={(e) => setSelecteddaTypes(e.target.value)}
                          >
                            {/* <option value="">Select DA Type</option> */}
                            {daTypes?.map((daType) => (
                              <option key={daType.id} value={daType.id}>
                                {daType.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Efforts */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-start required mt-2">
                          Efforts
                        </label>
                        <div className="col-sm-3 col-4">
                          <input
                            type="text"
                            className="form-control text-center"
                            value={efforts}
                            onChange={handleEffortsChange}
                            placeholder="HH:MM"
                            rows="3"
                            style={{ height: "150%" }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-start  mt-2">
                          Description
                        </label>
                        <div
                          className="col-sm-7 pb-3 "
                          style={{ marginBottom: "27%" }}
                        >
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Enter Description"
                            maxLength="255"
                            value={description}
                            onChange={handleDescriptionChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewTaskEntry;
