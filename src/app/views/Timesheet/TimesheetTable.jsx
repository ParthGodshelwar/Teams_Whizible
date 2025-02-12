import React, { useState, useEffect } from "react";
import { Modal, Tab, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import TabModal from "./TabModal";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ProjectTaskTable from "./ProjectTaskTable"; // Adjust the path as needed
import { ToastContainer, toast } from "react-toastify";
const TimesheetTable = ({
  appliedFilters,
  date,
  setDate1,
  setTopdata,
  timesheetData,
  setTimesheetData,
  searchTerm,
  newdate,
  setNewdate,
  setRefresh1,
  refresh1,
  clearinitalvaluesflag,
  handleclearinitalvaluesflag
}) => {
  // const [timesheetData, setTimesheetData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDaTypeModal, setShowDaTypeModal] = useState(false);
  const [daType, setDaType] = useState(); // Stores the selected DA type
  const [description, setDescription] = useState(""); // Stores the textarea value
  const [currentProject, setCurrentProject] = useState(null);
  const [taskid, setTaskid] = useState(null); // Tracks the current project ID
  const [currentDay, setCurrentDay] = useState("");
  const [id, setId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showTabModal, setShowTabModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [taskDetails, setTaskDetails] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user.data.employeeId;
  const [daTypes, setDATypes] = useState([]);
  const token = sessionStorage.getItem("token");
  const currentDate = new Date().toISOString();
  // console.log("99999999999999999", appliedFilters);
  const [lastToastTime, setLastToastTime] = useState(0);
  const getCurrentDate = () => {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  // const parsedDate = new Date(date);
  // parsedDate.setDate(parsedDate.getDate() + 1);
  // const normalizedDate = parsedDate.toISOString().split("T")[0];
  const normalizedDate = getCurrentDate();

  const formatDateToISO = (dateStr) => {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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
        // console.log("User DA Entry Filter Response:", response.data);

        const filterData = response.data?.data?.listDAFilterDetails[0];
        fetchTimesheetData(filterData.whereClause);
        data = filterData.whereClause;
      } catch (error) {
        console.error("Error fetching DA entry filter:", error);
      }
    };
    // console.log("GetTimesheetEntryDetailsss,ssss111", newdate);
    const fetchTimesheetData = async (filterData) => {
      try {
        var fdate = await formatDateToISO(newdate);
        // Retrieve token from sessionStorage
        // console.log("GetTimesheetEntryDetailsss,", normalizedDate);
        // console.log("GetTimesheetEntryDetailsss,", fdate);

        const constructRequestBody = () => {
          const rawRequestBody = {
            userID: userid,
            // inputDate: newdate ? formatDateToISO(newdate) : normalizedDate,
            inputDate: newdate ? fdate : normalizedDate,
            whereClause: filterData,
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
        }
        // console.log("listTimesheetEntryHeader", data);
        setTopdata(data.listTimesheetEntryHeader[0]);
        setDate1(data.listTimesheetEntryHeader[0].dayDate1);
        setTimesheetData(data); // Assuming setTimesheetData is a valid state setter
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      }
    };
    setTimeout(() => {
      fetchUserDAEntryFilter();
    }, 1000);
  }, [appliedFilters, date, normalizedDate, searchTerm, newdate, refresh1]);

  const handleProjectSelect = (projectId) => {
    // console.log("handleProjectSelect", projectId);
    setSelectedProject(projectId);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // console.log("listProjectDetailsEntity12121", timesheetData);

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
  useEffect(() => {
    if (showDaTypeModal && currentProject && currentDay) {
      const selectedDaTypeKey = currentDay[`daTypet${currentProject}`];
      const selectedDaType = daTypeMapping[selectedDaTypeKey] || selectedDaTypeKey; // Default to key if no mapping
      const selectedDescription = currentDay[`descriptiont${currentProject}`];

      setDaType(selectedDaType);
      setDescription(selectedDescription);
    }
  }, [showDaTypeModal, currentProject, currentDay]);
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
  // Function to handle the opening of the DA Type modal
  const handleShowDaTypeModal = (projectId, day, task) => {
    setCurrentProject(projectId?.projectId);
    setCurrentDay(projectId?.day);
    setTaskid(projectId?.task);
    setShowDaTypeModal(true);
    // console.log("handleShowDaTypeModal1111", day);
    // console.log("handleShowDaTypeModal222", task);
    // console.log("handleShowDaTypeModal444", projectId);
  };
  // console.log("handleShowDaTypeModal", daType, description);
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
      // console.log("validationResult", validationResult);

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
    // console.log("Selected DA Type:", daType); // "S"
    // console.log("Description:", description); // "2ssssssssssss"
    // console.log("Project ID:", currentProject); // 48310
    // console.log("Day:", currentDay); // 3

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

  const handleInfoIconClick = (task) => {
    // console.log("handleInfoIconClick", task);
    setIsHovered(!isHovered);
    setTaskDetails(task);
  };

  const handleTabIconClick = (task) => {
    // console.log("handleTabIconClick", task);
    setId(task.taskID);
    setShowTabModal(true);
  };

  const handleCloseTabModal = () => {
    setShowTabModal(false);
    setSelectedTab("schedule");
  };

  const handleTabSelect = (key) => {
    setSelectedTab(key);
  };
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

  // console.log("handleShowDaTypeModal9999000000", currentProject);
  return (
    <table className="table table-bordered borderGrey TimesheetTbl mt-2" style={{ width: "100%" }}>
      {/* Project Rows */}
      <ProjectTaskTable
        date={date}
        dayNames={dayNames}
        setTimesheetData={setTimesheetData}
        dayDates={dayDates}
        totalHours={totalHours}
        timesheetData={timesheetData}
        handleProjectSelect={handleProjectSelect}
        handleInfoIconClick={handleInfoIconClick}
        handleTabIconClick={handleTabIconClick}
        isHovered={isHovered}
        taskDetails={taskDetails}
        handleShowDaTypeModal={handleShowDaTypeModal}
        clearinitalvaluesflag={clearinitalvaluesflag}
        handleclearinitalvaluesflag={handleclearinitalvaluesflag}
        refresh1={refresh1}
      />

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display project details */}
          <div>
            <span>Project Name: </span>
            <span>{selectedProject?.projectName}</span>
          </div>
          <div>
            <span>Project Week Efforts: </span>
            <span>{selectedProject?.projectWeekEfforts}</span>
          </div>
          <div>
            <span>Percentage: </span>
            <span>{selectedProject?.resourcePercentage || "N/A"}</span>
          </div>
          <div>
            <span>Assignment Start Date: </span>
            <span>{selectedProject?.assignmentStartDate}</span>
          </div>
          <div>
            <span>Assignment End Date: </span>
            <span>{selectedProject?.assignmentEndDate}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
      <TabModal
        taskID={id}
        showTabModal={showTabModal}
        handleCloseTabModal={handleCloseTabModal}
        selectedTab={selectedTab}
        handleTabSelect={handleTabSelect}
      />
    </table>
  );
};

export default TimesheetTable;
