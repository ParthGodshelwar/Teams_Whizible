import React, { useState, useEffect, useRef } from "react";
import { Tooltip, TextField } from "@mui/material";
import { Callout, DirectionalHint } from "@fluentui/react";
import { FaInfoCircle } from "react-icons/fa";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// import { Tooltip } from "react-bootstrap";
// import {  FaInfoCircle } from "react-icons/fa";
import { Modal, Tab, Nav, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faInfoCircle, faCogs } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaCalendar } from "react-icons/fa";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ProjectTaskMobile = ({
  topdata,
  setTopdata,
  selectedDate,
  setSelectedDate,
  timesheetData,
  setTimesheetData,
  previousEfforts,
  setPreviousEfforts,
  isFetchedPrevvalue,
  appliedFilters,
  setAppliedFilters,
  refresh,
  setRefresh,
  projects,
  setProjects,
  setDate1
}) => {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user.data.employeeId;
  const [date, setDate] = useState(new Date());
  const [lastToastTime, setLastToastTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [intermediateValues, setIntermediateValues] = useState({});
  const [refresh1, setRefresh1] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentDay, setCurrentDay] = useState("");
  const [taskid, setTaskid] = useState(null); // Tracks the current project ID
  const [showDaTypeModal, setShowDaTypeModal] = useState(false);
  const [daType, setDaType] = useState(); // Stores the selected DA type
  const [daTypes, setDATypes] = useState([]);
  const [description, setDescription] = useState(""); // Stores the textarea value
  const [currentTaskID, setCurrentTaskID] = useState(null); // Tracks current task for tooltip
  const [fetchedTaskDetails, setFetchedTaskDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [effortValues, setEffortValues] = useState({});
  // const [defulttasks, setDefaultTasks] = useState([]);
  const [tasks, setTasks] = useState([
    {
      project: "Final Test Project",
      actualHours: "08:30",
      startDate: "12 Jan 2025",
      endDate: "20 Jan 2025",
      allocation: 70,
      tasks: [
        { name: "Generic Task 6", allocatedWork: "08:00", actualWork: "00:00" },
        {
          name: "Fixed BID Project Testing",
          allocatedWork: "08:75",
          actualWork: "00:00"
        },
        {
          name: "Resource Allocation page development",
          allocatedWork: "09:15",
          actualWork: "00:00"
        }
      ]
    },
    {
      project: "API Customization",
      actualHours: "08:30",
      startDate: "12 Jan 2025",
      endDate: "20 Jan 2025",
      allocation: 70,
      tasks: [
        { name: "Generic Task 7", allocatedWork: "08:00", actualWork: "00:00" },
        {
          name: "Other Timesheet Task",
          allocatedWork: "08:75",
          actualWork: "08:75"
        },
        {
          name: "Timesheet Customization",
          allocatedWork: "09:15",
          actualWork: "00:00"
        }
      ]
    }
  ]);
  const iconRef = useRef(null); // Reference for Callout positioning
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);

  // const [projects, setProjects] = useState({});

  // const [timesheetData, setTimesheetData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // Manage active state for accordion items

  useEffect(() => {
    if (showDaTypeModal && currentProject && currentDay) {
      const selectedDaTypeKey = currentDay[`daTypet${currentProject}`];
      const selectedDaType = daTypeMapping[selectedDaTypeKey] || selectedDaTypeKey; // Default to key if no mapping
      const selectedDescription = currentDay[`descriptiont${currentProject}`];

      setDaType(selectedDaType);
      setDescription(selectedDescription);
    }
  }, [showDaTypeModal, currentProject, currentDay]);

  useEffect(() => {
    if (currentProject) {
      // Generate dynamic field names based on currentProject and currentDay
      const selectedDaTypeKey = taskid[`daTypet${currentDay}`]; // Example: daTypet1, daTypet2, etc.
      // Default to key if no mapping
      const selectedDescription = taskid[`descriptiont${currentDay}`]; // Example: descriptiont1, descriptiont2, etc.

      setDaType(selectedDaTypeKey);
      setDescription(selectedDescription);
      // console.log("handleShowDaTypeModal9999", currentProject, selectedDescription);
    }
  }, [showDaTypeModal, currentProject]);

  const fetchDATypes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetailsDropDown?UserID=${userid}&FieldName=datype`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setDATypes(data.data.listTimesheetEntryDropDown); // Set the DA types to state
    } catch (error) {
      console.error("Error fetching DA types:", error);
    }
  };

  useEffect(() => {
    fetchDATypes(); // Fetch DA types when the component mounts
  }, []);

  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // const deleteTimesheetEffort = () =>{

  // }
  const deleteTimesheetEffort = async (DAID, UserID) => {
    debugger;
    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/DeleteTimesheetEntryDetail?DAID=${DAID}&UserID=${UserID}`;
    // const url = `https://springfield-applicant-ultimate-likewise.trycloudflare.com/WhizTeams/MyTimesheetEntry/DeleteTimesheetEntryDetail?DAID=${DAID}&UserID=${UserID}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" // optional but good to have
        }
      });

      if (response.data.data === "1") {
        toast.success("Timesheet entry deleted successfully");
        setRefresh((prev) => !prev); // Refresh the data after deletion
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  const handleShowDaTypeModal = (projectId, day, task) => {
    setCurrentProject(projectId?.projectId);
    setCurrentDay(projectId?.dayIndex);
    setTaskid(projectId?.task);
    setShowDaTypeModal(true);
  };

  // const handleTooltipOpen = () => {
  //   // setCurrentTaskID(task.taskID);
  //   // fetchTaskDetails(task.taskID);
  //   setOpen(true);
  // };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const fetchTaskDetails = (taskID) => {
    const token = sessionStorage.getItem("token");
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheettaskDetails?UserID=${userid}&TaskID=${taskID}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setFetchedTaskDetails(response.data.data.listTimestTaskDetail[0]);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  };

  const handleCloseDaTypeModal = () => {
    setShowDaTypeModal(false);
    setDaType("");
    setDescription("");
  };

  const handleSave = async () => {
    // Extract day-specific date string and time range
    const dayDateString = timesheetData.listTimesheetEntryHeader[0][`dayDate${currentDay}`];
    const [dateString, timeRangeString] = dayDateString.split("|").map((part) => part.trim()); // Split date and time range
    // console.log("dayDateString", dayDateString);

    // Parse the date string (e.g., "14 Jan 2025") into a Date object
    const date = new Date(dateString);

    // Apply timezone offset if needed (e.g., convert to UTC)
    const timezoneOffset = date.getTimezoneOffset(); // Get the offset in minutes
    const offsetDate = new Date(date.getTime() - timezoneOffset * 60 * 1000); // Adjust for the offset

    // Format the adjusted date as "yyyy-MM-dd"
    const entryDate = offsetDate.toISOString().split("T")[0]; // Convert to "2025-01-14"

    // Helper function to convert time to 24-hour format
    const convertTo24HourTime = (timeString) => {
      const [time, modifier] = timeString.split(" "); // Split time and AM/PM
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours < 12) hours += 12; // Convert PM to 24-hour format
      if (modifier === "AM" && hours === 12) hours = 0; // Handle midnight (12 AM)

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`; // Format as "HH:mm"
    };

    // Extract and convert `fromTime` and `toTime`
    const convertTo12HourTime = (timeString) => {
      let [time, period] = timeString.split(" "); // Separate time and AM/PM
      let [hours, minutes] = time.split(":").map(Number);
      return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}`; // Ensure two-digit minutes
    };

    const [fromTimeString, toTimeString] = timeRangeString.split("-").map((time) => time.trim());
    const fromTime = convertTo12HourTime(fromTimeString);
    const toTime = convertTo12HourTime(toTimeString);

    // Convert "06:00 PM" to "18:00"
    // if (!hhmmRegex.test(taskid[`dayEfforst${currentDay}`])) {
    //   toast.error("Please enter time in HH:MM format");
    //   return;
    // }
    // Prepare the entry data for the save API
    const entryData = {
      entryDate: entryDate, // Use the formatted and offset-adjusted date "yyyy-MM-dd"
      fromTime: fromTime, // Extracted and converted to "HH:mm"
      toTime: toTime, // Extracted and converted to "HH:mm"
      userID: userid, // User ID from session or state
      projectID: taskid?.projectID, // Current project ID
      taskID: Number(taskid?.taskID), // Task ID
      description: description, // Description for the day
      daType: daType, // DA type for the day
      duration: taskid[`dayEfforst${currentDay}`] // Effort duration
    };

    // console.log("Mapped Entry Data:", entryData);

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
          body: JSON.stringify(entryData) // Send the entryData in JSON body
        }
      );

      const validationResult = await validateResponse.json();

      // Check for validation message success or errors
      const validationErrors = validationResult?.data
        ?.filter((item) => item.validationMessage) // Extract items with validation messages
        .map((item) => item.validationMessage) // Extract the validation messages
        .join(", "); // Combine multiple messages into a single string

      if (validationErrors === "Success") {
        // If validation message is "Success", check if type is 0 and proceed with posting the entry
        const validationData = validationResult?.data?.[0]; // Assuming we check the first item in the data array

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
            setRefresh((prev) => !prev);
            handleCloseDaTypeModal();
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
        } else {
          // Handle case where type is not 0 (you can add more logic here if needed)
          toast.error("Validation failed: You cannot proceed with this task.");
        }
      } else if (validationErrors) {
        // If validation fails, show the validation error message
        //added by parth.g
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
                  // yesClickHandler();
                  handleCloseDaTypeModal();
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
                  handleCloseDaTypeModal();
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
        } else {
          toast.error(`${validationErrors}`);
        }
      } else {
        // Fallback for unexpected validation response
        toast.error("Unexpected validation response. Please try again.");
      }
    } catch (error) {
      console.error("Error during save:", error);
      toast("An error occurred. Please try again.", { type: "error" });
    }
  };
  const handleSubmitDaType = () => {
    handleSave();

    // Update the corresponding project entry in the timesheetData state
    setTimesheetData((prevData) => {
      // Create a deep copy of the timesheetData
      const updatedData = JSON.parse(JSON.stringify(prevData)); // Deep copy to avoid mutating state

      // Map through projects in listProjectDetailsEntity
      const updatedProjects = updatedData?.listProjectDetailsEntity.map((project) => {
        // console.log("currentProject:", currentProject, project.projectID); // 3

        // Update the tasks for the selected project
        const updatedTasks = project.listTaskDetailsEntity.map((task) => {
          // console.log(`Updating taskID: ${task.taskID}`); // Log task ID being updated

          // Get the dynamic field names based on the `day` value
          const daTypetField = `daTypet${currentDay}`; // Example: daTypet3
          const descriptiontField = `descriptiont${currentDay}`; // Example: descriptiont3

          // Update the day-specific DA Type field (e.g., daTypet3)
          if (task.hasOwnProperty(daTypetField)) {
            // console.log(
            //   `Updating ${daTypetField} for taskID: ${task.taskID} with value: ${daType}`
            // );
            task[daTypetField] = daType; // Set the DA Type field for the current day
          }

          // Update the day-specific Description field (e.g., descriptiont3)
          if (task.hasOwnProperty(descriptiontField)) {
            // console.log(
            //   `Updating ${descriptiontField} for taskID: ${task.taskID} with value: ${description}`
            // );
            task[descriptiontField] = description; // Set the Description field for the current day
          }

          return task; // Return the updated task
        });

        // Return the updated project with modified tasks
        return { ...project, listTaskDetailsEntity: updatedTasks };

        return project; // Return unchanged project if not the selected one
      });

      // Log the updated state before setting
      // console.log("Updated Timesheet Data:", updatedData);

      // Return the updated timesheet data to set it in state
      return {
        ...updatedData,
        listProjectDetailsEntity: updatedProjects
      };
    });

    handleCloseDaTypeModal(); // Close the modal after submitting
  };

  // toggle off on date change
  useEffect(() => {
    setActiveIndex(null);
  }, [selectedDate, , refresh]);

  const selectedDate1 = moment(selectedDate);
  const formattedDate = selectedDate1.format("ddd, DD MMM YYYY");
  // console.log("SelectedDate",selectedDate )

  const getCurrentDate = () => {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const normalizedDate = getCurrentDate();

  const formatDateToISO = (dateStr) => {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchProjectDetails = async () => {
    var finaldate =
      selectedDate.getFullYear() +
      "-" +
      String(selectedDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(selectedDate.getDate()).padStart(2, "0");
    var tryDate = date.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetWeekHeader?InputDate=${finaldate}&UserID=${userid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}` // Add token if required
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Assuming 'data' has a structure you can pass to the state directly.
      setProjects(data.data.listTimesheetWeekHeader);
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    var data;
    const fetchUserDAEntryFilter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetUserDAEntryFilter?UserID=${userid}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
          }
        );

        const filterData = response.data?.data?.listDAFilterDetails[0];
        fetchTimesheetData(filterData.whereClause);
        data = filterData.whereClause;
      } catch (error) {
        console.error("Error fetching DA entry filter:", error);
      }
    };

    const fetchTimesheetData = async (filterData) => {
      try {
        setLoading(true); // Start loading
        var fdate = await formatDateToISO(selectedDate);

        const constructRequestBody = () => {
          const rawRequestBody = {
            userID: userid,
            // inputDate: newdate ? formatDateToISO(newdate) : normalizedDate,
            inputDate: selectedDate ? fdate : normalizedDate,
            whereClause: filterData,
            // whereClause:
            //   '{"strFilterProjectList":"","strFilterTaskTypeList":"","strFilterTaskCategories":"","strFilterSubProjectList":"","strFilterMilestoneList":"","strFilterModuleList":"","strFilterDeliverableList":"","strFilterPhaseList":"","strFilterTaskStatus":"","strFilterPriorityList":"","strFilterBillable":""}',
            strTaskName: searchTerm
          };

          // Remove fields with undefined, null, empty string, or empty array
          const cleanedRequestBody = Object.fromEntries(
            Object.entries(rawRequestBody).filter(([_, value]) => {
              // Filter out undefined, null, empty string, and empty array
              return (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                !(Array.isArray(value) && value.length === 0)
              );
            })
          );

          return cleanedRequestBody;
        };
        const requestBody = constructRequestBody();
        const response = await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetEntryDetail`,
          requestBody,
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Add token to Authorization header
            }
          }
        );

        const data = response.data.data;
        if (data?.listProjectDetailsEntity && data?.listProjectDetailsEntity.length === 0) {
          const currentTime = Date.now(); // Get current time in milliseconds

          //Added by Parth.G
          toast.error("Please recheck the filters, currently no data.");

          // Check if 2 minutes have passed since the last toast
          if (currentTime - lastToastTime >= 60000) {
            // Show toast if listProjectDetailsEntity is empty and 2 minutes have passed
            // toast.error("Please recheck the filters, currently no data.");
            // Update lastToastTime to current time after showing the toast
            setLastToastTime(currentTime);
          }
          // added by parth.g
        } else if (
          data.listProjectDetailsEntity.every(
            (project) => project?.listTaskDetailsEntity?.length === 0
          )
        ) {
          toast.error("Please recheck the filters, currently no data.");
        }
        setTopdata(data.listTimesheetEntryHeader[0]);
        setDate1(data.listTimesheetEntryHeader[0].dayDate1);
        setTimesheetData(data);

        const daysCount = [1, 2, 3, 4, 5, 6, 7];

        const formattedTasks = data.listProjectDetailsEntity.map((project) => ({
          project: project.projectName,
          actualHours: project.projectWeekEfforts,
          startDate: project.assignmentStartDate || "N/A",
          endDate: project.assignmentEndDate || "N/A",
          allocation: project.resourcePercentage * 100,
          tasks: project.listTaskDetailsEntity.map((task) => {
            const dayWiseEfforts = daysCount.map((no, index) => ({
              date:
                data.listTimesheetEntryHeader[0][`dayDate${index + 1}`]?.split("|")[0] ||
                `Day ${index + 1}`,
              effort: task[`dayEfforst${no}`] || "00:00",
              descriptiont: task[`descriptiont${no}`] || "",
              daTypet: task[`daTypet${no}`] || "",
              resourceTimesheetID: task[`resourceTimesheetID${no}`] || 0,
              timesheetStatusFlag: task[`timesheetStatusFlag${no}`] || ""
            }));

            return {
              dayWiseEfforts,
              isTaskComplete: task.isTaskComplete,
              isVoid: task.isVoid,
              name: task.taskName,
              taskID: task.taskID,
              taskTypeID: task.taskTypeID,
              whichTask: task.whichTask
            };
          })
        }));

        console.log("Formatted Tasks", formattedTasks);
        console.log("tmshtdata ", timesheetData);
        // setDefaultTasks(formattedTasks);
        setTasks(formattedTasks);

        //need to update soon
        // setTimesheetData(data); // Assuming setTimesheetData is a valid state setter
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    setTimeout(() => {
      fetchProjectDetails();
      fetchUserDAEntryFilter();
    }, 1000);
  }, [selectedDate, appliedFilters, searchTerm, refresh]);

  // useEffect(() =>{
  // },[selectedDate])

  // const handleSubmitTimesheet1 = async () => {
  //   alert("Happy Happy vay");
  // };

  const handleSubmitTimesheet1 = async () => {
    const payload = {
      userID: userid, // Replace with actual userID value
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
          }
        }
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast.error("An error occurred while submitting the timesheet.");
    }

    // if (refresh1) {
    //   setRefresh1(false);
    // } else {
    //   setRefresh1(true);
    // }
    setRefresh((prev) => !prev);
    // setRefresh1((prev) => !prev);
  };

  // const dayNumber = selectedDate.getDay();
  const dayNumber = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();

  const handleSubmitTimesheet = async (data) => {
    // Retrieve selected tasks from sessionStorage
    const selectedTasksFromSession = JSON.parse(sessionStorage.getItem("selectedTasks")) || [];

    const payload = {
      userID: userid, // Replace with actual userID value
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
                const resourceTimesheetID = `resourceTimesheetID${day}`;

                // Exclude task if duration is "00:00"
                // if (task[dayEffortsKey] === "00:00") return null; // Skip this task
                //Added by Parth.G for DA

                const currentEffort = task[dayEffortsKey] || "00:00";

                const prevEffort = previousEfforts.current[`${task.taskID}-${day}`] || "00:00";
                var FromWhereFlag = "";

                if (currentEffort === "00:00" && prevEffort === "00:00") {
                  return null;
                } else if (currentEffort === "00:00" && prevEffort !== "00:00") {
                  FromWhereFlag = "MT";
                  previousEfforts.current[`${task.taskID}-${day}`] = "00:00";
                }

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
                  description: task[descriptionKey] || "", //Added by Parth.G
                  taskTypeID: task.taskTypeID,
                  subTaskTypeID: 0,
                  isDurationChange: true,
                  isTaskComplete: false,
                  actualPercentComplete: 0,
                  isResourceTaskComplete: false,
                  overtime: "0",
                  daType: task[daTypeKey] || "N",
                  storyPoint: 0,
                  resourceTimesheetID: task[resourceTimesheetID] || 0, //need to handle now
                  FromWhere: FromWhereFlag
                };
              })
              .filter(Boolean) // Remove null values (tasks with "00:00" duration or not selected)
        )
      )
    };

    isFetchedPrevvalue.current = false;

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

      // Extract validation data
      const validationData = result?.data;
      // setRefresh1(!refresh1);
      if (validationData.validationMessage != null) {
        if (validationData.validationMessage.includes("the Daily Activity will still be saved.")) {
          // Handle the case where the message contains the specific string
          toast.info(validationData.validationMessage);
        }
      }

      if (!validationData || validationData.validationMessage === null) {
        toast.error("Please Fill Daily Activity");
        console.error("Missing validation message in API response:", validationData);
      } else {
        let { validationMessage } = validationData;

        // Format the validation message properly
        if (validationMessage.toLowerCase().includes("success")) {
          // Show green toast for success
          // toast.success("Daily Activity Saved Successfully!", {
          //   style: { backgroundColor: "green", color: "white" }
          // });
          //Added by Parth.G
          toast.success("Daily Activity Saved Successfully!");
        } else {
          // Replace '\r\n' with a new line `<br/>` for proper formatting
          const formattedMessage = validationMessage.split("\r\n").join("<br/>");

          // Show red toast for validation errors
          if (
            !validationData.validationMessage.includes("the Daily Activity will still be saved.")
          ) {
            // Handle the case where the message contains the specific string
            // toast.info(validationData.validationMessage);
            toast.error(<div dangerouslySetInnerHTML={{ __html: formattedMessage }} />, {
              style: { backgroundColor: "red", color: "white" }
            });
          }
        }
      }
      // added by Parth.G
      // alert("2");
      // setclearinitalvaluesflag(true);

      // if (refresh1) {
      //   setRefresh1(false);
      // } else {
      //   setRefresh1(true);
      // }

      // setRefresh1((prev) => !prev);
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast.error("An error occurred while submitting the timesheet.");
    }

    setRefresh((prev) => !prev);
  };

  const handleEffortChange = (projectIndex, taskIndex, date, newEffort) => {
    setTasks((prevTasks) =>
      prevTasks.map((proj, pIndex) =>
        pIndex === projectIndex
          ? {
              ...proj,
              tasks: proj.tasks.map((task, tIndex) =>
                tIndex === taskIndex
                  ? {
                      ...task,
                      dayWiseEfforts: updateEffort(task.dayWiseEfforts, date, newEffort)
                    }
                  : task
              )
            }
          : proj
      )
    );
  };

  // Helper function to update the specific date's effort
  const updateEffort = (efforts, date, newEffort) => {
    if (!Array.isArray(efforts)) return [];

    const effortIndex = efforts.findIndex((e) => e.date === date);

    if (effortIndex !== -1) {
      return efforts.map((effort, idx) =>
        idx === effortIndex ? { ...effort, effort: newEffort } : effort
      );
    } else {
      return [...efforts, { date, effort: newEffort }];
    }
  };

  const handleSaveEdit = async (e, taskID, day, newValue) => {
    if (!newValue) return;

    // Find the task to update
    const updatedTimesheetData = timesheetData.listProjectDetailsEntity.map((project) => {
      return {
        ...project,
        listTaskDetailsEntity: project.listTaskDetailsEntity.map((task) => {
          if (task.taskID === taskID) {
            return {
              ...task,
              [`dayEfforst${day}`]: newValue // Update the specific dayEfforst field
            };
          }
          return task;
        })
      };
    });

    // Update the state to reflect the changes
    setTimesheetData((prevState) => ({
      ...prevState,
      listProjectDetailsEntity: updatedTimesheetData
    }));

    // Update the previousEfforts state
    const foundTask = timesheetData.listProjectDetailsEntity
      .flatMap((project) => project.listTaskDetailsEntity)
      .find((task) => task.taskID === taskID);

    if (foundTask) {
      setPreviousEfforts({
        [`${taskID}-${day}`]: foundTask[`dayEfforst${day}`] || "00:00"
      });
    }

    // Clear the intermediate value
    setIntermediateValues((prev) => {
      const newValues = { ...prev };
      delete newValues[`${taskID}-${day}`];
      return newValues;
    });
  };

  const handleSearchChange = async (event) => {
    await setSearchTerm(event.target.value);
  };

  const dayNames = timesheetData?.listTimesheetEntryHeader?.[0]
    ? [
        timesheetData.listTimesheetEntryHeader[0].day1,
        timesheetData.listTimesheetEntryHeader[0].day2,
        timesheetData.listTimesheetEntryHeader[0].day3,
        timesheetData.listTimesheetEntryHeader[0].day4,
        timesheetData.listTimesheetEntryHeader[0].day5,
        timesheetData.listTimesheetEntryHeader[0].day6,
        timesheetData.listTimesheetEntryHeader[0].day7
      ]
    : [];

  const dayDates = timesheetData?.listTimesheetEntryHeader?.[0]
    ? [
        timesheetData.listTimesheetEntryHeader[0].dayDate1,
        timesheetData.listTimesheetEntryHeader[0].dayDate2,
        timesheetData.listTimesheetEntryHeader[0].dayDate3,
        timesheetData.listTimesheetEntryHeader[0].dayDate4,
        timesheetData.listTimesheetEntryHeader[0].dayDate5,
        timesheetData.listTimesheetEntryHeader[0].dayDate6,
        timesheetData.listTimesheetEntryHeader[0].dayDate7
      ]
    : [];

  const totalHours = timesheetData?.listTimesheetEntryHeader?.[0]
    ? [
        timesheetData.listTimesheetEntryHeader[0].daySumTotal1,
        timesheetData.listTimesheetEntryHeader[0].daySumTotal2,
        timesheetData.listTimesheetEntryHeader[0].daySumTotal3,
        timesheetData.listTimesheetEntryHeader[0].daySumTotal4,
        timesheetData.listTimesheetEntryHeader[0].daySumTotal5,
        timesheetData.listTimesheetEntryHeader[0].daySumTotal6,
        timesheetData.listTimesheetEntryHeader[0].daySumTotal7
      ]
    : [];

  // console.log("dayNames:", dayNames);
  // console.log("dayDates:", dayDates);
  // console.log("totalHours:", totalHours);
  const daTypeMapping = {
    N: "Normal",
    0: "Overtime",
    C: "OnCall",
    C1: "CallBack"
  };

  return (
    <>
      <div>
        {/* Search and Buttons */}
        <div className="next_btn mb-3">
          <div className="row">
            <div className="col-5">
              <div className="searchRow">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search Tasks.."
                    value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    onChange={handleSearchChange}
                    className="form-control input-sm"
                  />
                  <div className="input-group-btn">
                    <button className="btn btn-default srchBtn" type="submit">
                      <FaSearch />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {topdata.timesheetStatus === "" && (
              <>
                <div className="col-7 d-flex justify-content-center gap-1">
                  {String(topdata.weekActualHours) !== "00:00" && (
                    <button
                      className="btn borderbtn me-3"
                      title="Submit Timesheet"
                      onClick={handleSubmitTimesheet1}
                    >
                      Submit Timesheet
                    </button>
                  )}

                  <button className="btn btnyellow" title="Save" onClick={handleSubmitTimesheet}>
                    Save
                  </button>
                </div>
              </>
            )}
            {topdata.timesheetStatus === "Not Submitted" && (
              <>
                <div className="col-7 d-flex justify-content-center gap-1">
                  {String(topdata.weekActualHours) !== "00:00" && (
                    <button
                      className="btn borderbtn me-3"
                      title="Submit Timesheet"
                      onClick={handleSubmitTimesheet1}
                    >
                      Submit Timesheet
                    </button>
                  )}

                  <button className="btn btnyellow" title="Save" onClick={handleSubmitTimesheet}>
                    Save
                  </button>
                </div>
              </>
            )}
            {topdata.timesheetStatus === "Rejected" && (
              <>
                <div className="col-7 d-flex justify-content-center gap-1">
                  {String(topdata.weekActualHours) !== "00:00" && (
                    <button
                      className="btn borderbtn me-3"
                      title="Resubmit Timesheet"
                      onClick={handleSubmitTimesheet1}
                    >
                      Resubmit Timesheet
                    </button>
                  )}
                  <button className="btn btnyellow" title="Save" onClick={handleSubmitTimesheet}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* {loading && <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>} */}

        {loading ? (
          <div className="d-flex justify-content-center " style={{ height: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div
            className="TS_ProjTask_Card mb-3"
            style={{ height: "calc(100vh - 240px)", overflow: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="txt_Blue text-center">
                <FaCalendar /> <span>{`${formattedDate}`}</span>
                {/* <FaCalendar /> <span>Tuesday, 14 Jan 2025</span> */}
              </h6>

              {/* <h6 className="txt_Blue text-center">
                T-Status - {topdata.timesheetStatus}
              </h6> */}
              <h6 className="text-center">
                <span className="txt_Blue">T-Status - </span>

                <span
                  className={
                    topdata.timesheetStatus === "Rejected"
                      ? "text_red"
                      : topdata.timesheetStatus === "Approved"
                      ? "text_green"
                      : topdata.timesheetStatus === "Submitted"
                      ? "txt_Blue"
                      : topdata.timesheetStatus === "Not Submitted"
                      ? ""
                      : ""
                  }
                >
                  {topdata.timesheetStatus}
                </span>
              </h6>
            </div>

            {/* Accordion */}
            <div
              className="accordion"
              id="AccordionProjTaskMob"
              // style={{ height: "255px", overflow: "auto" }}
              // style={{ overflow: "auto" }}
            >
              {timesheetData?.listProjectDetailsEntity?.map((proj, index) => {
                var colourData =
                  projects.find((project) => project?.days === `Day${dayNumber}`)?.dayType || "";

                let className = "orange";
                if (colourData === "WeekEnd") {
                  className = "Grey";
                } else if (colourData == "Leave") {
                  className = "Blue";
                } else if (colourData == "Holiday") {
                  className = "SkyBlue";
                }

                return (
                  proj?.listTaskDetailsEntity?.length == 0 || (
                    <div
                      // className="accordion-item  accordion_projTaskMob_orange mb-3"
                      className={`accordion-item  accordion_projTaskMob_${className} mb-3`}
                      key={index}
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                          type="button"
                          onClick={() => handleToggle(index)}
                          aria-expanded={activeIndex === index ? "true" : "false"}
                          aria-controls={`collapseProject${index}_Mob`}
                        >
                          <div className="flex-1 pe-2">
                            {/* <div className="d-flex justify-content-between align-items-end"> */}
                            <div className="row mb-3">
                              <div className="col-7" style={{ lineHeight: "1.2" }}>
                                <span>{proj.projectName}</span>
                              </div>
                              <div className="col-5">
                                <label className="text_pink fw-500">Actual Hours -&nbsp;</label>
                                <label className=" fw-500">{proj.projectWeekEfforts}</label>
                              </div>
                            </div>
                            <div className="row gx-1">
                              <div className="col-4">
                                <div className="projDetlsMob text-center">
                                  <div className="text_pink">Start Date: </div>
                                  <div className="fw-500">{proj.assignmentStartDate}</div>
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="projDetlsMob text-center">
                                  <div className="text_pink">End Date: </div>
                                  <div className="fw-500">{proj.assignmentEndDate}</div>
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="projDetlsMob text-center">
                                  <div className="text_pink ">% Allocation: </div>
                                  <div className="fw-500">{proj.resourcePercentage}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`collapseProject${index}_Mob`}
                        className={`accordion-collapse collapse ${
                          activeIndex === index ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <ul className="list-unstyled mb-0">
                            {proj.listTaskDetailsEntity?.map((task, tIndex) => {
                              const selectedDateFormatted =
                                moment(selectedDate).format("DD MMM YYYY");
                              const dayIndex = dayNumber;

                              if (dayIndex === -1) return null;

                              const effortKey = `dayEfforst${dayIndex}`;
                              const daTypetKey = `daTypet${dayIndex}`;
                              const descriptionKey = `descriptiont${dayIndex}`;
                              const daiDKey = `daiD${dayIndex}`;
                              const timesheetStatusKey = `timesheetStatusFlag${dayIndex}`;
                              const resourceTimesheetIDKey = `resourceTimesheetID${dayIndex}`;

                              const effortValue = task[effortKey] || "00:00";
                              const daTypet = task[daTypetKey] || "";
                              const description = task[descriptionKey] || "";
                              const daid = task[daiDKey] || 0;
                              const timesheetStatusFlag = task[timesheetStatusKey] || "";
                              const resourceTimesheetID = task[resourceTimesheetIDKey] || 0;

                              return (
                                <li className="mb-2" key={tIndex}>
                                  <div className="row align-items-center">
                                    <div className="col-6 d-flex justify-content-between">
                                      <span className="taskTxt_mob">{task.taskName}</span>

                                      {/* kam */}
                                      <div>
                                        <Tooltip
                                          title={
                                            fetchedTaskDetails && currentTaskID === task.taskID ? (
                                              <div style={{ width: "210px" }}>
                                                <div className="row">
                                                  <div className="col-6 col-sm-12 text-end">
                                                    Start Date :
                                                  </div>
                                                  <div className="col-6 col-sm-12">
                                                    {fetchedTaskDetails?.startDate
                                                      ? fetchedTaskDetails.startDate
                                                      : "N/A"}
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="col-6 col-sm-12 text-end">
                                                    End Date :
                                                  </div>
                                                  <div className="col-6 col-sm-12">
                                                    {fetchedTaskDetails?.endDate
                                                      ? fetchedTaskDetails.endDate
                                                      : "N/A"}
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="col-6 col-sm-4 text-end">
                                                    Allocated Hours :
                                                  </div>
                                                  <div className="col-6 col-sm-8">
                                                    {fetchedTaskDetails?.allocatedHrs || "N/A"}
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="col-6 col-sm-4 text-end">
                                                    Actual Effort :
                                                  </div>
                                                  <div className="col-6 col-sm-8">
                                                    {fetchedTaskDetails?.actualHrs || "N/A"}
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              ""
                                            )
                                          }
                                          // onOpen={() => {
                                          //   setCurrentTaskID(task.taskID);
                                          //   fetchTaskDetails(task.taskID);
                                          // }}
                                          open={open}
                                          onClose={handleTooltipClose}
                                          disableHoverListener
                                        >
                                          <span
                                            className="infoIconWrapper"
                                            style={{ cursor: "pointer" }}
                                            // onMouseDown={handleTooltipOpen} // Handles press on desktops
                                            onMouseDown={() => {
                                              setCurrentTaskID(task.taskID);
                                              fetchTaskDetails(task.taskID);
                                              setOpen(true);
                                            }} // Handles press on desktops
                                            // onTouchStart={handleTooltipOpen} // Handles press on mobile
                                            onTouchStart={() => {
                                              setCurrentTaskID(task.taskID);
                                              fetchTaskDetails(task.taskID);
                                              setOpen(true);
                                            }}
                                            // onMouseUp={handleTooltipClose} // Close on release (Desktop)
                                            // onTouchEnd={handleTooltipClose} // Close on release (Mobile)
                                          >
                                            <FontAwesomeIcon
                                              icon={faInfoCircle}
                                              style={{ color: "#007bff" }}
                                            />
                                          </span>
                                        </Tooltip>
                                      </div>
                                      {/* <div style={{
                                          position: "relative"}}>
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
                                          // setIsCalloutVisible(!isCalloutVisible);
                                          // handleTaskHover(selectedTask);
                                          // handleTaskHover(selectedTask);

                                          setIsCalloutVisible(
                                            !isCalloutVisible
                                          );
                                        }}
                                      >
                                        <FaInfoCircle
                                          style={{
                                            fontSize: "15px",
                                            color: "#007bff",
                                          }}
                                        />
                                      </div>

                                      {isCalloutVisible && (
                                        <Callout
                                          target={iconRef.current}
                                          onDismiss={() =>
                                            setIsCalloutVisible(false)
                                          }
                                          directionalHint={
                                            DirectionalHint.rightCenter
                                          }
                                          gapSpace={10}
                                          setInitialFocus
                                        >
                                          <div
                                            style={{
                                              padding: "10px",
                                              maxWidth: "250px",
                                            }}
                                          >
                                            <div className="row">
                                              <div className="col-sm-6 col-12 txt_Blue">
                                                Start Date:
                                              </div>
                                              <div className="col-sm-6 col-12">
                                                {fetchedTaskDetails?.startDate
                                                  ? fetchedTaskDetails.startDate
                                                  : "N/A"}
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-sm-6 col-12 txt_Blue">
                                                End Date:
                                              </div>
                                              <div className="col-sm-6 col-12">
                                                {fetchedTaskDetails?.endDate
                                                  ? fetchedTaskDetails.endDate
                                                  : "N/A"}
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-sm-6 col-12 txt_Blue">
                                                Allocated Hours :
                                              </div>
                                              <div className="col-sm-6 col-12">
                                                {fetchedTaskDetails?.allocatedHrs ||
                                                  "N/A"}
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-sm-6 col-12 txt_Blue">
                                                Actual Effort:
                                              </div>
                                              <div className="col-sm-6 col-12">
                                                {fetchedTaskDetails?.actualHrs ||
                                                  "N/A"}
                                              </div>
                                            </div>
                                          </div>
                                        </Callout>
                                      )}
                                    </div> */}

                                      {/* kam */}
                                    </div>
                                    <div className="col-4">
                                      <input
                                        type="text"
                                        disabled={
                                          task.isTaskComplete ||
                                          task.isVoid ||
                                          timesheetStatusFlag === "R" ||
                                          timesheetStatusFlag === "V"
                                        }
                                        // value={effortValue}
                                        // value={
                                        //   intermediateValues[
                                        //     `${task.taskID}-${dayIndex}`
                                        //   ] ||
                                        //   effortValue ||
                                        //   "N/A"
                                        // }
                                        value={
                                          intermediateValues[`${task.taskID}-${dayIndex}`] ??
                                          effortValue ??
                                          "00:00"
                                        }
                                        // pending for efforts value change
                                        onChange={(e) => {
                                          let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                                          if (value === "") {
                                            // Allow empty value
                                            setIntermediateValues((prev) => ({
                                              ...prev,
                                              [`${task.taskID}-${dayIndex}`]: ""
                                            }));
                                            return;
                                          }

                                          // Automatically add colon after 2 digits
                                          if (value.length > 2) {
                                            value =
                                              value.substring(0, 2) + ":" + value.substring(2, 4);
                                          }

                                          // Limit the value to 5 characters (hh:mm)
                                          if (value.length > 5) {
                                            value = value.substring(0, 5);
                                          }

                                          // Ensure hours are in the valid 24-hour range (00-23)
                                          if (value.length >= 3) {
                                            const hours = parseInt(value.substring(0, 2), 10);
                                            if (hours > 23) {
                                              value = "23" + value.substring(2);
                                            }
                                          }

                                          // Ensure minutes are in the valid range (00-59)
                                          if (value.length === 5) {
                                            const minutes = parseInt(value.substring(3), 10);
                                            if (minutes > 59) {
                                              value = value.substring(0, 3) + "59";
                                            }
                                          }

                                          setIntermediateValues((prev) => ({
                                            ...prev,
                                            [`${task.taskID}-${dayIndex}`]: value
                                          }));
                                        }}
                                        onBlur={(e) => {
                                          var value = e.target.value.trim();
                                          // if (value === "") {
                                          //   value = "00:00";
                                          // }
                                          if (value === "") {
                                            value = "00:00"; // If empty, set to "00:00"
                                          } else if (value.length === 1) {
                                            value = `0${value}:00`; // Convert "4" → "04:00"
                                          } else if (value.length === 2) {
                                            value = `${value}:00`; // Convert "12" → "12:00"
                                          }
                                          // else if (value.length === 3) {
                                          //   value = `${value.substring(
                                          //     0,
                                          //     2
                                          //   )}:0${value.substring(2)}`; // Convert "123" → "12:03"
                                          // } else if (value.length === 4) {
                                          //   value = `${value.substring(
                                          //     0,
                                          //     2
                                          //   )}:${value.substring(2)}`; // Convert "1234" → "12:34"
                                          // }

                                          if (value.length === 4 && value.includes(":")) {
                                            value =
                                              value.substring(0, 3) + value.substring(3) + "0";
                                          }

                                          // Ensure hours are in the valid 24-hour range (00-23)
                                          let hours = parseInt(value.substring(0, 2), 10);
                                          if (hours > 23) {
                                            value = "23" + value.substring(2);
                                          }

                                          // Ensure minutes are in the valid range (00-59)
                                          let minutes = parseInt(value.substring(3), 10);
                                          if (minutes > 59) {
                                            value = value.substring(0, 3) + "59";
                                          }

                                          handleSaveEdit(e, task.taskID, dayIndex, value);
                                        }}
                                        className="form-control edtTimeInputMob"
                                        // onChange={(e) =>
                                        //   handleEffortChange(
                                        //     index,
                                        //     tIndex,
                                        //     selectedDateFormatted,
                                        //     e.target.value
                                        //   )
                                        // }
                                      />
                                    </div>
                                    <div className="col-2 d-flex justify-content-center">
                                      {/* Replace this div with FontAwesomeIcon */}
                                      {task[`dayEfforst${dayIndex}`] !== "00:00" && (
                                        // {true && (
                                        <FontAwesomeIcon
                                          className="mt-1"
                                          icon={faInfoCircle}
                                          style={{
                                            cursor: "pointer",
                                            color: "#007bff"
                                          }}
                                          onClick={() =>
                                            handleShowDaTypeModal({
                                              dayIndex,
                                              task,
                                              projectId: task.taskID
                                            })
                                          }
                                        />
                                      )}

                                      {task[`dayEfforst${dayIndex}`] !== "00:00" &&
                                        (timesheetStatusFlag === "N" ||
                                          timesheetStatusFlag === "J") && (
                                          // topdata.timesheetStatus ===
                                          <span className="ps-2">
                                            <FontAwesomeIcon
                                              icon={faTrashCan}
                                              style={{
                                                cursor: "pointer",
                                                color: "red"
                                              }}
                                              onClick={() => deleteTimesheetEffort(daid, userid)}
                                            />
                                          </span>

                                          // <FontAwesomeIcon
                                          //   icon={faInfoCircle}
                                          //   style={{
                                          //     cursor: "pointer",
                                          //     color: "#007bff",
                                          //   }}
                                          //   onClick={() =>
                                          //     deleteTimesheetEffort({
                                          //       daid,
                                          //       userid
                                          //     })
                                          //   }
                                          // />
                                        )}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}

        {/* Timesheet Details */}
        {/* kam baki hai */}
      </div>

      <Modal show={showDaTypeModal} onHide={handleCloseDaTypeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">DA Type Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="form-label fw-semibold mb-2">DA Type</label>
            {daTypes.map((type) => (
              <div className="form-check" key={type.name}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={type.id}
                  name="daType"
                  checked={daType === type.id}
                  value={type.id}
                  onChange={(e) => setDaType(e.target.value)}
                />
                <label className="form-check-label ms-2" htmlFor={type.value}>
                  {type.name}
                </label>
              </div>
            ))}
          </div>
          <div className="form-group mt-4">
            <label htmlFor="description" className="form-label fw-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              className="form-control shadow-sm"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description..."
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="primary" className="me-2 px-4" onClick={handleSubmitDaType}>
            Save
          </Button>
          <Button variant="secondary" className="px-4" onClick={handleCloseDaTypeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectTaskMobile;
