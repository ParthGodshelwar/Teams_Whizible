import React, { useState, useEffect } from "react";
import { Modal, Button, Tab, Nav } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getDate } from "date-fns";
import { now } from "lodash";

const TabModal = ({ showTabModal, handleCloseTabModal, selectedTab, handleTabSelect, taskID }) => {
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [allocatedTime, setAllocatedTime] = useState(0);
  const [requestTime, setRequestTime] = useState(0);
  const [reason, setReason] = useState("");
  const [reason1, setReason1] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDate1, setStartDate1] = useState("");
  const [postTillDate, setPostTillDate] = useState("");
  const [selectedTaskID1, setSelectedTaskID1] = useState("");
  const [selectedProjectID1, setSelectedProjectID1] = useState("");
  const [selectedSubTaskID1, setSelectedSubTaskID1] = useState("");
  const [selectedProjectNAME, setSelectedProjectNAME] = useState("");
  const [selectedTaskNAME, setSelectedTaskNAME] = useState("");
  const [selectedSubTaskNAME, setSelectedSubTaskNAME] = useState("");
  const [selectedTaskNAME1, setSelectedTaskNAME1] = useState("");
  const [selectedProjectNAME1, setSelectedProjectNAME1] = useState("");
  const [selectedSubTaskNAME1, setSelectedSubTaskNAME1] = useState("");
  // State for selected Project, Task, and SubTask
  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [selectedTaskID, setSelectedTaskID] = useState("");
  const [selectedSubTaskID, setSelectedSubTaskID] = useState("");
  const [isTaskClosed, setIsTaskClosed] = useState(false);
  // Additional details state
  const [additionalDetails, setAdditionalDetails] = useState(null);
  const [scheduleDetails, setScheduleDetails] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (showTabModal) {
      fetchProjectDetails(); // Fetch project details
      fetchAdditionalDetails(taskID); // Fetch additional details
      fetchScheduleTasksDetails(taskID); // Fetch schedule details
    }
  }, [showTabModal]);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Fetch projects based on userID and current date
  const fetchProjectDetails = async () => {
    try {
      const todaysDate = getCurrentDate();

      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetEntryDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userID: employeeId,
            inputDate: todaysDate
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.data?.listProjectDetailsEntity) {
        const options = data.data.listProjectDetailsEntity.map((item) => ({
          key: item.projectID,
          text: item.projectName
        }));
        setProjects(options);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Fetch tasks for a specific project
  const fetchTasks = async (projectID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDADetailsDropDown?UserID=${employeeId}&ProjectID=${projectID}&FieldName=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      setTasks(data.data.listTimesheetEntryDropDown || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch subtasks for a specific task using updated API
  const fetchSubTasks = async (taskId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetDASubTaskDropDown?TaskID=${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setSubTasks(data.data.listTimesheetEntrySubTask || []);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };

  // Fetch additional details when a task is selected and map the response
  const fetchAdditionalDetails = async (taskID) => {
    // debugger;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetAdditionalDetails?TaskID=${taskID}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (data?.data?.listAdditinalTaskDetail) {
        const details = data.data.listAdditinalTaskDetail[0]; // Assuming we only need the first item

        // const formattedDate = now.toISOString().split("T")[0];
        const now = new Date();

        setStartDate1(now.toISOString().split("T")[0]);

        setSelectedProjectID(details.projectID);

        setSelectedTaskID(details.taskID);

        setSelectedSubTaskID(details.subTaskType);

        setReason1("00:00");
        setAdditionalDetails({
          taskID: details.taskID,
          projectID: details.projectID,
          projectName: details.projectName,
          taskName: details.taskName,
          work: details.work,
          etc: details.etc,
          startDate: new Date(details.startDate).toISOString().split("T")[0], // Format date
          reason: details.reason,
          actualWork: details.actualWork
        });
      }
    } catch (error) {
      console.error("Error fetching additional details:", error);
    }
  };

  // Fetch schedule details when a task is selected and map the response
  const fetchScheduleTasksDetails = async (taskID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetScheduleTasksDetails?TaskID=${taskID}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (data?.data?.listScheduleTaskDetail) {
        const details = data.data.listScheduleTaskDetail[0]; // Assuming we only need the first item

        const date = new Date(details.startDate);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
        setStartDate(formattedDate);

        // setStartDate(new Date(details.startDate).toISOString().split("T")[0]);

        // setPostTillDate(new Date(details.postWorkHrs).toISOString().split("T")[0]);
        setAllocatedTime("00:00");
        setSelectedProjectID1(details.projectID);
        fetchTasks(details.projectID);
        setSelectedTaskID1(details.taskID);
        setReason(details.reason);
        setIsTaskClosed(details.isTaskComplete);
        setScheduleDetails({
          taskID: details.taskID,
          employeeID: details.employeeID,
          postWorkHrs: details.postWorkHrs,
          startDate: new Date(details.startDate).toISOString().split("T")[0], // Format date
          postEndDate: details.postEndDate,
          projectName: details.projectName,
          taskName: details.taskName,
          subTaskType: details.subTaskType,
          work: details.work,
          isTaskComplete: details.isTaskComplete
        });
      }
    } catch (error) {
      console.error("Error fetching schedule details:", error);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!postTillDate) {
      toast.error("Post Till Date is required.");
      return;
    }

    if (!startDate) {
      toast.error("Start Date is required.");
      return;
    }

    if (!allocatedTime) {
      toast.error("Hours to Post is required.");
      return;
    }

    if (isTaskClosed === undefined) {
      toast.error("Close task after end date status is required.");
      return;
    }
    const scheduleData = {
      taskID,
      employeeId,
      startDate,
      postEndDate: postTillDate,
      projectID: selectedProjectID,
      taskID: selectedTaskID,
      subTaskID: selectedSubTaskID,
      workHrs: allocatedTime,
      isTaskComplete: isTaskClosed
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/PostScheduleTasksDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(scheduleData)
        }
      );

      const responseData = await response.json();
      console.log("responseData", responseData.data);

      // Check for validation messages in the response
      const validationErrors = responseData?.data
        ?.filter((item) => item.validationMessage) // Extract items with validation messages
        .map((item) => item.validationMessage) // Extract the validation messages
        .join(", "); // Combine multiple messages into a single string

      if (validationErrors === "Success") {
        // If validation message is "Success", proceed with success
        toast("Post Schedule details saved successfully", { type: "success" });
        handleCloseTabModal();
        setScheduleDetails(null);
        close();
      } else if (validationErrors) {
        // Show validation messages in a toast if present (error case)
        toast(`${validationErrors}`, { type: "error" });
      } else {
        // Fallback if no validation message exists
        toast("Unexpected response. Please try again.", { type: "error" });
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
    }
  };

  const handleRequestSubmit = async () => {
    if (!startDate) {
      toast.error("Start Date is required.");
      return;
    }

    if (!reason1) {
      toast.error("Request Time should not be left blank");
      return;
    }

    // if (!reason) {
    //   toast.error("Request Time: is required.");
    //   return;
    // }

    const requestData = {
      taskID,
      employeeId,
      entryDate: startDate,
      etcHours: reason1,
      reason: reason ? reason : ""
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/PostAdditionalTaskDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        }
      );

      const responseBody = await response.json();

      // Access the data array from the response
      const mailEntities = responseBody.data;

      if (mailEntities && mailEntities.length > 0) {
        for (const mail of mailEntities) {
          const { result, fromEmailID, toEmailID, ccEmailID, subject, body } = mail;

          if (result.toLowerCase() === "success" && fromEmailID) {
            toast.success("Timesheet submitted successfully");
            close();
            // handleCloseTabModal();
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
          } else {
            if (
              result ==
              "The value of the Request Time cannot be 0The value of the Request Time cannot be blank."
            ) {
              const handledresult =
                "The value of the Request Time cannot be 0. The value of the Request Time cannot be blank.";
              toast.error(`Error: ${handledresult || "Failed to submit timesheet details"}`);
            } else {
              toast.error(`Error: ${result || "Failed to submit timesheet details"}`);
            }
          }
        }
      } else {
        toast.error("No mail entities found.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing the request.");
    }
  };
  const close = () => {
    setAdditionalDetails(null);
    setScheduleDetails(null);
    setPostTillDate("");
    setReason1("");
    setReason("");
    handleCloseTabModal();
  };
  return (
    <Modal show={showTabModal} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Actions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={selectedTab} onSelect={handleTabSelect}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="schedule">Schedule Time Entry</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="request">Request Additional Time</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="mt-3">
            {/* Schedule Time Entry Tab */}
            <Tab.Pane eventKey="schedule">
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Start Date:</label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Post Till Date:</label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    value={postTillDate}
                    onChange={(e) => setPostTillDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Project:</label>
                </div>
                <div className="col-sm-8">{scheduleDetails?.projectName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Task:</label>
                </div>
                <div className="col-sm-8">{scheduleDetails?.taskName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Sub Task:</label>
                </div>
                <div className="col-sm-8">{scheduleDetails?.subTaskType}</div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Hours to Post:</label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={allocatedTime}
                    onChange={(e) => setAllocatedTime(e.target.value)}
                  />
                </div>
                <div className="row mb-3 mt-2">
                  <div className="col-sm-4 d-flex align-items-center justify-content-center">
                    <label>Close task after end date:</label>
                  </div>
                  <div className="col-sm-8">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="closeTaskCheckbox"
                        checked={isTaskClosed}
                        onChange={(e) => setIsTaskClosed(e.target.checked)} // Update state
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" className="me-2" onClick={handleScheduleSubmit}>
                  Schedule
                </Button>
                <Button variant="secondary" onClick={close}>
                  Close
                </Button>
              </div>
            </Tab.Pane>

            {/* Request Additional Time Tab */}
            <Tab.Pane eventKey="request">
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Select Start Date:</label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate1}
                    onChange={(e) => setStartDate1(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Project:</label>
                </div>
                <div className="col-sm-8">{additionalDetails?.projectName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Task:</label>
                </div>
                <div className="col-sm-8">{additionalDetails?.taskName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center justify-content-center">
                  <label>Allocated Time:</label>
                </div>
                <div className="col-sm-8">{additionalDetails?.work}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center jtext-end">
                  <label>Request Time:</label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={reason1}
                    onChange={(e) => setReason1(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4 d-flex align-items-center jtext-end">
                  <label>Reason for Request:</label>
                </div>
                <div className="col-sm-8">
                  <textarea
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" className="me-2" onClick={handleRequestSubmit}>
                  Request
                </Button>
                <Button variant="secondary" onClick={close}>
                  Close
                </Button>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default TabModal;
