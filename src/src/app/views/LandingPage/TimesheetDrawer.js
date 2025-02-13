import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { FaCalendarCheck } from "react-icons/fa";
import { Carousel } from "react-bootstrap";
import image1 from "../../../assets/latest/img/Slider_Images/congrats-congratulations.gif";
import image2 from "../../../assets/latest/img/Slider_Images/angry-emoji.gif";
import image3 from "../../../assets/latest/img/Slider_Images/partially_filled1.gif";
import { FaInfoCircle } from "react-icons/fa";
import Tooltip1 from "@mui/material/Tooltip";
import { ToastContainer, toast } from "react-toastify";

const TimesheetDrawer = ({ drawerOpen, handleCloseDrawer, id, refrsh, setRefresh }) => {
  const [timesheetData, setTimesheetData] = useState({
    actualDA: 5,
    expectedDA: 8,
    daDate: "2024-11-12",
    daMonth: "November",
    isDAParatially: true,
    isDAFullyFilled: false
  });
  console.log("timesheetData", id);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user?.data?.employeeId;
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProject1, setSelectedProject1] = useState("");
  const [selectedTask1, setSelectedTask1] = useState(id?.task?.taskID);
  const [selectedTask, setSelectedTask] = useState(id?.task?.taskID);
  const [selectedSubTask, setSelectedSubTask] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedHourT, setSelectedHourT] = useState("");
  const [selectedMinuteT, setSelectedMinuteT] = useState("");
  const [selectedsubTasks, setSelectedSubTasks] = useState([]);
  const [efforts, setEfforts] = useState("00:00");
  const [selecteddaTypes, setSelecteddaTypes] = useState(timesheetData?.toHrh || "N");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const hours = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const minutes = ["00", "15", "30", "45"];
  const token = sessionStorage.getItem("token");
  const [isHovered, setIsHovered] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [daTypes, setDATypes] = useState([]);
  const [daDetails, setDADetails] = useState(null);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
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

    const fetchDADetails = async () => {
      console.log("fetchDADetails", id);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetCurrentTaskDADetails?TaskID=${id?.id}&UserID=${userid}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
          }
        );
        const data = await response.json();
        setDADetails(data.data.listCurrentTaskDADetails[0]);
        console.log("DA Details:", data);
      } catch (error) {
        console.error("Error fetching DA details:", error);
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

    if (drawerOpen) {
      fetchDADetails();
      fetchProjectDetails();

      fetchDATypes();
    }
  }, [drawerOpen]);
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
  const handleTaskChange = (event) => {
    const taskId = event.target.value;
    setSelectedTask(taskId);
    fetchSubTasks(taskId); // Fetch subtasks based on the selected task
  };
  const handleTaskHover = (taskId) => {
    fetchTaskDetails(taskId);
    setIsHovered(true);
  };
  const handleSubTaskChange = (event) => {
    const taskId = event.target.value;
    setSelectedSubTasks(taskId);
  };

  const handleChange = (e) => {
    setSelectedProject(e.target.value);
    const pId = e.target.value;
    fetchTasks(pId);
  };
  useEffect(() => {
    fetchTasks(selectedProject);
  }, [selectedProject]);

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
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleSave = async () => {
    const hhmmRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/; // Regex for hh:mm format (24-hour)

    if (!hhmmRegex.test(efforts)) {
      toast.error("Please enter Efforts in HH:MM format");
      return;
    }
    const entryData = {
      entryDate: new Date().toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description
    };

    const entryData1 = {
      entryDate: new Date().toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description,
      TotalDuration: daDetails?.actualDA
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify(entryData1) // Send the entryData in JSON body
        }
      );

      const validationResult = await validateResponse.json();
      console.log("validationResult", validationResult);

      // Check if validation message is success or not
      const validationErrors = validationResult?.data
        ?.filter((item) => item.validationMessage) // Extract items with validation messages
        .map((item) => item.validationMessage) // Extract the validation messages
        .join(", "); // Combine multiple messages into a single string

      // If validation is successful, check the type value
      if (validationErrors === "Success") {
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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              },
              body: JSON.stringify(entryData) // Send the entryData to post
            }
          );

          const postResult = await postResponse.json();
          setRefresh(!refrsh);
          // Check for the response validation message after posting the entry
          if (postResult?.data?.[0]?.validationMessage === "Success") {
            toast.success("Timesheet Entry saved successfully");
          } else {
            const postValidationErrors = postResult?.data
              ?.filter((item) => !item.validationMessage || item.validationMessage.trim() === "") // Check for null or empty validationMessage
              .map((item) => "Please fill Daily Activity")
              .concat(
                postResult?.data
                  ?.filter((item) => item.validationMessage && item.validationMessage.trim() !== "") // Include non-empty validation messages
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
                cursor: "pointer"
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
                cursor: "pointer"
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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              },
              body: JSON.stringify(entryData) // Send the entryData to post
            }
          );
          setRefresh(!refrsh);
          const postResult = await postResponse.json();

          if (postResult?.data?.[0]?.validationMessage === "Success") {
            toast.success("Timesheet Entry saved successfully");
          } else {
            const postValidationErrors = postResult?.data
              ?.filter((item) => !item.validationMessage || item.validationMessage.trim() === "") // Check for null or empty validationMessage
              .map((item) => "Please fill Daily Activity")
              .concat(
                postResult?.data
                  ?.filter((item) => item.validationMessage && item.validationMessage.trim() !== "") // Include non-empty validation messages
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

  useEffect(() => {
    setSelectedProject(daDetails?.projectID);
    setSelectedProject1(daDetails?.projectName);
    setSelectedHour(daDetails?.startHrh);
    setSelectedMinute(daDetails?.startMin);
    setSelectedHourT(daDetails?.endHrh);
    setSelectedTask1(daDetails?.taskName);
    setSelectedTask(daDetails?.taskID);
    setSelectedMinuteT(daDetails?.endMin);
    fetchTasks(daDetails?.projectID);
  }, [daDetails]);
  const handleCloseDrawer1 = () => {
    setSelectedTask("");
    setSelectedProject("");
    setSelecteddaTypes("N");
    setEfforts("00:00");
    setDescription("");
    handleCloseDrawer();
  };
  console.log("projectName", daDetails);
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleCloseDrawer1}
      sx={{ width: "70vw", flexShrink: 0 }}
      PaperProps={{
        sx: {
          width: "70vw",
          overflow: "hidden" // Hide vertical and horizontal scrollbars
        }
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh", // Ensure the Box takes the full viewport height
          overflow: "hidden", // Prevent unwanted scrolling
          display: "flex",
          flexDirection: "column", // Stack content vertically
          p: 0 // Remove padding
        }}
      >
        {/* Drawer Header */}
        <div
          className="offcanvas-body"
          style={{
            overflow: "auto", // Enable scrolling for overflow content
            height: "calc(100vh - 50px)", // Subtract header height to fit the viewport
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div className="graybg container-fluid py-1 mb-2">
            <div className="row">
              <div className="col-sm-6">
                <h5 className="pgtitle mb-0">Timesheet Entry</h5>
              </div>
              <div className="col-sm-6 text-end">
                <Tooltip1 title="Close">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseDrawer}
                    aria-label="Close"
                  ></button>
                </Tooltip1>
              </div>
            </div>
          </div>
          <div
            className="TS_DetailsSec"
            style={{
              flex: 1,
              overflowY: "scroll",
              msOverflowStyle: "none", // Hides scrollbar for IE/Edge
              scrollbarWidth: "none" // Hides scrollbar for Firefox
            }}
          >
            {/* Add custom styles for WebKit browsers */}
            <style>
              {`
            .TS_DetailsSec::-webkit-scrollbar {
              display: none; /* Hides scrollbar for Chrome, Safari, and Opera */
            }
          `}
            </style>

            <div className="row mb-2">
              <div className="col-sm-6">
                <div
                  style={{
                    textAlign: "center",
                    color: "#ed1c24",
                    fontSize: "15px",

                    margin: "20px 0"
                  }}
                >
                  Overall Effort of the Day - {daDetails?.overAllDayEfforts}/{daDetails?.expectedDA}
                </div>
                <div className="calendarDate ps-3">
                  <FaCalendarCheck className="pe-1" />
                  {daDetails?.daDate !== null ? daDetails?.daDate : "N/A"}

                  <span className="ps-3">{daDetails?.daMonth}</span>
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

            <div className="timesheetFields py-3">
              <div className="row">
                <div className="col-sm-7">
                  {/* Project */}
                  <div className="row mb-3">
                    <label className="col-sm-4 text-end required mt-2">Project</label>
                    <div className="col-sm-7">
                      <div
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          backgroundColor: "#f8f9fa" // Light gray background to mimic a disabled look
                        }}
                      >
                        {selectedProject1}
                      </div>
                    </div>
                  </div>

                  {/* Task */}
                  <div className="row mb-3">
                    <label className="col-sm-4 text-end required mt-2">Task</label>
                    <div className="col-sm-7" style={{ position: "relative" }}>
                      <div
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          backgroundColor: "#f8f9fa" // Light gray background to mimic a disabled look
                        }}
                      >
                        {selectedTask1}
                      </div>

                      {/* Info Icon with Tooltip */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          cursor: "pointer"
                        }}
                        onMouseEnter={() => handleTaskHover(selectedTask)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <FaInfoCircle style={{ fontSize: "15px", color: "#007bff" }} />
                      </div>

                      {/* Task details Tooltip */}
                      {isHovered && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "100%",
                            padding: "10px",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            zIndex: "10",
                            width: "250px",
                            marginLeft: "10px"
                          }}
                        >
                          <div className="row">
                            <div className="col-sm-6 text-end txt_Blue">Start Date:</div>
                            <div className="col-sm-6">{taskDetails?.startDate || "N/A"}</div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 text-end txt_Blue">End Date:</div>
                            <div className="col-sm-6">{taskDetails?.endDate || "N/A"}</div>
                          </div>
                          {/* <div className="row">
                            <div className="col-sm-6 text-end txt_Blue">Task Name :</div>
                            <div className="col-sm-6">{taskDetails?.taskName || "N/A"}</div>
                          </div> */}
                          <div className="row">
                            <div className="col-sm-6 text-end txt_Blue">Actual Effort:</div>
                            <div className="col-sm-6">{taskDetails?.actualWork || "N/A"}</div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 text-end txt_Blue">Planned Efforts:</div>
                            <div className="col-sm-6">{taskDetails?.plannedEfforts || "N/A"}</div>
                          </div>
                        </div>
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
                          width: "300px", // Fixed width for Subtask dropdown
                          padding: "8px 12px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box"
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
                    <label className="col-sm-4 text-end  mt-2">From Time</label>
                    <div className="col-sm-7 d-flex">
                      <select
                        className="form-control w-50 mb-2"
                        value={daDetails?.startHrh}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        style={{ width: "150px" }}
                        disabled // Disables the dropdown
                      >
                        <option>{daDetails?.startHrh}</option>
                        {hours.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <label className="px-2">Hr</label>
                      <select
                        className="form-control w-50"
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        style={{ width: "150px" }}
                        disabled // Disables the dropdown
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

                  {/* To Time */}
                  <div className="row mb-3">
                    <label className="col-sm-4 text-end  mt-2">To Time</label>
                    <div className="col-sm-7 d-flex">
                      <select
                        className="form-control w-50"
                        value={daDetails?.endHrh}
                        onChange={(e) => setSelectedHourT(e.target.value)}
                        style={{ width: "150px" }}
                        disabled // Disables the dropdown
                      >
                        <option>{daDetails?.endHrh}</option>
                        {hours.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <label className="px-2">Hr</label>

                      <select
                        className="form-control w-50"
                        value={selectedMinuteT}
                        onChange={(e) => setSelectedMinuteT(e.target.value)}
                        style={{ width: "150px" }}
                        disabled // Disables the dropdown
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
                    <label className="col-sm-4 text-end  mt-2">DA Type</label>
                    <div className="col-sm-7">
                      <select
                        style={{
                          width: "100%", // Ensures the select takes full width of its container
                          padding: "8px 12px", // Adds some padding for better visual space
                          fontSize: "12px", // Adjusts font size for readability
                          borderRadius: "4px", // Adds rounded corners for a modern look
                          border: "1px solid #ccc", // A soft border color
                          boxSizing: "border-box" // Makes sure padding doesn't affect the overall width
                        }}
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
                    <label className="col-sm-4 text-end required mt-2">Efforts</label>
                    <div className="col-sm-3">
                      <input
                        type="text"
                        className="form-control text-center"
                        value={efforts}
                        onChange={handleEffortsChange}
                        placeholder="00:00"
                        style={{ width: "150px" }} // Fixed width for efforts input
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="row mb-3">
                    <label className="col-sm-4 text-end  mt-2">Description</label>
                    <div className="col-sm-7">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter Description"
                        maxLength="255"
                        value={description}
                        onChange={handleDescriptionChange}
                        style={{ width: "300px" }} // Fixed width for textarea
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="col-sm-5 d-flex align-items-center">
                  <Carousel>
                    {daDetails?.isDAFullyFilled === true && (
                      <Carousel.Item>
                        <div className="card text-center" style={{ border: "none" }}>
                          <img
                            src={image1}
                            alt="Description for image 1"
                            style={{ maxWidth: "100px", height: "100px", margin: "0 auto" }} // Center the image
                          />
                          <div className="card-body">
                            <span style={{ fontSize: "10px", wordBreak: "break-all" }}>
                              Congratulations!! You've successfully filled your timesheet.
                            </span>
                          </div>
                        </div>
                      </Carousel.Item>
                    )}

                    {daDetails?.isDAParatially === true && (
                      <Carousel.Item>
                        <div className="card text-center" style={{ border: "none" }}>
                          <img
                            src={image3}
                            alt="Description for image 3"
                            style={{ maxWidth: "100px", height: "100px", margin: "0 auto" }} // Center the image
                          />
                          <div className="card-body">
                            <span style={{ fontSize: "9px", wordBreak: "break-all" }}>
                              You have partially filled the timesheet. Please update it accordingly
                            </span>
                          </div>
                        </div>
                      </Carousel.Item>
                    )}

                    {daDetails?.isDANotFilled === true && (
                      <Carousel.Item>
                        <div className="card text-center" style={{ border: "none" }}>
                          <img
                            src={image2}
                            alt="Description for image 3"
                            style={{ maxWidth: "100px", height: "100px", margin: "0 auto" }} // Center the image
                          />
                          <div className="card-body">
                            <span style={{ fontSize: "10px", wordBreak: "break-all" }}>
                              Your entered timesheet effort is zero. Please update your effort.
                            </span>
                          </div>
                        </div>
                      </Carousel.Item>
                    )}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Drawer>
  );
};

export default TimesheetDrawer;
