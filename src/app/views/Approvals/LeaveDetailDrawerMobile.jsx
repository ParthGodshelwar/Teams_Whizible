import { React, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import axios from "axios";
import { Drawer } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import ChecklistDrawerMobile from "./ChecklistDrawerMobile";

const LeaveDetailDrawerMobile = ({
  show,
  handleClose,
  leaveid,
  setLeaveid,
  statusID,
  setStatusID,
  LARComment,
  openLARDrawer,
  setopenLARDrawer,
  setRefresh
}) => {
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = sessionStorage.getItem("token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;

  useEffect(() => {
    if (leaveid && employeeId) {
      console.log("leavebollo", leaveid);
      setLoading(true);
      setError(null);
      axios
        .get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetLeavesDetails?LeaveID=${leaveid}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          const leaveDetails =
            response.data?.data?.listInitiativeDetailEntity[0];
          console.log("setLeaveData", leaveDetails);
          setLeaveData(leaveDetails || {});
        })
        .catch((error) => {
          console.error("Error fetching leave data", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [leaveid]);

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="bottom"
        className="offcanvas-bottom offcanvasHeight-85"
      >
        <Offcanvas.Body>
          <div id="LeaveInfo_Sec" className="ProjInfoDetails">
            <div className="stickyOffHeader pt-3">
              <div className="greyCloseOffcanvas" onClick={handleClose}>
                &nbsp;
              </div>
              <div className="p-2 mb-2">
                <div className="row">
                  <div className="col-10 col-sm-10">
                    <h5 className="offcanvasTitleMob mt-1">
                      Leave Information
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row my-2">
              <div className="col-sm-12 col-12">
                <div className="row">
                  <div className="col-sm-12 col-12 pe-0">
                    <div className="apprBtns d-flex gap-3 justify-content-end">
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="modal"
                        data-bs-target="#approveRevModal"
                        // onClick={handleApprove}
                        onClick={() => {
                          handleClose();
                          setStatusID(2);
                          setLeaveid(leaveid);
                          setopenLARDrawer(true);
                        }}
                      >
                        <i className="fas fa-check-circle text_green pe-1"></i>{" "}
                        Approve
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#RejectDetlsOffcanvas"
                        // onClick={handleReject}
                        onClick={() => {
                          handleClose();
                          setStatusID(3);
                          setLeaveid(leaveid);
                          setopenLARDrawer(true);
                        }}
                      >
                        <i className="fas fa-times-circle text_red pe-1"></i>{" "}
                        Reject
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ProjInfoDetailsContent">
              {/* Loading State */}
              {loading && <h5>Loading...</h5>}

              {/* Error State */}
              {error && <h5 className="text-danger">{error}</h5>}

              {/* Content */}
              {!loading && !error && leaveData && (
                <div
                  className="accordion WF_TopAccordianPanel my-3"
                  id="ProjInfoDetailsAcc"
                >
                  <div className="accordion-item mb-3">
                    <h2 className="accordion-header" id="subProjDetailsHeading">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#ProjInfoDetailsTab"
                        // aria-expanded="true"
                      >
                        Details
                      </button>
                    </h2>
                    <div
                      id="ProjInfoDetailsTab"
                      className="accordion-collapse collapse show"
                      // aria-labelledby="subProjDetailsHeading"
                    >
                      <div className="accordion-body">
                        <div className="main-form">
                          <div className="row mt-2">
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Request Type:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{`Leave`}</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Employee Name:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {leaveData.toDate !== null
                                      ? leaveData.employeeName
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>From Date:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="far fa-calendar-check iconBlue pe-1"></i>
                                    {leaveData.fromDate !== null
                                      ? leaveData.fromDate
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>To Date:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="far fa-calendar-check iconBlue pe-1"></i>
                                    {leaveData.toDate !== null
                                      ? leaveData.toDate
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Type:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {leaveData.leaveType !== null
                                      ? leaveData.leaveType
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Leave Balance:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {/* {projectData.projectStatus !== null
                                      ? projectData.projectStatus
                                      : "N/A"} */}
                                    {leaveData.leaveBalance !== null
                                      ? leaveData.leaveBalance
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>First Half Day:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {leaveData.firstHalfDay ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Second Half Day:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {leaveData.secondHalfDay ? "Yes" : "No"}
                                    {/* {leaveData.secondHalfDay !== null
                                      ? leaveData.secondHalfDay
                                      : "N/A"} */}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Address:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="fas fa-map-marker-alt iconBlue pe-1"></i>
                                    {leaveData.address !== null
                                      ? leaveData.address
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Reason:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {leaveData.reason !== null
                                      ? leaveData.reason
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Telephone:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="fas fa-phone-volume iconBlue pe-1"></i>
                                    {leaveData.telephone !== null
                                      ? leaveData.telephone
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Applied On:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="far fa-calendar-check iconBlue pe-1"></i>
                                    {leaveData.appliedDate !== null
                                      ? leaveData.appliedDate
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* <div className="col-sm-6 col-12 mb-3">
                        <div className="row">
                          <div className="col-sm-5 col-5 text-end">
                            <label>Current Stage:</label>
                          </div>
                          <div className="col-sm-7 col-7 text-start">
                            <span>{projectData.currentStage}</span>
                          </div>
                        </div>
                      </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Offcanvas.Body>

        {/* Bootstrap Offcanvas Drawer */}
        {/* <div
          className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
            openDrawer === "approve" ? "show" : ""
          }`}
          tabIndex="-1"
          style={{
            visibility: openDrawer === "approve" ? "visible" : "hidden",
            transition: "0.3s ease-in-out",
          }}
        >
          <div className="offcanvas-body">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {statusID === 1 ? "Approve" : "Reject"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDrawer}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-12 text-end">
                    <label className="form-label">
                      (<span className="text_red">*</span> Mandatory)
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="required">
                    {statusID === 1
                      ? "Approval Comments"
                      : "Rejection Comments"}
                  </label>
                  <div className="col-sm-12">
                    <textarea
                      rows="3"
                      className="form-control"
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="text-center my-2">
                  <a
                    href="javascript:;"
                    className="btn btnGreen"
                    onClick={handleApprovalSubmit}
                  >
                    {statusID === 1 ? "Approve" : "Reject"}
                  </a>
                  <a
                    href="javascript:;"
                    className="btn borderbtn mr-5"
                    onClick={handleCloseDrawer}
                  >
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bootstrap Offcanvas Drawer for ResumeTimesheet
        <div
          className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
            openDrawer === "ResumeTimeSheet" ? "show" : ""
          }`}
          tabIndex="-1"
          style={{
            visibility: openDrawer === "ResumeTimeSheet" ? "visible" : "hidden",
            transition: "0.3s ease-in-out",
          }}
        >
          <div className="offcanvas-body">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resume Timesheet</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDrawer}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-12 text-end">
                    <label className="form-label">
                      (<span className="text_red">*</span> Mandatory)
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="required">Comments</label>
                  <div className="col-sm-12">
                    <textarea
                      rows="3"
                      className="form-control"
                      value={resumeComment}
                      onChange={(e) => setresumeComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="text-center my-2">
                  <a
                    href="javascript:;"
                    className="btn btnGreen"
                    onClick={handleResumeTimesheetSubmit}
                  >
                    Ok
                  </a>
                  <a
                    href="javascript:;"
                    className="btn borderbtn mr-5"
                    onClick={handleCloseDrawer}
                  >
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChecklistDrawerMobile
          openDrawer={openDrawer}
          setopenDrawer={setOpenDrawer}
          projectId={projectId}
          handleCloseDrawer={handleCloseDrawer}
        /> */}
      </Offcanvas>
    </>
  );
};

export default LeaveDetailDrawerMobile;
