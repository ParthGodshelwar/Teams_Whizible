import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import axios from "axios";

const TimesheetHistoryDrawer = ({
  showHistory,
  setShowHistory,
  timesheetID,
}) => {
  const [timesheetHistory, setTimesheetHistory] = useState([]);
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (showHistory) {
      fetchTimesheetHistory();
    }
  }, [showHistory, timesheetID]);

  const fetchTimesheetHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheet/GetMyTimesheetHistory?TimesheetID=${timesheetID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTimesheetHistory(response.data.data.myTimesheetHistoryListEntity);
    } catch (error) {
      console.error("Error fetching timesheet history:", error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={showHistory}
      onClose={() => setShowHistory(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80vw",
          height: "100%",
          overflow: "hidden", // Prevent scrolling on the drawer itself
        },
      }}
    >
      <div className="offcanvas-body">
        <div id="ProjInfo_Sec" className="ProjInfoDetails">
          <div className=" mt-1 graybg container-fluid py-1 mb-4">
            <div className="row">
              <div className="col-sm-6">
                <h5 className=" pgtitle">My Timesheet History</h5>
              </div>
              <div className="col-sm-6 text-end">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHistory(false)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>

          <div className="projListViewDiv d-lg-block mt-4 mx-2">
            <div className="table-responsive">
              <table
                className="table table-hover table-striped myApprovalTbl"
                style={{ width: "100%" }}
              >
                <thead className="stickyTblHeader">
                  <tr>
                    <th className="col-sm-2">Status</th>
                    <th className="col-sm-2">Generation Date</th>
                    <th className="col-sm-2">Updated Date</th>
                    <th className="col-sm-2">Action Taken By</th>
                    <th className="col-sm-2">Action Taken</th>
                    <th className="col-sm-2">Approver Name</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheetHistory.map((historyItem, index) => (
                    <tr
                      key={historyItem.resourceTimesheetStatusHistoryID}
                      className={index % 2 === 0 ? "even" : "odd"}
                    >
                      <td>{historyItem.statusDescription}</td>
                      <td>{historyItem.createdDate || "N/A"}</td>
                      <td>
                        {historyItem.updatedDate
                          ? historyItem.updatedDate
                          : "N/A"}
                      </td>
                      <td>{historyItem.actionTakenBy || "N/A"}</td>
                      <td>{historyItem.actionTaken}</td>
                      <td>{historyItem.approverName || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TimesheetHistoryDrawer;
