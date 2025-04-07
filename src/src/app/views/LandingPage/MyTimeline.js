import React, { useState, useEffect } from "react";
import { Stack, Text } from "@fluentui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./MyTimeline.css";

import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Carousel from "react-bootstrap/Carousel";
import image1 from "../../../assets/latest/img/Slider_Images/congrats-congratulations.gif";
import image2 from "../../../assets/latest/img/Slider_Images/angry-emoji.gif";
import image3 from "../../../assets/latest/img/Slider_Images/partially_filled1.gif";
import { FaCalendarCheck } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Tooltip1 from "@mui/material/Tooltip";

const getColorCode = (timelineEntry) => {
  // if (timelineEntry.isRed) return "#f8d7da";
  if (timelineEntry.isGreen) return "#77e0b6";
  if (timelineEntry.isHoilday) return "#d8e429";
  return null;
};

const tileContent = ({ date, view }, highlightedDates) => {
  if (view === "month") {
    const matchingDate = highlightedDates?.find(
      (d) =>
        d.date.getDate() === date.getDate() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getFullYear() === date.getFullYear()
    );
    if (matchingDate) {
      return (
        <div className="highlighted-date">
          <div
            className="circle"
            style={{
              backgroundColor: matchingDate.color,
            }}
          >
            {date.getDate()}
          </div>
        </div>
      );
    }
  }
  return null;
};

const tileClassName = ({ date, view }, highlightedDates) => {
  if (view === "month") {
    const matchingDate = highlightedDates?.find(
      (d) =>
        d.date.getDate() === date.getDate() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getFullYear() === date.getFullYear()
    );
    if (matchingDate) {
      return "highlighted-date";
    }
  }
  return null;
};

const MyTimeline = ({
  mTimeline,
  prevMonth,
  prevYear,
  setPrevMonth,
  setPrevYear,
  refrsh,
  setRefresh,
}) => {
  const [date, setDate] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [timesheetData, setTimesheetData] = useState(null);
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const [projects, setProjects] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedprojects, setSelectedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  // Set default selected hour and minute from timesheet data
  const [selectedHour, setSelectedHour] = useState(
    timesheetData?.startHrh || "00"
  );
  const [selectedMinute, setSelectedMinute] = useState(
    timesheetData?.startMin || "00"
  );
  const [selectedHourT, setSelectedHourT] = useState(
    timesheetData?.toHrh || "00"
  );
  const [selecteddaTypes, setSelecteddaTypes] = useState(
    timesheetData?.toHrh || "N"
  );
  const [selectedMinuteT, setSelectedMinuteT] = useState(
    timesheetData?.toMin || "00"
  );
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [selectedsubTasks, setSelectedSubTasks] = useState([]);
  const [daTypes, setDATypes] = useState([]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user?.data?.employeeId;
  const token = sessionStorage.getItem("token");
  const [efforts, setEfforts] = useState("00:00");
  const [description, setDescription] = useState("");

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
  useEffect(() => {
    setSelectedHour(timesheetData?.startHrh);
    setSelectedMinute(timesheetData?.startMin);
    setSelectedHourT(timesheetData?.endHrh);
    setSelecteddaTypes("N");
    setSelectedMinuteT(timesheetData?.endMin);
  }, [timesheetData]);

  // Handle Description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
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
  const handleTaskChange = (event) => {
    const taskId = event.target.value;
    setSelectedTask(taskId);
    fetchSubTasks(taskId); // Fetch subtasks based on the selected task
  };
  const handleSubTaskChange = (event) => {
    const taskId = event.target.value;
    setSelectedSubTasks(taskId);
    fetchSubTasks(taskId); // Fetch subtasks based on the selected task
  };
  useEffect(() => {}, [mTimeline]);
  console.log("MyTimeline", mTimeline);
  const highlightedDates = mTimeline
    ?.map((entry) => {
      const color = getColorCode(entry);
      if (color) {
        return {
          date: new Date(
            entry.year,
            new Date(Date.parse(entry.monthName + " 1, 2021")).getMonth(),
            entry.day
          ),
          color,
          initiativeTitle: entry.initiativeTitle,
        };
      }
      return null;
    })
    .filter(Boolean);

  const handleDateChange = (newDate) => {
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();

    if (newMonth !== prevMonth || newYear !== prevYear) {
      setPrevMonth(newMonth);
      setPrevYear(newYear);
    }

    const matchingDate = highlightedDates?.find(
      (d) =>
        d.date.getDate() === newDate.getDate() &&
        d.date.getMonth() === newDate.getMonth() &&
        d.date.getFullYear() === newDate.getFullYear()
    );
    setSelectedEntry(matchingDate);
    setDate(newDate);
    fetchTimesheetData(newDate); // Fetch timesheet data on date selection
    setDrawerOpen(true);
  };
  const fetchTimesheetData = async (selectedDate) => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetails`,
        {
          params: { Day: day, Month: month, Year: year, UserID: UserID },
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setTimesheetData(response.data.data.listTimesheetDADetails[0]);
      console.log("first", response.data.data.listTimesheetDADetails);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
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
  const handleChange = (e) => {
    setSelectedProject(e.target.value);
    const pId = e.target.value;
    fetchTasks(pId);
  };
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    const newMonth = activeStartDate.getMonth();
    const newYear = activeStartDate.getFullYear();

    if (newMonth !== prevMonth || newYear !== prevYear) {
      console.log(`Month changed to: ${newMonth + 1}`);
      console.log(`Year changed to: ${newYear}`);
      setPrevMonth(newMonth);
      setPrevYear(newYear);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedTask("");
    setSelectedProject("");
    setSelecteddaTypes("N");
    setEfforts("00:00");
    setDescription("");
    setDrawerOpen(false);
    setSelectedEntry(null);
  };
  const handleSave = async () => {
    const hhmmRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/; // Regex for hh:mm format (24-hour)

    if (!hhmmRegex.test(efforts)) {
      toast.error("Please enter Efforts in HH:MM format");
      return;
    }
    const entryData = {
      entryDate: new Date(
        new Date(timesheetData?.daDate).setDate(
          new Date(timesheetData?.daDate).getDate() + 1
        )
      ).toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description,
    };

    const entryData1 = {
      entryDate: new Date(
        new Date(timesheetData?.daDate).setDate(
          new Date(timesheetData?.daDate).getDate() + 1
        )
      ).toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description,
      TotalDuration: timesheetData?.actualDA,
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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              body: JSON.stringify(entryData), // Send the entryData to post
            }
          );

          const postResult = await postResponse.json();
          setRefresh(!refrsh);
          // Check for the response validation message after posting the entry
          if (postResult?.data?.[0]?.validationMessage === "Success") {
            toast.success("Timesheet Entry saved successfully");
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
          setRefresh(!refrsh);
          const postResult = await postResponse.json();

          if (postResult?.data?.[0]?.validationMessage === "Success") {
            toast.success("Timesheet Entry saved successfully");
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
  console.log("projects11", projects);
  return (
    <Stack
      styles={{
        root: {
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          flex: 1,
          maxWidth: "100%",
          boxSizing: "border-box",
          "@media (max-width: 768px)": {
            padding: "12px",
          },
        },
      }}
    >
      <Text
        variant="medium"
        styles={{ root: { fontWeight: "bold", marginBottom: "16px" } }}
      >
        My Timeline
      </Text>
      <Stack>
        <div className="legend text-end">
          <ul className="d-flex list-unstyled justify-content-end">
            <li>
              <label className="mx-1">Legends :</label>
            </li>
            <li className="pt-1">
              <Tooltip1 title="Reported Efforts">
                <span
                  className="lgdHoliday"
                  data-bs-toggle="tooltip"
                  data-bs-container="body"
                  aria-label="Holiday"
                  data-bs-original-title="Holiday"
                ></span>
              </Tooltip1>
            </li>
            <li className="pt-1">
              <Tooltip1 title="Holiday">
                <span
                  className="lgdPlannedday"
                  data-bs-toggle="tooltip"
                  data-bs-container="body"
                  aria-label="Today"
                  data-bs-original-title="Today"
                ></span>
              </Tooltip1>
            </li>
          </ul>
        </div>

        <div style={{ width: "100%", height: "auto" }}>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 20 }}
            styles={{
              root: {
                marginBottom: "16px",
                "@media (max-width: 768px)": {
                  flexDirection: "column",
                  childrenGap: 10,
                },
              },
            }}
          >
            <Calendar
              onChange={handleDateChange}
              value={date}
              tileContent={(props) => tileContent(props, highlightedDates)}
              tileClassName={(props) => tileClassName(props, highlightedDates)}
              onActiveStartDateChange={handleActiveStartDateChange}
              style={{
                width: "100%",
                "@media (max-width: 768px)": {
                  width: "100%",
                },
              }}
            />
          </Stack>
        </div>
      </Stack>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden", // Prevent scrolling on the drawer itself
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            p: 3,
          }}
        >
          {/* Drawer Header */}
          <div className="offcanvas-body" style={{ overflow: "hidden" }}>
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
                scrollbarWidth: "none", // Hides scrollbar for Firefox
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

                      margin: "20px 0",
                    }}
                  >
                    Overall Effort of the Day - {timesheetData?.actualDA}/
                    {timesheetData?.expectedDA}
                  </div>
                  <div className="calendarDate ps-3">
                    <FaCalendarCheck className="pe-1" />
                    {timesheetData?.daDate}
                    <span className="ps-3">{timesheetData?.daMonth}</span>
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
                      <label className="col-sm-4 text-end required mt-2">
                        Project
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
                          value={selectedProject}
                          onChange={handleChange}
                        >
                          <option>Select Project</option>
                          {Array.isArray(projects) && projects.length > 0 ? (
                            projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}{" "}
                                {/* Displaying the project name */}
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
                      <label className="col-sm-4 text-end required mt-2">
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
                        <div
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
                        </div>

                        {/* Task details Tooltip */}
                        {isHovered && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              left: "100%", // Position the details box next to the icon
                              padding: "10px",
                              backgroundColor: "white",
                              border: "1px solid #ccc",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              zIndex: "10",
                              width: "250px", // Adjust width as necessary
                              marginLeft: "10px", // Adds space between icon and tooltip
                            }}
                          >
                            <div className="row">
                              <div className="col-sm-6 text-end txt_Blue">
                                Start Date:
                              </div>
                              <div className="col-sm-6">
                                {taskDetails?.startDate || "N/A"}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6 text-end txt_Blue">
                                End Date:
                              </div>
                              <div className="col-sm-6">
                                {taskDetails?.endDate || "N/A"}
                              </div>
                            </div>
                            {/* <div className="row">
                              <div className="col-sm-6 text-end txt_Blue">Task Name :</div>
                              <div className="col-sm-6">{taskDetails?.taskName || "N/A"}</div>
                            </div> */}
                            <div className="row">
                              <div className="col-sm-6 text-end txt_Blue">
                                Actual Effort:
                              </div>
                              <div className="col-sm-6">
                                {taskDetails?.actualWork || "N/A"}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6 text-end txt_Blue">
                                Planned Efforts:
                              </div>
                              <div className="col-sm-6">
                                {taskDetails?.plannedEfforts || "N/A"}
                              </div>
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
                      <label className="col-sm-4 text-end  mt-2">
                        From Time
                      </label>
                      <div className="col-sm-7 d-flex">
                        <select
                          disabled
                          className="form-control w-50 mb-2"
                          value={selectedHour}
                          onChange={(e) => setSelectedHour(e.target.value)}
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
                          value={selectedMinute}
                          onChange={(e) => setSelectedMinute(e.target.value)}
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
                      <label className="col-sm-4 text-end mt-2">To Time</label>
                      <div className="col-sm-7 d-flex">
                        <select
                          disabled
                          className="form-control w-50"
                          value={selectedHourT}
                          onChange={(e) => setSelectedHourT(e.target.value)}
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
                          value={selectedMinuteT}
                          onChange={(e) => setSelectedMinuteT(e.target.value)}
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
                      <label className="col-sm-4 text-end mt-2">DA Type</label>
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
                      <label className="col-sm-4 text-end required mt-2">
                        Efforts
                      </label>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control text-center"
                          value={efforts}
                          onChange={handleEffortsChange}
                          placeholder="00:00"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="row mb-3">
                      <label className="col-sm-4 text-end mt-2">
                        Description
                      </label>
                      <div className="col-sm-7">
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

                  <div className="col-sm-5 d-flex align-items-center">
                    <Carousel>
                      {timesheetData?.isDAFullyFilled === true && (
                        <Carousel.Item>
                          <div
                            className="card text-center"
                            style={{ border: "none" }}
                          >
                            <img
                              src={image1}
                              alt="Description for image 1"
                              style={{
                                maxWidth: "100px",
                                height: "100px",
                                margin: "0 auto",
                              }} // Center the image
                            />
                            <div className="card-body">
                              <span
                                style={{
                                  fontSize: "10px",
                                  wordBreak: "break-all",
                                }}
                              >
                                Congratulations!! You've successfully filled
                                your timesheet.
                              </span>
                            </div>
                          </div>
                        </Carousel.Item>
                      )}

                      {timesheetData?.isDAParatially === true && (
                        <Carousel.Item>
                          <div
                            className="card text-center"
                            style={{ border: "none" }}
                          >
                            <img
                              src={image3}
                              alt="Description for image 3"
                              style={{
                                maxWidth: "100px",
                                height: "100px",
                                margin: "0 auto",
                              }} // Center the image
                            />
                            <div className="card-body">
                              <span
                                style={{
                                  fontSize: "9px",
                                  wordBreak: "break-all",
                                }}
                              >
                                You have partially filled the timesheet. Please
                                update it accordingly
                              </span>
                            </div>
                          </div>
                        </Carousel.Item>
                      )}

                      {timesheetData?.isDANotFilled === true && (
                        <Carousel.Item>
                          <div
                            className="card text-center"
                            style={{ border: "none" }}
                          >
                            <img
                              src={image2}
                              alt="Description for image 3"
                              style={{
                                maxWidth: "100px",
                                height: "100px",
                                margin: "0 auto",
                              }} // Center the image
                            />
                            <div className="card-body">
                              <span
                                style={{
                                  fontSize: "10px",
                                  wordBreak: "break-all",
                                }}
                              >
                                Your entered timesheet effort is zero. Please
                                update your effort.
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
    </Stack>
  );
};

export default MyTimeline;
