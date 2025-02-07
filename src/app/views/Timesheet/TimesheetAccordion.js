import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Import the Calendar component
import "react-calendar/dist/Calendar.css"; // Import styles for the Calendar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const TimesheetAccordion = ({
  start,
  end,
  showAccordion,
  toggleAccordion,
  setDate,
  date,
  topdata,
  date1,
  newdate
}) => {
  const [selectedProject, setSelectedProject] = useState("");
  // Set default selected hour and minute from timesheet data
  const [timesheetData, setTimesheetData] = useState(null);

  const [projects, setProjects] = useState([]);
  console.log("Timesheet Status", date1);
  const [selectedHour, setSelectedHour] = useState(timesheetData?.startHrh || "00");
  const [selectedMinute, setSelectedMinute] = useState(timesheetData?.startMin || "00");
  const [selectedHourT, setSelectedHourT] = useState(timesheetData?.toHrh || "00");
  const [selecteddaTypes, setSelecteddaTypes] = useState("N");
  const [selectedMinuteT, setSelectedMinuteT] = useState(timesheetData?.toMin || "00");
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [selectedsubTasks, setSelectedSubTasks] = useState([]);
  const [daTypes, setDATypes] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const [searchTerm, setSearchTerm] = useState(""); // State to manage the search input
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth()); // State to manage selected month
  const [selectedYear, setSelectedYear] = useState(date.getFullYear()); // State to manage selected year
  const [selectedTask, setSelectedTask] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user.data.employeeId;
  const token = sessionStorage.getItem("token");
  const [efforts, setEfforts] = useState("00:00");
  const [description, setDescription] = useState("");

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
  const handleChange = (e) => {
    setSelectedProject(e.target.value);
    const pId = e.target.value;
    fetchTasks(pId);
  };
  const handleDateChange = (newDate) => {
    console.log("handleDateChange", newDate);
    setDate(newDate); // Update the selected date
    setSelectedMonth(newDate.getMonth()); // Update the month based on selected date
    setSelectedYear(newDate.getFullYear()); // Update the year based on selected date
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
    // Update date to reflect the new month
    setDate(new Date(selectedYear, month, 1));
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
    // Update date to reflect the new year
    setDate(new Date(year, selectedMonth, 1));
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => (
    <option key={i} value={i}>
      {new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(0, i))}
    </option>
  ));

  // Generate year options (for example, 2020 to 2030)
  const yearOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={i} value={2020 + i}>
      {2020 + i}
    </option>
  ));

  const handleSave = async () => {
    const hhmmRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/; // Regex for hh:mm format (24-hour)

    if (!hhmmRegex.test(efforts)) {
      toast.error("Please enter Efforts in HH:MM format");
      return;
    }
    console.log("ValidateDAEntry", date);
    const entryData = {
      entryDate: new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      // subTaskID: selectedsubTasks,
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description
    };

    const entryData1 = {
      entryDate: new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString(),
      userID: userid,
      projectID: Number(selectedProject),
      taskID: Number(selectedTask),
      // subTaskID: selectedsubTasks,
      fromTime: `${selectedHour}:${selectedMinute}`,
      toTime: `${selectedHourT}:${selectedMinuteT}`,
      daType: selecteddaTypes,
      duration: efforts,
      description: description,
      TotalDuration: topdata.weekActualHours
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
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              },
              body: JSON.stringify(entryData) // Send the entryData to post
            }
          );

          const postResult = await postResponse.json();

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

  return (
    <div className="accordion WF_TopAccordianPanel my-3" id="AddDtlsAcc">
      <div className="accordion-item mb-2">
        <div className="accordion-header">
          <div className="row">
            <div className="col-sm-12">
              <button
                className="accordion-button collapsed d-flex mt-4"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#CalendarDtlsTab"
                aria-expanded={showAccordion}
              >
                <div className="row flex-1" onClick={toggleAccordion}>
                  {/* Timesheet Entry and Week Period in the Same Line */}
                  <div className="col-sm-4 d-flex align-items-center">
                    <h5 className="mb-0 me-3 d-flex align-items-center text-nowrap">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="addIcn pe-2"
                        style={{ fontSize: "20px" }}
                      />
                      Timesheet Entry
                    </h5>
                    <div className="ps-3 text-nowrap">
                      <span className="fw-500">Week Period -</span> {topdata.weekStartDate} to{" "}
                      {topdata.weekEndDate}
                    </div>
                  </div>

                  {/* Week Total */}
                  <div className="col-sm-5">
                    <div className="text_red text-end">
                      Week Total | Expected Hours -
                      <span className="fw-500">
                        {" "}
                        <i className="fa-regular fa-clock" /> {topdata.weekActualHours} |{" "}
                        {topdata.weekExpectedHours}
                      </span>
                    </div>
                  </div>

                  {/* Timesheet Status */}
                  <div className="col-sm-3 pe-4">
                    <div className="text-end">
                      Timesheet Status -
                      <span
                        className="txt_Blue fw-500"
                        onClick={toggleAccordion}
                        style={{ cursor: "pointer" }}
                      >
                        {topdata.timesheetStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Accordion content */}
        <div
          id="CalendarDtlsTab"
          className={`accordion-collapse collapse ${showAccordion ? "show" : ""}`}
        >
          <div className="accordion-body">
            <div className="calendarContent">
              <div className="row">
                <div className="col-sm-7">
                  {/* Monthly Calendar Start */}
                  <div className="mb-3">
                    <div className="mb-3 d-flex align-items-center">
                      <div className="me-3">
                        <label htmlFor="monthSelect" className="form-label">
                          Month
                        </label>
                        <select
                          id="monthSelect"
                          className="form-select form-control-lg" // Apply consistent size using Bootstrap's form-select and form-control-lg classes
                          value={selectedMonth}
                          onChange={handleMonthChange}
                        >
                          <option value="" disabled selected>
                            Select Month
                          </option>
                          {monthOptions}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="yearSelect" className="form-label">
                          Year
                        </label>
                        <select
                          id="yearSelect"
                          className="form-select form-control-lg" // Same size applied here
                          value={selectedYear}
                          onChange={handleYearChange}
                        >
                          <option value="" disabled selected>
                            Select Year
                          </option>
                          {yearOptions}
                        </select>
                      </div>
                    </div>

                    <Calendar
                      onChange={handleDateChange}
                      value={date}
                      view="month"
                      tileClassName="no-tooltip"
                      className="mt-3 w-100" // Keep full width
                      style={{ maxWidth: "100%", height: "90vh", overflow: "hidden" }} // Increase height to 80% of the viewport height
                    />
                  </div>
                  {/* Monthly Calendar End */}
                </div>
                <div className="col-sm-5">
                  <div className="row">
                    <div className="row mb-3 justify-content-end">
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
                    </div>

                    <div className="col-sm-12">
                      {/* Project */}
                      <div className="row mb-3">
                        <label className="col-sm-4 text-end required mt-2">Project</label>
                        <div className="col-sm-7">
                          <select
                            value={selectedProject}
                            onChange={handleChange}
                            style={{
                              width: "100%", // Ensures the select takes full width of its container
                              padding: "8px 12px", // Adds some padding for better visual space
                              fontSize: "12px", // Adjusts font size for readability
                              borderRadius: "4px", // Adds rounded corners for a modern look
                              border: "1px solid #ccc", // A soft border color
                              boxSizing: "border-box" // Makes sure padding doesn't affect the overall width
                            }}
                          >
                            <option>Select Project</option>
                            {Array.isArray(projects) && projects.length > 0 ? (
                              projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.name} {/* Displaying the project name */}
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
                        <label className="col-sm-4 text-end required mt-2">Task</label>
                        <div className="col-sm-7" style={{ position: "relative" }}>
                          <select
                            onChange={handleTaskChange}
                            value={selectedTask}
                            style={{
                              width: "100%", // Ensures the select takes full width of its container
                              padding: "8px 12px", // Adds some padding for better visual space
                              fontSize: "12px", // Adjusts font size for readability
                              borderRadius: "4px", // Adds rounded corners for a modern look
                              border: "1px solid #ccc", // A soft border color
                              boxSizing: "border-box" // Makes sure padding doesn't affect the overall width
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
                              cursor: "pointer"
                            }}
                            onMouseEnter={() => handleTaskHover(selectedTask)}
                            onMouseLeave={() => setIsHovered(false)}
                          >
                            {selectedTask && (
                              <FaInfoCircle style={{ fontSize: "15px", color: "#007bff" }} />
                            )}
                          </div>

                          {/* Task details Tooltip */}
                          {isHovered && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%", // Position the details box below the icon
                                left: "-260px", // Move the details box to the left of the icon (adjust as needed)
                                padding: "10px",
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                zIndex: "10",
                                width: "250px", // Adjust width as necessary
                                marginTop: "10px" // Adds space between the icon and the tooltip
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
                              <div className="row">
                                <div className="col-sm-6 text-end txt_Blue">Task Name :</div>
                                <div className="col-sm-6">{taskDetails?.taskName || "N/A"}</div>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 text-end txt_Blue">Actual Effort:</div>
                                <div className="col-sm-6">{taskDetails?.actualWork || "N/A"}</div>
                              </div>
                              <div className="row">
                                <div className="col-sm-6 text-end txt_Blue">Planned Efforts:</div>
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
                        <label className="col-sm-4 text-end mt-2">From Time</label>
                        <div className="col-sm-7 d-flex">
                          <select
                            disabled
                            className="form-control w-50 mb-2"
                            value={selectedHour || start?.hour} // Default to start.hour if selectedHour is not set
                            onChange={(e) => setSelectedHour(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 15px",
                              fontSize: "15px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box"
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
                            value={selectedMinute || start?.minute} // Default to start.minute if selectedMinute is not set
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 12px",
                              fontSize: "15px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box"
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
                        <label className="col-sm-4 text-end mt-2">To Time</label>
                        <div className="col-sm-7 d-flex">
                          <select
                            disabled
                            className="form-control w-50"
                            value={selectedHourT || end?.hour} // Default to end.hour if selectedHourT is not set
                            onChange={(e) => setSelectedHourT(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 12px",
                              fontSize: "16px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box"
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
                            value={selectedMinuteT || end?.minute} // Default to end.minute if selectedMinuteT is not set
                            onChange={(e) => setSelectedMinuteT(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "2px 12px",
                              fontSize: "15px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box"
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
      </div>
    </div>
  );
};

export default TimesheetAccordion;
