import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FlagIcon from "@mui/icons-material/Flag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import TimesheetDrawer from "./TimesheetDrawer"; // Import the new drawer component

const TodayPriority = ({ tPriority, refrsh, setRefresh }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timesheetData, setTimesheetData] = useState(null);

  const tasks = tPriority?.map((task) => ({
    task: task,
    id: task.taskID,
    title: task.taskName,
    status: task.taskStatus,
    content: task.content,
    icon: task.taskStatus === "Pending" ? NotificationsIcon : FlagIcon
  }));

  const openDrawer = (taskData) => {
    console.log("timesheetData1", taskData);
    setTimesheetData(taskData);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <div className="TasksSection" style={{ maxHeight: "400px", overflow: "hidden" }}>
      <div className="row">
        <div className="currentTaskSec flex-1">
          <div className="secTitle mb-4">Current Tasks (Today)</div>
          <div className="tasksContent">
            {tasks && tasks.length > 0 ? (
              tasks.map((task, index) => {
                const IconComponent = task.icon;

                return (
                  <div className="card mb-2" key={index}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <IconComponent className="pe-2" />
                          <span className="tasksTxt">{task.title}</span>
                        </div>
                        <div
                          className={`badge badgecolor badge${
                            task.status === "Pending" ? "Red" : "Orange"
                          }`}
                          style={{ fontSize: "8px" }}
                        >
                          {task.status}
                        </div>
                      </div>
                      <div
                        className="alert alertTxt d-flex justify-content-between py-1"
                        role="alert"
                        style={{ cursor: "pointer" }} // Add this line
                      >
                        <span>{task.content}</span>
                        <div>
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-success"
                            onClick={() => openDrawer(task)}
                            data-bs-toggle="tooltip"
                            title="Fill the Timesheet"
                            style={{ cursor: "pointer" }} // Ensures the icon also has a pointer
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="alert alert-warning text-center" role="alert">
                No New Task Assigned or Open
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pass props to the TimesheetDrawer component */}
      <TimesheetDrawer
        refrsh={refrsh}
        setRefresh={setRefresh}
        drawerOpen={drawerOpen}
        handleCloseDrawer={handleCloseDrawer}
        id={timesheetData}
      />
    </div>
  );
};

export default TodayPriority;
