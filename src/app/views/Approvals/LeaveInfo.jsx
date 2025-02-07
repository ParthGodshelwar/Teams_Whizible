import React, { useEffect, useState } from "react";
import { Drawer, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faCalendarCheck,
  faMapMarkerAlt,
  faPhoneVolume
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
const LeaveInfo = ({
  showProjectInfo,
  toggleProjectInfo,
  leaveid,
  setStatusID,
  handleApproveClick1,
  refresh,
  setRefresh
}) => {
  const [leaveData, setLeaveData] = useState(null);

  // Fetch token and employee ID from session storage
  const accessToken = sessionStorage.getItem("token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;

  useEffect(() => {
    // Fetch leave data when the drawer is opened
    if (showProjectInfo && employeeId) {
      axios
        .get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetLeavesDetails?LeaveID=${leaveid}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
        .then((response) => {
          const leaveDetails = response.data?.data?.listInitiativeDetailEntity[0];
          console.log("setLeaveData", leaveDetails);
          setLeaveData(leaveDetails || {});
        })
        .catch((error) => {
          console.error("Error fetching leave data", error);
        });
    }
  }, [showProjectInfo, employeeId, accessToken]);

  if (!leaveData) {
    return null; // Return nothing if data is not yet fetched
  }

  return (
    <Drawer
      anchor="right"
      open={showProjectInfo}
      onClose={toggleProjectInfo}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80vw",
          height: "100%",
          overflow: "hidden" // Prevent scrolling on the drawer itself
        }
      }}
    >
      <div className="graybg container-fluid py-1 mb-2">
        <div className="row">
          <div className="col-sm-6">
            <h5 className="pgtitle">Leave Information</h5>
          </div>
          <div className="col-sm-6 text-end">
            <Tooltip title="Close">
              <Button
                type="button"
                className="btn-close"
                onClick={toggleProjectInfo}
                aria-label="Close"
              ></Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="row my-2">
        <div className="col-sm-12">
          <div className="apprBtns mr-2 d-flex gap-3 justify-content-end">
            <a
              href="javascript:;"
              onClick={() => {
                setStatusID(2);
                handleApproveClick1();
              }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="text_green pe-1" />
              Approve
            </a>
            <a
              href="javascript:;"
              onClick={() => {
                setStatusID(3);
                handleApproveClick1();
              }}
            >
              <FontAwesomeIcon icon={faTimesCircle} className="text_red pe-1 mr-2" />
              Reject
            </a>
          </div>
        </div>
      </div>

      <div className="LeaveDetailsContent ml-2">
        <div className="mb-3 mt-3">
          <h5>Details</h5>
          <div className="LeaveContent">
            <div className="LeaveFields">
              <div className="row form-group">
                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>Request Type: </label>
                    </div>
                    <div className="col-sm-6 text-start">
                      <span>{leaveData.leaveType || "Leave"}</span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>Employee Name: </label>
                    </div>
                    <div className="col-sm-7 text-start">
                      <span>{leaveData.employeeName || "Shivani Bahadure"}</span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>From Date: </label>
                    </div>
                    <div className="col-sm-6 text-start">
                      <span>
                        <FontAwesomeIcon icon={faCalendarCheck} className="iconBlue pe-1" />
                        {leaveData.fromDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>To Date: </label>
                    </div>
                    <div className="col-sm-6 text-start">
                      <span>
                        <FontAwesomeIcon icon={faCalendarCheck} className="iconBlue pe-1" />
                        {leaveData.toDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>Leave Balance: </label>
                    </div>
                    <div className="col-sm-6 text-start">
                      <div
                        role="progressbar"
                        className="roundProgressBar"
                        aria-valuenow={leaveData.leaveBalance || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ "--value": leaveData.leaveBalance || 0 }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>Address: </label>
                    </div>
                    <div className="col-sm-8 text-start">
                      <span>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="iconBlue pe-1" />
                        {leaveData.address || "Pune"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>Reason: </label>
                    </div>
                    <div className="col-sm-8 text-start">
                      <span>{leaveData.reason || "Not feeling well"}</span>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 mb-3">
                  <div className="row">
                    <div className="col-sm-4">
                      <label>Telephone: </label>
                    </div>
                    <div className="col-sm-6 text-start">
                      <span>
                        <FontAwesomeIcon icon={faPhoneVolume} className="iconBlue pe-1" />
                        {leaveData.telephone || "+91 9999999999"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default LeaveInfo;
