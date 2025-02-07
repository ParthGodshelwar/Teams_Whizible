import React, { useEffect, useState } from "react";
import { Drawer, Typography } from "@mui/material";
import Project_blu_icon from "./img/Project_blu_icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const TimesheetDetailDrawer = ({ showDetail, setShowDetail, selectedItem }) => {
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTimesheetDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheet/GetMyTimesheetDetails?TimesheetID=${selectedItem.timesheetID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch timesheet details");
        }

        const data = await response.json();
        const myTimesheetDetails = data.data.myTimesheetDetailsEntity;
        setData(data.data.myTimesheetDetailsEntity);
        console.log("myTimesheetDetails", myTimesheetDetails);
        if (myTimesheetDetails.length > 0) {
          setTasks(
            myTimesheetDetails[0].listProjectDetails.map((project) => ({
              projectName: project.projectName,
              monday: project.listTasksDetails[0]?.mon || "00:00",
              tuesday: project.listTasksDetails[0]?.tue || "00:00",
              wednesday: project.listTasksDetails[0]?.wed || "00:00",
              thursday: project.listTasksDetails[0]?.thu || "00:00",
              friday: project.listTasksDetails[0]?.fri || "00:00",
              saturday: project.listTasksDetails[0]?.sat || "00:00",
              sunday: project.listTasksDetails[0]?.sun || "00:00",
              plannedEffort: project.listTasksDetails[0]?.plannedHour || "--",
              actualEffort: project.listTasksDetails[0]?.actualHour || "--",
              startDate: project.listTasksDetails[0]?.startDate,
              endDate: project.listTasksDetails[0]?.endDate,
              taskName: project.listTasksDetails[0]?.taskName || "Unnamed Task" // Assuming taskName is available
            }))
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (showDetail && selectedItem) {
      fetchTimesheetDetails();
    }
  }, [showDetail, selectedItem, token]);
  console.log("actualHours", data);
  const generateTableHeader = () => {
    if (data.length > 0) {
      const {
        dayoneName,
        daytwoName,
        daythreeName,
        dayfourName,
        dayfiveName,
        daysixName,
        daysevenName
      } = data[0];
      const { dayone, daytwo, daythree, dayfour, dayfive, daysix, dayseven } = data[0];
      return (
        <>
          <th className="">
            {dayoneName} <br /> {dayone}
          </th>
          <th className="">
            {daytwoName} <br /> {daytwo}
          </th>
          <th className="">
            {daythreeName} <br /> {daythree}
          </th>
          <th className="">
            {dayfourName} <br /> {dayfour}
          </th>
          <th className="">
            {dayfiveName} <br /> {dayfive}
          </th>
          <th className="">
            {daysixName} <br /> {daysix}
          </th>
          <th className="">
            {daysevenName} <br /> {dayseven}
          </th>
        </>
      );
    }
    return null;
  };

  // Extract the total hours for each day dynamically
  const getTotalHoursForDay = (day) => {
    return data[0] ? data[0][`total${day}`] : "00:00";
  };
  const formatDate = (dateStr) => {
    console.log("dateStr", dateStr);
    const date = new Date(dateStr);
    if (isNaN(date)) {
      // If the date is invalid, return a fallback value
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-GB"); // Returns dd/mm/yyyy
  };
  return (
    <Drawer
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: "80vw",
          height: "100%",
          overflow: "hidden" // Prevent scrolling on the drawer itself
        }
      }}
      open={showDetail}
      onClose={() => setShowDetail(false)}
    >
      <div className="offcanvas-body">
        <div id="ProjInfo_Sec" className="ProjInfoDetails">
          <div className="graybg container-fluid py-1 mb-2">
            <div className="row">
              <div className="col-sm-6">
                <h5 className="pgtitle">Timesheet Details</h5>
              </div>
              <div className="col-sm-6 text-end">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetail(false)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-between">
            <div className="col-sm-5 ps-3 my-3">
              <span className="fw-500">Week Period -</span> {data[0]?.startDate} to{" "}
              {data[0]?.endDate}
            </div>
            <div className="col-sm-7 ps-3 my-3 text-end">
              <span className="text-end mx-3">
                Week Total | Expected Hours -{" "}
                <span className="text_green fw-500">
                  <FontAwesomeIcon icon={faClock} /> {data[0]?.actualHours} |{" "}
                  {data[0]?.expectedHours}{" "}
                </span>
              </span>
              <span className="text-end mx-3">
                Timesheet Status -{" "}
                <span className="text-green fw-500">{data[0]?.timesheetStatus}</span>
              </span>
            </div>
          </div>
          <div className="form-group mb-2">
            <div className="row">
              <div className="col-sm-2">&nbsp;</div>
              <div className="col-sm-7"></div>
              {/* <div className="col-sm-3 text-end">
                <div className="input-group">
                  <input
                    id="search_Edit_ApproveInput"
                    type="text"
                    placeholder="Search Task.."
                    className="form-control input-sm"
                  />
                  <div className="input-group-btn">
                    <button className="btn btn-default srchBtn" type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="projListViewDiv d-lg-block mx-4 mt-3">
            <div className="table-responsive">
              <table
                id="Edit_MyTS_ApprovalTbl"
                className="table myApprovalTbl"
                style={{ width: "100%" }}
              >
                <thead className="stickyTblHeader">
                  <tr>
                    <th className="col-sm-3">Projects / Tasks / Sub-Task</th>
                    {generateTableHeader()}
                    <th className="">
                      Planned <br /> Effort
                    </th>
                    <th className="">
                      Actual <br /> Effort
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="10">
                        <Typography>Loading...</Typography>
                      </td>
                    </tr>
                  )}
                  {error && (
                    <tr>
                      <td colSpan="10">
                        <Typography color="error">{error}</Typography>
                      </td>
                    </tr>
                  )}
                  {tasks.length > 0 ? (
                    <>
                      <tr>
                        <td className="td_txt_bg">
                          <span className="pro_text">Total work for a Day</span>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("MON")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("TUE")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("WED")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("THU")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("FRI")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("SAT")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">
                          <div className="text-center">
                            <label className="input_blu">{getTotalHoursForDay("SUN")}</label>
                          </div>
                        </td>
                        <td className="td_txt_bg">--</td>
                        <td className="td_txt_bg">--</td>
                      </tr>
                      <div>
                        <img
                          src={Project_blu_icon}
                          alt=""
                          className="ApprIcns"
                          style={{ height: "40px", width: "auto" }} // Adjust the height as needed
                        />
                        <span className="pro_text">
                          {tasks[0].projectName || "Unnamed Project"}
                        </span>
                      </div>

                      {tasks.map((task, index) => (
                        <tr key={index}>
                          <td>
                            <div className="text-center">
                              <label>{task.taskName}</label>
                              <div style={{ fontSize: "6px", marginTop: "0.25rem", color: "blue" }}>
                                <span>Start Date: {data[0].startDate}</span>
                                <br /> {/* Adds a line break */}
                                <span>End Date: {data[0].endDate}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="text-center">
                              <label>{task.monday}</label>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <label>{task.tuesday}</label>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <label>{task.wednesday}</label>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <label>{task.thursday}</label>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <label>{task.friday}</label>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <label>{task.saturday}</label>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <label>{task.sunday}</label>
                            </div>
                          </td>
                          <td>{task.plannedEffort}</td>
                          <td>{task.actualEffort}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="10">
                        <Typography>No tasks available.</Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TimesheetDetailDrawer;
