import React, { useState, useEffect } from "react";
import { Button, Tooltip, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const ProjectTaskTable = ({
  date,
  timesheetData,
  handleProjectSelect,
  handleInfoIconClick,
  handleTabIconClick,
  handleShowDaTypeModal,
  setTimesheetData,
  previousEfforts,
  setPreviousEfforts,
  previousEfforts1,
  dayNames,
  dayDates,
  totalHours,
  clearinitalvaluesflag,
  handleclearinitalvaluesflag,
  refresh1,
  setStart,
  setEnd,
  setPreviousData,
  isFetchedPrevvalue,
  // setisFetchedPrevvalue
}) => {
  const [editingTask, setEditingTask] = useState({}); // Tracks which task/field is being edited
  const [fetchedTaskDetails, setFetchedTaskDetails] = useState(null);
  const [currentTaskID, setCurrentTaskID] = useState(null); // Tracks current task for tooltip
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.data?.employeeId;
  const [selectedTasks, setSelectedTasks] = useState([]); // Tracks selected task IDs for quick entry
  const [quickEntryValues, setQuickEntryValues] = useState("");
  const [projects, setProjects] = useState({});
  const [intermediateValues, setIntermediateValues] = useState({});

  // const [refreshTasktable,SetrefreshTasktable]

  const clearinitalvalues = async () => {
    await setSelectedTasks([]);
    setQuickEntryValues("");

    document.querySelectorAll(".parentCheckbox").forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  //Added by Parth.G
  useEffect(() => {
    if (clearinitalvaluesflag) {
      // alert("1a");
      clearinitalvalues();
      handleclearinitalvaluesflag();
    }
  });

  useEffect(() => {
    // alert("1");
    clearinitalvalues();
  }, []);

  //Ended by Parth.G

  const extractTimes = (dateStr) => {
    // Split by the '|' character to separate the date and the time range
    const timeRange = dateStr?.split("|")[1];

    // Use a regular expression to capture the start and end times
    const regex = /(\d{2}:\d{2} [APM]{2}) - (\d{2}:\d{2} [APM]{2})/;
    const matches = regex.exec(timeRange);

    if (matches) {
      return {
        startTime: matches[1],
        endTime: matches[2],
      };
    }
    return {};
  };

  const { startTime, endTime } = extractTimes(dayDates[1]);

  const formatTime = (timeStr) => {
    // Check if timeStr is a valid string before splitting
    if (!timeStr) {
      return { hour: "", minute: "", period: "" }; // Return empty values if timeStr is not valid
    }

    const [time, period] = timeStr.split(" ");
    const [hour, minute] = time.split(":");
    return { hour, minute, period };
  };

  const start = formatTime(startTime);
  const end = formatTime(endTime);
  sessionStorage.setItem("start", formatTime(startTime)); // Stores "08:30 AM"
  sessionStorage.setItem("end", formatTime(endTime));
  console.log("formatTime11", start, end);

  const fetchProjectDetails = async () => {
    var finaldate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");
    var tryDate = date.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetWeekHeader?InputDate=${finaldate}&UserID=${UserID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Add token if required
          },
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

  const fetchTaskDetails = (taskID) => {
    const token = sessionStorage.getItem("token");
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheettaskDetails?UserID=${UserID}&TaskID=${taskID}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFetchedTaskDetails(response.data.data.listTimestTaskDetail[0]);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  };

  const toggleEdit = (taskID, field, day) => {
    setEditingTask((prevState) => ({
      ...prevState,
      [`${taskID}-${day}`]: {
        ...prevState[`${taskID}-${day}`],
        field: !prevState[`${taskID}-${day}`]?.field, // Toggle edit state for the field
      },
    }));
  };

  const handleSaveEdit = async (e, taskID, day, newValue) => {
    if (!newValue) return;

    // Find the task to update
    const updatedTimesheetData = timesheetData.listProjectDetailsEntity.map(
      (project) => {
        return {
          ...project,
          listTaskDetailsEntity: project.listTaskDetailsEntity.map((task) => {
            if (task.taskID === taskID) {
              return {
                ...task,
                [`dayEfforst${day}`]: newValue, // Update the specific dayEfforst field
              };
            }
            return task;
          }),
        };
      }
    );

    // Update the state to reflect the changes
    setTimesheetData((prevState) => ({
      ...prevState,
      listProjectDetailsEntity: updatedTimesheetData,
    }));

    // Update the previousEfforts state
    const foundTask = timesheetData.listProjectDetailsEntity
      .flatMap((project) => project.listTaskDetailsEntity)
      .find((task) => task.taskID === taskID);

    // if (foundTask) {
    //   await setPreviousData((prev) => ({
    //     ...prev,
    //     [`${taskID}-${day}`]: foundTask[`dayEfforst${day}`] || "00:00"
    //   }));
    // }

    if (foundTask) {
      setPreviousEfforts({
        [`${taskID}-${day}`]: foundTask[`dayEfforst${day}`] || "00:00",
      });
    }

    // console.log("parthbaby", previousEfforts);

    // Clear the intermediate value
    setIntermediateValues((prev) => {
      const newValues = { ...prev };
      delete newValues[`${taskID}-${day}`];
      return newValues;
    });

    // if (!isFetchedPrevvalue.current) {
    //   const foundTask = timesheetData.listProjectDetailsEntity
    //     .flatMap((project) => project.listTaskDetailsEntity)
    //     .find((task) => task.taskID === taskID);

    //   if (foundTask) {
    //     await setPreviousEfforts({
    //       [`${taskID}-${day}`]: foundTask[`dayEfforst${day}`] || "00:00"
    //     });
    //   }
    //   // setisFetchedPrevvalue(true);
    //   isFetchedPrevvalue.current = true;
    // }

    // //Ended by Parth.G

    // const updatedTimesheetData = timesheetData.listProjectDetailsEntity.map((project) => {
    //   return {
    //     ...project,
    //     listTaskDetailsEntity: project.listTaskDetailsEntity.map((task) => {
    //       if (task.taskID === taskID) {
    //         return {
    //           ...task,
    //           [`dayEfforst${day}`]: newValue // Update the specific dayEfforst field
    //         };
    //       }
    //       return task;
    //     })
    //   };
    // });

    // // Update the state to reflect the changes
    // console.log("Before timesheetData update:", timesheetData);
    // setTimesheetData((prevState) => ({
    //   ...prevState,
    //   listProjectDetailsEntity: updatedTimesheetData
    // }));
    // console.log("After timesheetData update:", timesheetData);
  };

  console.log("timesheetData", timesheetData);
  const handleCheckboxChange = (taskID) => {
    setSelectedTasks((prevState) => {
      const updatedSelectedTasks = prevState.includes(taskID)
        ? prevState.filter((id) => id !== taskID) // Deselect if already selected
        : [...prevState, taskID]; // Add to selected if not selected

      // Store updated selected tasks in sessionStorage
      sessionStorage.setItem(
        "selectedTasks",
        JSON.stringify(updatedSelectedTasks)
      );

      return updatedSelectedTasks;
    });
  };

  const handleQuickEntryClick = (value, projectId) => {
    const hhmmRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/; // Regex for hh:mm format (24-hour)

    if (selectedTasks.length === 0) {
      toast.error("Please select at least one task");
      return;
    }

    if (!hhmmRegex.test(quickEntryValues)) {
      toast.error("Please enter time in HH:MM format");
      return;
    }

    // Map through the project list to update the targeted project
    const updatedTimesheetData = timesheetData?.listProjectDetailsEntity.map(
      (project) => {
        // Map through the tasks in the project to update the ones that are selected
        return {
          ...project,
          listTaskDetailsEntity: project.listTaskDetailsEntity.map((task) => {
            if (selectedTasks.includes(task.taskID)) {
              console.log(`Updating taskID: ${task.taskID}`); // Log task ID being updated

              // Dynamically update dayEfforts fields (1 to 7)
              const days = ["1", "2", "3", "4", "5"];
              days.forEach((day) => {
                const dayEffortsField = `dayEfforst${day}`; // e.g., dayEfforst1, dayEfforst2, etc.

                // Check if the field exists before updating it
                if (task.hasOwnProperty(dayEffortsField)) {
                  console.log(
                    `Updating ${dayEffortsField} for taskID: ${task.taskID} with value: ${value}`
                  );
                  task[dayEffortsField] = value; // Update the field with the passed value
                }
              });
            }
            return task; // Return the updated task
          }),
        };
      }
    );

    // Log the updated state before setting
    console.log("Updated Timesheet Data:", updatedTimesheetData);

    // Update state with the modified timesheet data
    setTimesheetData((prevData) => ({
      ...prevData,
      listProjectDetailsEntity: updatedTimesheetData,
    }));
  };

  useEffect(() => {
    console.log("timesheetData", timesheetData);
  }, [selectedTasks]);
  useEffect(() => {
    fetchProjectDetails();
    console.log("timesheetData", timesheetData);
  }, [date]);

  useEffect(() => {
    if (timesheetData?.listProjectDetailsEntity?.length == 0) {
    }
  }, [date]);

  return (
    <tbody>
      <tr className="stickyHeader">
        <td className="col-sm-2 topBrdr">
          <div className="topProjectDetls">
            {/* Time Select */}
            <div className="fromToTimeSec greySec mb-2">
              <div className="row mb-1 gx-1">
                <label className="col-sm-5 text-end mt-2">From Time</label>
                <div className="col-sm-7 d-flex">
                  <select className="selectpicker" disabled>
                    <option>{start.hour}</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i}>{i.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                  <select className="selectpicker" disabled>
                    <option>{start.minute}</option>
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row gx-1">
                <label className="col-sm-5 text-end mt-2">To Time</label>
                <div className="col-sm-7 d-flex">
                  <select className="selectpicker" disabled>
                    <option>{end.hour}</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i}>{i.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                  <select className="selectpicker" disabled>
                    <option>{end.minute}</option>
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row gx-1 mb-2">
              <div className="col-sm-12">
                <div className="form-floating my-2 position-relative">
                  <span className="txt_Blue">Quick Entry</span>
                  <input
                    type="text"
                    label="Quick Entry"
                    className="form-control ml-2 pe-5"
                    defaultValue="00:00"
                    maxLength="5"
                    value={quickEntryValues}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 2) {
                        value =
                          value.substring(0, 2) + ":" + value.substring(2, 4);
                      }
                      if (value.length > 5) {
                        value = value.substring(0, 5);
                      }
                      if (value.length >= 3) {
                        const hours = parseInt(value.substring(0, 2), 10);
                        if (hours > 23) {
                          value = "23" + value.substring(2);
                        }
                      }
                      if (value.length === 5) {
                        const minutes = parseInt(value.substring(3), 10);
                        if (minutes > 59) {
                          value = value.substring(0, 3) + "59";
                        }
                      }
                      setQuickEntryValues(value);
                    }}
                    style={{ width: "69%" }}
                    placeholder="HH:MM"
                  />
                  <button
                    className="btn d-flex mt-2 align-items-center justify-content-center rounded-circle p-0 position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      width: "30px",
                      height: "30px",
                      fontSize: "20px",
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
                      transition: "box-shadow 0.3s ease",
                    }}
                    onClick={() => handleQuickEntryClick(quickEntryValues)}
                    onMouseEnter={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 10px rgba(0, 123, 255, 1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 5px rgba(0, 123, 255, 0.5)")
                    }
                  >
                    <i
                      className="fas fa-check"
                      style={{ color: "#007bff" }}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>

        {/* Dynamic Day Cards */}
        {dayNames.map((dayName, dayIndex) => {
          const project = Array.isArray(projects)
            ? projects.find((p) => p.days === `Day${dayIndex + 1}`)
            : null;

          const dayType = project ? project.dayType : "NormalDay";
          let className = "topOrangeBrdr";
          if (dayType === "WeekEnd") {
            className = "topGreyBrdr";
          } else if (dayType == "Leave") {
            className = "cardBlueBrdr";
          } else if (dayType == "Holiday") {
            className = "cardSkyBlueBrdr";
          }

          return (
            <td className={className} key={dayIndex}>
              <div className="topDaySection">
                <div className="cardHeader text-center py-2">
                  <div className="dayTitle font-weight-600 mb-2">{dayName}</div>
                  <div className="dateTitle">
                    {dayDates[dayIndex].split("|")[0]}
                  </div>
                  <div className="dateTitle" style={{ fontSize: "10px" }}>
                    {dayDates[dayIndex].split("|")[1]}
                  </div>
                  <div className="timeTitle">{totalHours[dayIndex]}</div>
                </div>
              </div>
            </td>
          );
        })}
      </tr>

      {timesheetData?.listProjectDetailsEntity?.map(
        (project) =>
          project?.listTaskDetailsEntity?.length == 0 || (
            <>
              {/* Project Name Row kam baki hai*/}
              <tr key={project.projectID}>
                <td className="projectNameRow">
                  <Button
                    className="TaskAccBtn"
                    onClick={() => handleProjectSelect(project)}
                  >
                    <Tooltip title={project.projectName}>
                      <span>
                        {project.projectName.length > 19
                          ? `${project.projectName.substring(0, 19)}...`
                          : project.projectName}
                      </span>
                    </Tooltip>
                  </Button>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              {/* Task Rows */}
              {project?.listTaskDetailsEntity?.map((task) => (
                <tr key={task.taskID}>
                  <td>
                    <div
                      className="taskRow d-flex px-3 position-relative"
                      style={{ marginBottom: "30px", alignItems: "center" }}
                    >
                      <input
                        className="parentCheckbox me-2"
                        type="checkbox"
                        disabled={
                          task.isTaskComplete == true || task.isVoid == true
                        }
                        onChange={() => handleCheckboxChange(task.taskID)}
                        style={{ marginLeft: "0" }}
                      />
                      <span
                        onClick={() => toggleEdit(task.taskID, "taskName")}
                        style={{
                          cursor: "pointer",
                          textAlign: "left",
                          width: "auto",
                        }}
                      >
                        <Tooltip title={task.taskName}>
                          <div style={{ width: "auto" }}>
                            <span>
                              {task.taskName.length > 26
                                ? `${task.taskName.substring(0, 19)}...`
                                : task.taskName}
                            </span>
                          </div>
                        </Tooltip>
                      </span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <Tooltip
                          title={
                            fetchedTaskDetails &&
                            currentTaskID === task.taskID ? (
                              <div style={{ width: "300px" }}>
                                <div className="row">
                                  <div className="col-sm-6 text-end">
                                    Start Date:
                                  </div>
                                  <div className="col-sm-6">
                                    {fetchedTaskDetails?.startDate
                                      ? fetchedTaskDetails.startDate
                                      : "N/A"}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-sm-6 text-end">
                                    End Date:
                                  </div>
                                  <div className="col-sm-6">
                                    {fetchedTaskDetails?.endDate
                                      ? fetchedTaskDetails.endDate
                                      : "N/A"}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-sm-6 text-end">
                                    Allocated Hours :
                                  </div>
                                  <div className="col-sm-6">
                                    {fetchedTaskDetails?.allocatedHrs || "N/A"}
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-sm-6 text-end">
                                    Actual Effort:
                                  </div>
                                  <div className="col-sm-6">
                                    {fetchedTaskDetails?.actualHrs || "N/A"}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              "Loading details..."
                            )
                          }
                          onOpen={() => {
                            setCurrentTaskID(task.taskID);
                            fetchTaskDetails(task.taskID);
                          }}
                        >
                          <span
                            className="infoIconWrapper"
                            style={{ cursor: "pointer" }}
                          >
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              style={{ color: "#007bff" }}
                            />
                          </span>
                        </Tooltip>
                        {task.whichTask == "D" || (
                          <span
                            onClick={() => handleTabIconClick(task)}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                          >
                            <Tooltip title="More Actions">
                              <FontAwesomeIcon icon={faCogs} />
                            </Tooltip>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Day-wise Efforts */}
                  {["1", "2", "3", "4", "5", "6", "7"].map((day) => (
                    <td
                      className="text-center"
                      style={{ fontSize: "18px" }}
                      key={day}
                    >
                      <div className="row">
                        <div
                          className="col-sm-9 pe-0"
                          style={{ textAlign: "right" }}
                        >
                          <TextField
                            disabled={
                              task.isTaskComplete == true ||
                              task.isVoid == true ||
                              task[`timesheetStatusFlag${day}`] == "R" ||
                              task[`timesheetStatusFlag${day}`] == "V"
                            }
                            value={
                              intermediateValues[`${task.taskID}-${day}`] ||
                              task[`dayEfforst${day}`] ||
                              "N/A"
                            }
                            onChange={(e) => {
                              setIntermediateValues((prev) => ({
                                ...prev,
                                [`${task.taskID}-${day}`]: e.target.value,
                              }));
                            }}
                            onBlur={(e) =>
                              handleSaveEdit(
                                e,
                                task.taskID,
                                day,
                                e.target.value
                              )
                            }
                            autoFocus
                            id={`textField-${task.taskID}-${day}`}
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                height: "20px",
                                padding: "2px",
                                fontSize: "12px",
                              },
                            }}
                            style={{
                              width: "70px",
                            }}
                          />
                        </div>
                        <div className="col-sm-3 ps-0">
                          {task[`dayEfforst${day}`] !== "00:00" && (
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              style={{ cursor: "pointer", color: "#007bff" }}
                              onClick={() =>
                                handleShowDaTypeModal({
                                  day,
                                  task,
                                  projectId: task.taskID,
                                })
                              }
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )
      )}
    </tbody>

    //Working god but all task are allinged with project name
    // <tbody>
    //   <tr className="stickyHeader">
    //     <td className="col-sm-2 topBrdr">
    //       <div className="topProjectDetls">
    //         {/* Time Select */}
    //         <div className="fromToTimeSec greySec mb-2">
    //           <div className="row mb-1 gx-1">
    //             <label className="col-sm-5 text-end mt-2">From Time</label>
    //             <div className="col-sm-7 d-flex">
    //               <select className="selectpicker" disabled>
    //                 <option>{start.hour}</option>
    //                 {[...Array(24)].map((_, i) => (
    //                   <option key={i}>{i.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //               <select className="selectpicker" disabled>
    //                 <option>{start.minute}</option>
    //                 {[0, 15, 30, 45].map((m) => (
    //                   <option key={m}>{m.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //           <div className="row gx-1">
    //             <label className="col-sm-5 text-end mt-2">To Time</label>
    //             <div className="col-sm-7 d-flex">
    //               <select className="selectpicker" disabled>
    //                 <option>{end.hour}</option>
    //                 {[...Array(24)].map((_, i) => (
    //                   <option key={i}>{i.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //               <select className="selectpicker" disabled>
    //                 <option>{end.minute}</option>
    //                 {[0, 15, 30, 45].map((m) => (
    //                   <option key={m}>{m.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="row gx-1 mb-2">
    //           <div className="col-sm-12">
    //             <div className="form-floating my-2 position-relative">
    //               <span className="txt_Blue">Quick Entry</span>
    //               <input
    //                 type="text"
    //                 label="Quick Entry"
    //                 className="form-control ml-2 pe-5"
    //                 defaultValue="00:00"
    //                 maxLength="5"
    //                 value={quickEntryValues}
    //                 onChange={(e) => {
    //                   let value = e.target.value.replace(/\D/g, "");
    //                   if (value.length > 2) {
    //                     value = value.substring(0, 2) + ":" + value.substring(2, 4);
    //                   }
    //                   if (value.length > 5) {
    //                     value = value.substring(0, 5);
    //                   }
    //                   if (value.length >= 3) {
    //                     const hours = parseInt(value.substring(0, 2), 10);
    //                     if (hours > 23) {
    //                       value = "23" + value.substring(2);
    //                     }
    //                   }
    //                   if (value.length === 5) {
    //                     const minutes = parseInt(value.substring(3), 10);
    //                     if (minutes > 59) {
    //                       value = value.substring(0, 3) + "59";
    //                     }
    //                   }
    //                   setQuickEntryValues(value);
    //                 }}
    //                 style={{ width: "69%" }}
    //                 placeholder="HH:MM"
    //               />
    //               <button
    //                 className="btn d-flex mt-2 align-items-center justify-content-center rounded-circle p-0 position-absolute top-50 end-0 translate-middle-y"
    //                 style={{
    //                   width: "30px",
    //                   height: "30px",
    //                   fontSize: "20px",
    //                   backgroundColor: "transparent",
    //                   border: "none",
    //                   boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
    //                   transition: "box-shadow 0.3s ease"
    //                 }}
    //                 onClick={() => handleQuickEntryClick(quickEntryValues)}
    //                 onMouseEnter={(e) =>
    //                   (e.target.style.boxShadow = "0 0 10px rgba(0, 123, 255, 1)")
    //                 }
    //                 onMouseLeave={(e) =>
    //                   (e.target.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)")
    //                 }
    //               >
    //                 <i className="fas fa-check" style={{ color: "#007bff" }}></i>
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </td>

    //     {/* Dynamic Day Cards */}
    //     {dayNames.map((dayName, dayIndex) => {
    //       const project = Array.isArray(projects)
    //         ? projects.find((p) => p.days === `Day${dayIndex + 1}`)
    //         : null;

    //       const dayType = project ? project.dayType : "NormalDay";
    //       let className = "topOrangeBrdr";
    //       if (dayType === "WeekEnd") {
    //         className = "topGreyBrdr";
    //       } else if (dayType == "Leave") {
    //         className = "cardBlueBrdr";
    //       } else if (dayType == "Holiday") {
    //         className = "cardSkyBlueBrdr";
    //       }

    //       return (
    //         <td className={className} key={dayIndex}>
    //           <div className="topDaySection">
    //             <div className="cardHeader text-center py-2">
    //               <div className="dayTitle font-weight-600 mb-2">{dayName}</div>
    //               <div className="dateTitle">{dayDates[dayIndex].split("|")[0]}</div>
    //               <div className="dateTitle" style={{ fontSize: "10px" }}>
    //                 {dayDates[dayIndex].split("|")[1]}
    //               </div>
    //               <div className="timeTitle">{totalHours[dayIndex]}</div>
    //             </div>
    //           </div>
    //         </td>
    //       );
    //     })}
    //   </tr>

    //   {timesheetData?.listProjectDetailsEntity?.map((project) =>
    //     project?.listTaskDetailsEntity?.map((task) => (
    //       <tr key={task.taskID}>
    //         <td>
    //           <div className="projectName">
    //             <Button className="TaskAccBtn" onClick={() => handleProjectSelect(project)}>
    //               <Tooltip title={project.projectName}>
    //                 <span>
    //                   {project.projectName.length > 19
    //                     ? `${project.projectName.substring(0, 19)}...`
    //                     : project.projectName}
    //                 </span>
    //               </Tooltip>
    //             </Button>
    //             <div
    //               className="taskRow d-flex px-3 position-relative"
    //               style={{ marginBottom: "30px", alignItems: "center" }}
    //             >
    //               <input
    //                 className="parentCheckbox me-2"
    //                 type="checkbox"
    //                 disabled={task.isTaskComplete == true || task.isVoid == true}
    //                 onChange={() => handleCheckboxChange(task.taskID)}
    //                 style={{ marginLeft: "0" }}
    //               />
    //               <span
    //                 onClick={() => toggleEdit(task.taskID, "taskName")}
    //                 style={{ cursor: "pointer", textAlign: "left", width: "auto" }}
    //               >
    //                 <Tooltip title={task.taskName}>
    //                   <div style={{ width: "auto" }}>
    //                     <span>
    //                       {task.taskName.length > 26
    //                         ? `${task.taskName.substring(0, 19)}...`
    //                         : task.taskName}
    //                     </span>
    //                   </div>
    //                 </Tooltip>
    //               </span>
    //               <div
    //                 style={{
    //                   display: "flex",
    //                   justifyContent: "flex-end",
    //                   alignItems: "center",
    //                   marginLeft: "auto"
    //                 }}
    //               >
    //                 <Tooltip
    //                   title={
    //                     fetchedTaskDetails && currentTaskID === task.taskID ? (
    //                       <div style={{ width: "300px" }}>
    //                         <div className="row">
    //                           <div className="col-sm-6 text-end">Start Date:</div>
    //                           <div className="col-sm-6">
    //                             {fetchedTaskDetails?.startDate
    //                               ? fetchedTaskDetails.startDate
    //                               : "N/A"}
    //                           </div>
    //                         </div>
    //                         <div className="row">
    //                           <div className="col-sm-6 text-end">End Date:</div>
    //                           <div className="col-sm-6">
    //                             {fetchedTaskDetails?.endDate ? fetchedTaskDetails.endDate : "N/A"}
    //                           </div>
    //                         </div>
    //                         <div className="row">
    //                           <div className="col-sm-6 text-end">Allocated Hours :</div>
    //                           <div className="col-sm-6">
    //                             {fetchedTaskDetails?.allocatedHrs || "N/A"}
    //                           </div>
    //                         </div>
    //                         <div className="row">
    //                           <div className="col-sm-6 text-end">Actual Effort:</div>
    //                           <div className="col-sm-6">
    //                             {fetchedTaskDetails?.actualHrs || "N/A"}
    //                           </div>
    //                         </div>
    //                       </div>
    //                     ) : (
    //                       "Loading details..."
    //                     )
    //                   }
    //                   onOpen={() => {
    //                     setCurrentTaskID(task.taskID);
    //                     fetchTaskDetails(task.taskID);
    //                   }}
    //                 >
    //                   <span className="infoIconWrapper" style={{ cursor: "pointer" }}>
    //                     <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#007bff" }} />
    //                   </span>
    //                 </Tooltip>
    //                 {task.whichTask == "D" || (
    //                   <span
    //                     onClick={() => handleTabIconClick(task)}
    //                     style={{ cursor: "pointer", marginLeft: "10px" }}
    //                   >
    //                     <Tooltip title="More Actions">
    //                       <FontAwesomeIcon icon={faCogs} />
    //                     </Tooltip>
    //                   </span>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </td>

    //         {/* Day-wise Efforts */}
    //         {["1", "2", "3", "4", "5", "6", "7"].map((day) => (
    //           <td className="text-center" style={{ fontSize: "18px" }} key={day}>
    //             <div style={{ marginTop: "42px" }}>
    //               <TextField
    //                 disabled={
    //                   task.isTaskComplete == true ||
    //                   task.isVoid == true ||
    //                   task[`timesheetStatusFlag${day}`] == "R" ||
    //                   task[`timesheetStatusFlag${day}`] == "V"
    //                 }
    //                 value={
    //                   intermediateValues[`${task.taskID}-${day}`] ||
    //                   task[`dayEfforst${day}`] ||
    //                   "00:00" //Added by parth.G
    //                 }
    //                 onChange={(e) => {
    //                   setIntermediateValues((prev) => ({
    //                     ...prev,
    //                     [`${task.taskID}-${day}`]: e.target.value
    //                   }));
    //                 }}
    //                 onBlur={(e) => handleSaveEdit(e, task.taskID, day, e.target.value)}
    //                 autoFocus
    //                 id={`textField-${task.taskID}-${day}`}
    //                 InputProps={{
    //                   disableUnderline: true,
    //                   style: {
    //                     height: "20px",
    //                     padding: "2px",
    //                     fontSize: "12px"
    //                   }
    //                 }}
    //                 style={{
    //                   width: "70px"
    //                 }}
    //               />
    //               {task[`dayEfforst${day}`] !== "00:00" && (
    //                 <FontAwesomeIcon
    //                   icon={faInfoCircle}
    //                   style={{ cursor: "pointer", color: "#007bff", marginLeft: "10px" }}
    //                   onClick={() => handleShowDaTypeModal({ day, task, projectId: task.taskID })}
    //                 />
    //               )}
    //             </div>
    //           </td>
    //         ))}
    //       </tr>
    //     ))
    //   )}
    // </tbody>

    //Exisiting Code
    // <tbody>
    //   <tr className="stickyHeader">
    //     <td className="col-sm-2 topBrdr">
    //       <div className="topProjectDetls">
    //         {/* Time Select */}
    //         <div className="fromToTimeSec greySec mb-2">
    //           <div className="row mb-1 gx-1">
    //             <label className="col-sm-5 text-end mt-2">From Time</label>
    //             <div className="col-sm-7 d-flex">
    //               <select className="selectpicker" disabled>
    //                 <option>{start.hour}</option>
    //                 {[...Array(24)].map((_, i) => (
    //                   <option key={i}>{i.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //               <select className="selectpicker" disabled>
    //                 <option>{start.minute}</option>
    //                 {[0, 15, 30, 45].map((m) => (
    //                   <option key={m}>{m.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //           <div className="row gx-1">
    //             <label className="col-sm-5 text-end mt-2">To Time</label>
    //             <div className="col-sm-7 d-flex">
    //               <select className="selectpicker" disabled>
    //                 <option>{end.hour}</option>
    //                 {[...Array(24)].map((_, i) => (
    //                   <option key={i}>{i.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //               <select className="selectpicker" disabled>
    //                 <option>{end.minute}</option>
    //                 {[0, 15, 30, 45].map((m) => (
    //                   <option key={m}>{m.toString().padStart(2, "0")}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="row gx-1 mb-2">
    //           <div className="col-sm-12">
    //             <div className="form-floating my-2 position-relative">
    //               <span className="txt_Blue">Quick Entry</span>
    //               <input
    //                 type="text"
    //                 label="Quick Entry"
    //                 className="form-control ml-2 pe-5" // Add padding-end for the icon
    //                 defaultValue="00:00"
    //                 maxLength="5" // Restrict length to 5 (hh:mm)
    //                 value={quickEntryValues} // Bind the value to the state for controlled input
    //                 onChange={(e) => {
    //                   let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    //                   // Automatically add colon after 2 digits
    //                   if (value.length > 2) {
    //                     value = value.substring(0, 2) + ":" + value.substring(2, 4); // Keep first 2 digits, add colon and the next 2 digits
    //                   }

    //                   // Limit the value to 5 characters (hh:mm)
    //                   if (value.length > 5) {
    //                     value = value.substring(0, 5); // Ensure no more than 5 characters
    //                   }

    //                   // Ensure hours are in the valid 24-hour range (00-23)
    //                   if (value.length >= 3) {
    //                     const hours = parseInt(value.substring(0, 2), 10);
    //                     if (hours > 23) {
    //                       value = "23" + value.substring(2); // Limit hours to 23
    //                     }
    //                   }

    //                   // Ensure minutes are in the valid range (00-59)
    //                   if (value.length === 5) {
    //                     const minutes = parseInt(value.substring(3), 10);
    //                     if (minutes > 59) {
    //                       value = value.substring(0, 3) + "59"; // Limit minutes to 59
    //                     }
    //                   }

    //                   setQuickEntryValues(value); // Update the state with the formatted value
    //                 }}
    //                 style={{ width: "69%" }}
    //                 placeholder="HH:MM" // Placeholder for user guidance
    //               />

    //               <button
    //                 className="btn d-flex mt-2 align-items-center justify-content-center rounded-circle p-0 position-absolute top-50 end-0 translate-middle-y"
    //                 style={{
    //                   width: "30px", // Adjust button size
    //                   height: "30px", // Make it a perfect circle
    //                   fontSize: "20px", // Adjust icon size
    //                   backgroundColor: "transparent",
    //                   border: "none",
    //                   boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)", // Subtle glow effect
    //                   transition: "box-shadow 0.3s ease" // Smooth transition for glow
    //                 }}
    //                 onClick={() => handleQuickEntryClick(quickEntryValues)}
    //                 onMouseEnter={(e) =>
    //                   (e.target.style.boxShadow = "0 0 10px rgba(0, 123, 255, 1)")
    //                 } // Stronger glow on hover
    //                 onMouseLeave={(e) =>
    //                   (e.target.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)")
    //                 } // Back to subtle glow
    //               >
    //                 <i className="fas fa-check" style={{ color: "#007bff" }}></i>
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </td>

    //     {/* Dynamic Day Cards */}
    //     {dayNames.map((dayName, dayIndex) => {
    //       const project = Array.isArray(projects)
    //         ? projects.find((p) => p.days === `Day${dayIndex + 1}`)
    //         : null; // Check if projects is an array

    //       // Set the class based on the dayType
    //       const dayType = project ? project.dayType : "NormalDay"; // Default to "NormalDay" if not found

    //       let className = "topOrangeBrdr";
    //       if (dayType === "WeekEnd") {
    //         className = "topGreyBrdr"; // Apply class for weekends
    //       } else if (dayType == "Leave") {
    //         className = "cardBlueBrdr"; // Apply class for leave
    //       } else if (dayType == "Holiday") {
    //         className = "cardSkyBlueBrdr"; // Apply class for holiday
    //       }

    //       return (
    //         <td className={className} key={dayIndex}>
    //           <div className="topDaySection">
    //             <div className="cardHeader text-center py-2">
    //               <div className="dayTitle font-weight-600 mb-2">{dayName}</div>
    //               <div className="dateTitle">{dayDates[dayIndex].split("|")[0]}</div>
    //               <div className="dateTitle" style={{ fontSize: "10px" }}>
    //                 {dayDates[dayIndex].split("|")[1]}
    //               </div>

    //               <div className="timeTitle">{totalHours[dayIndex]}</div>
    //             </div>
    //           </div>
    //         </td>
    //       );
    //     })}
    //   </tr>

    //   {timesheetData?.listProjectDetailsEntity?.map(
    //     (project) =>
    //       project?.listTaskDetailsEntity?.length == 0 || (
    //         <tr key={project.projectID}>
    //           <td>
    //             <div className="projectName">
    //               <Button className="TaskAccBtn" onClick={() => handleProjectSelect(project)}>
    //                 <Tooltip title={project.projectName}>
    //                   <span>
    //                     {project.projectName.length > 19
    //                       ? `${project.projectName.substring(0, 19)}...`
    //                       : project.projectName}
    //                   </span>
    //                 </Tooltip>
    //               </Button>

    //               {project?.listTaskDetailsEntity?.map((task) => (
    //                 <div
    //                   key={task.taskID}
    //                   className="taskRow d-flex px-3 position-relative"
    //                   style={{ marginBottom: "30px", alignItems: "center" }}
    //                 >
    //                   <input
    //                     className="parentCheckbox me-2"
    //                     type="checkbox"
    //                     disabled={task.isTaskComplete == true || task.isVoid == true}
    //                     onChange={() => handleCheckboxChange(task.taskID)}
    //                     style={{ marginLeft: "0" }} // Ensure no extra margin on the left
    //                   />
    //                   {/* Editable Task Name */}
    //                   <span
    //                     onClick={() => toggleEdit(task.taskID, "taskName")}
    //                     style={{ cursor: "pointer", textAlign: "left", width: "auto" }}
    //                   >
    //                     <Tooltip title={task.taskName}>
    //                       <div style={{ width: "auto" }}>
    //                         <span>
    //                           {task.taskName.length > 26
    //                             ? `${task.taskName.substring(0, 19)}...`
    //                             : task.taskName}
    //                         </span>
    //                       </div>
    //                     </Tooltip>
    //                   </span>

    //                   {/* Tooltip for task details */}
    //                   <div
    //                     style={{
    //                       display: "flex",
    //                       justifyContent: "flex-end",
    //                       alignItems: "center",
    //                       marginLeft: "auto" // Push to the right side
    //                     }}
    //                   >
    //                     <Tooltip
    //                       title={
    //                         fetchedTaskDetails && currentTaskID === task.taskID ? (
    //                           <div style={{ width: "300px" }}>
    //                             <div className="row">
    //                               <div className="col-sm-6 text-end">Start Date:</div>
    //                               <div className="col-sm-6">
    //                                 {fetchedTaskDetails?.startDate
    //                                   ? fetchedTaskDetails.startDate
    //                                   : "N/A"}
    //                               </div>
    //                             </div>
    //                             <div className="row">
    //                               <div className="col-sm-6 text-end">End Date:</div>
    //                               <div className="col-sm-6">
    //                                 {fetchedTaskDetails?.endDate
    //                                   ? fetchedTaskDetails.endDate
    //                                   : "N/A"}
    //                               </div>
    //                             </div>
    //                             <div className="row">
    //                               <div className="col-sm-6 text-end">Allocated Hours :</div>
    //                               <div className="col-sm-6">
    //                                 {fetchedTaskDetails?.allocatedHrs || "N/A"}
    //                               </div>
    //                             </div>
    //                             <div className="row">
    //                               <div className="col-sm-6 text-end">Actual Effort:</div>
    //                               <div className="col-sm-6">
    //                                 {fetchedTaskDetails?.actualHrs || "N/A"}
    //                               </div>
    //                             </div>
    //                           </div>
    //                         ) : (
    //                           "Loading details..."
    //                         )
    //                       }
    //                       onOpen={() => {
    //                         setCurrentTaskID(task.taskID);
    //                         fetchTaskDetails(task.taskID);
    //                       }}
    //                     >
    //                       <span className="infoIconWrapper" style={{ cursor: "pointer" }}>
    //                         <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#007bff" }} />
    //                       </span>
    //                     </Tooltip>

    //                     {/* //Added by Parth.G */}
    //                     {task.whichTask == "D" || (
    //                       <span
    //                         onClick={() => handleTabIconClick(task)}
    //                         style={{ cursor: "pointer", marginLeft: "10px" }}
    //                       >
    //                         <Tooltip title="More Actions">
    //                           <FontAwesomeIcon icon={faCogs} />
    //                         </Tooltip>
    //                       </span>
    //                     )}
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </td>

    //           {/* Day-wise Efforts */}
    //           {["1", "2", "3", "4", "5", "6", "7"].map((day) => (
    //             <td className="text-center" style={{ fontSize: "18px" }} key={day}>
    //               <div style={{ marginTop: "42px" }}>
    //                 {project?.listTaskDetailsEntity?.map((task, taskIndex) => {
    //                   const isEditing = editingTask[`${task.taskID}-${day}`]?.field;
    //                   const dayEfforts = task[`dayEfforts${day}`] || "N/A";
    //                   // console.log("dayEfforts", task);
    //                   return (
    //                     <div key={taskIndex} style={{ marginBottom: "45px" }}>
    //                       <TextField
    //                         disabled={
    //                           task.isTaskComplete == true ||
    //                           task.isVoid == true ||
    //                           task[`timesheetStatusFlag${day}`] == "R" ||
    //                           task[`timesheetStatusFlag${day}`] == "V" //Added by Parth.G
    //                         }
    //                         //need to handle now
    //                         //value={task[`dayEfforst${day}`] || "N/A"} // Properly accesses the `dayEfforst` field
    //                         value={
    //                           intermediateValues[`${task.taskID}-${day}`] ||
    //                           task[`dayEfforst${day}`] ||
    //                           "N/A"
    //                         } // Use intermediate value if available
    //                         onChange={(e) => {
    //                           // Update the intermediate value
    //                           setIntermediateValues((prev) => ({
    //                             ...prev,
    //                             [`${task.taskID}-${day}`]: e.target.value
    //                           }));
    //                         }}
    //                         onBlur={(e) => handleSaveEdit(e, task.taskID, day, e.target.value)} // Save the final value on blur
    //                         // onChange={(e) => handleSaveEdit(e, task.taskID, day, e.target.value)}
    //                         // onBlur={(e) => handleSaveEdit(task.taskID, day, e.target.value)} // Only updates on losing focus
    //                         // onChange={(e) => setTempValue(e.target.value)} // Temporarily store the input
    //                         // onChange={(e) => handleSaveEdit(e, task.taskID, day, e.target.value)} // Calls `handleSaveEdit` on change
    //                         // onChange={handleSaveEdit(task.taskID, day, this)}
    //                         autoFocus
    //                         id={`textField-${task.taskID}-${day}`} // Adds an ID for each text field
    //                         InputProps={{
    //                           disableUnderline: true, // Hides the default underline (border)
    //                           style: {
    //                             height: "20px", // Adjusts the height of the input element
    //                             padding: "2px", // Adjusts padding to reduce the height further
    //                             fontSize: "12px" // Smaller font size
    //                           }
    //                         }}
    //                         style={{
    //                           width: "70px" // Sets the width of the text field
    //                         }}
    //                       />
    //                       {task[`dayEfforst${day}`] !== "00:00" && ( // Checks if the value is not "00:00"
    //                         <FontAwesomeIcon
    //                           icon={faInfoCircle}
    //                           style={{ cursor: "pointer", color: "#007bff", marginLeft: "10px" }}
    //                           onClick={() =>
    //                             handleShowDaTypeModal({ day, task, projectId: task.taskID })
    //                           } // Handles the info icon click
    //                         />
    //                       )}
    //                     </div>
    //                   );
    //                 })}
    //               </div>
    //             </td>
    //           ))}
    //         </tr>
    //       )
    //   )}
    // </tbody>
  );
};

export default ProjectTaskTable;
