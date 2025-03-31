import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/DashBoardMobile.css";
import axios from "axios";
import Project from "../../../assets/latest/img/Project-orange.svg";
import Leaves from "../../../assets/latest/img/Leaves-icon.svg";
import ResourceTS from "../../../assets/latest/img/ResourceTS-icon.svg";
import ProjectDrawerMobile from "./ProjectDrawerMobile";
import { Pie, Bar } from "react-chartjs-2";
import LeaveDetailDrawerMobile from "./LeaveDetailDrawerMobile";
// import React from "react";

//React View section
const Offcanvas = () => {
  return (
    <>
      {/* Project information offcanvas Section Start Here */}
      <div
        className="offcanvas offcanvas-bottom offcanvasHeight-85"
        data-bs-scroll="false"
        tabIndex="-1"
        id="Project_Mobile_Offcanvas"
      >
        <div className="offcanvas-body">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Project information offcanvas Section End Here */}

      {/* Leave information offcanvas Section Start Here */}
      <div
        className="offcanvas offcanvas-bottom offcanvasHeight-85"
        data-bs-scroll="false"
        tabIndex="-1"
        id="Leave_Mobile_Offcanvas"
      >
        <div className="offcanvas-body">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Leave information offcanvas Section End Here */}

      {/* Resource Timesheet information offcanvas Section Start Here */}
      <div
        className="offcanvas offcanvas-bottom offcanvasHeight-85"
        data-bs-scroll="false"
        tabIndex="-1"
        id="Resource_Mobile_Offcanvas"
      >
        <div className="offcanvas-body">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Resource Timesheet information offcanvas Section End Here */}

      {/* Approve offcanvas start here */}
      <div
        className="offcanvas offcanvasMob offcanvas-bottom offcanvasHeight-65"
        data-bs-scroll="false"
        tabIndex="-1"
        id="ApproveDetlsOffcanvas"
      >
        <div className="container-fluid py-1 mb-2">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Approve offcanvas end here */}

      {/* Reject offcanvas start here */}
      <div
        className="offcanvas offcanvasMob offcanvas-bottom offcanvasHeight-65"
        data-bs-scroll="false"
        tabIndex="-1"
        id="RejectDetlsOffcanvas"
      >
        <div className="container-fluid py-1 mb-2">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Reject offcanvas end here */}

      {/* Put on hold offcanvas start here */}
      <div
        className="offcanvas offcanvasMob offcanvas-bottom offcanvasHeight-65"
        data-bs-scroll="false"
        tabIndex="-1"
        id="putOnHold_Offcanvas"
      >
        <div className="container-fluid py-1 mb-2">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Put on hold offcanvas end here */}

      {/* Resume Timesheet offcanvas start here */}
      <div
        className="offcanvas offcanvasMob offcanvas-bottom offcanvasHeight-65"
        data-bs-scroll="false"
        tabIndex="-1"
        id="resumeTimesheet_Offcanvas"
      >
        <div className="container-fluid py-1 mb-2">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Resume Timesheet offcanvas end here */}

      {/* Checklist Response offcanvas start here */}
      <div
        className="offcanvas offcanvasMob offcanvas-bottom offcanvasHeight-85"
        data-bs-scroll="false"
        tabIndex="-1"
        id="chcklistItem_Mobile_Offcanvas"
      >
        <div className="container-fluid py-1 mb-2">
          {/* Offcanvas content goes here */}
        </div>
      </div>
      {/* Checklist Response offcanvas end here */}
    </>
  );
};

const ResourceTimesheetTab = ({ timesheetData, refresh, setRefresh }) => {
  const [openResTS, setopenResTS] = useState({});
  const [openResTSDrawer, setopenResTSDrawer] = useState(false);
  const [ResTSComment, setResTSComment] = useState("");
  const [statusID, setStatusID] = useState("");
  const [timesheetid, settimesheetid] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const UserID = user.data.employeeId;

  const toggleAccordion = (timesheetID) => {
    setopenResTS((prev) => ({
      ...prev,
      [timesheetID]: !prev[timesheetID], // Toggle open/close state for each project
    }));
  };
  console.log("tsdatata a", timesheetData);

  const handleApprovalSubmit2 = async () => {
    // console.log("handleApprovalSubmit", projectid);
    const accessToken = sessionStorage.getItem("token");
    const comments = ResTSComment;

    if (!timesheetid) {
      return; // Stop the function execution if projectid is not present
    }
    if (!comments || comments.trim() === "") {
      toast.error("Comment should not be left blank!");
      return;
    }

    try {
      let response;

      if (statusID === 2) {
        // Approve project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/UpdateTimesheet?UserID=${UserID}&TImesheetID=${timesheetid}&Comments=${comments}&Status=V}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Approve Response:", response.data);

        if (response?.status === 200) {
          const result =
            response?.data?.data?.listTimesheetApproval?.[0]?.result;
          console.log("Approval result:", result);
          if (result === "Success") {
            toast.success("Timesheet approved successfully ");
            // setRefresh(!refresh);
            setopenResTSDrawer(false);
            setResTSComment("");
            setRefresh((prev) => !prev);
          } else {
            toast.error("Failed to submit Timesheet");
            return;
          }
        } else {
          toast.error("Failed to submit Timesheet");
          return;
        }
      } else if (statusID === 3) {
        // Reject project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/UpdateTimesheet?UserID=${UserID}&TImesheetID=${timesheetid}&Comments=${comments}&Status=J`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Reject Response:", response.data);

        if (response?.status === 200) {
          const result =
            response?.data?.data?.listTimesheetApproval?.[0]?.result;
          console.log("Rejection result:", result);

          if (result === "Success") {
            toast.success("Timesheet rejected successfully ");
            // setRefresh(!refresh);
            setopenResTSDrawer(false);
            setResTSComment("");
            setRefresh((prev) => !prev);
          } else {
            toast.error("Failed to reject Timesheet ");
            return;
          }
        } else {
          toast.error("Failed to reject Timesheet");
          return;
        }
      }

      // Proceed to email sending if the approval/rejection was successful
      const approvalEntity =
        response?.data?.data?.listTimesheetApproval ||
        response?.data?.data?.listTimesheetApproval;

      if (!approvalEntity || !approvalEntity[0]) {
        console.log("No approval entity found in response");
        toast.error("Email data missing or incorrect.");
        return;
      }

      const { fromEmailID, toEmailID, ccEmailID, subject, body } =
        approvalEntity[0];
      console.log("Email data to be sent:", {
        fromEmailID,
        toEmailID,
        ccEmailID,
        subject,
        body,
      });

      if (!fromEmailID || !toEmailID || !subject || !body) {
        console.log("Missing required email fields:", {
          fromEmailID,
          toEmailID,
          subject,
          body,
        });
        toast.error("Missing email details.");
        return;
      }

      // Construct the request body for email
      const requestBody = {
        fromAddress: fromEmailID,
        toAddress: toEmailID,
        ccAddress: ccEmailID || "", // Include CC if available
        subject: subject,
        body: body,
        isHtml: 1,
      };

      console.log("Email Request Body:", requestBody);

      if (fromEmailID) {
        const emailResponse = await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`,
          requestBody, // Send the request body with email details
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json", // Ensure the content type is set as JSON
            },
          }
        );

        if (emailResponse?.status === 200) {
          toast.success("Email sent successfully.");
        } else {
          console.log("Email API failed with status:", emailResponse?.status);
          toast.error("Failed to send email.");
        }
      }
    } catch (error) {
      console.error("Error during approval or email sending:", error);
      toast.error("Error during submission or email sending");
    }
  };

  return (
    <>
      <div
        className="tab-pane ApprTabs fade show active"
        id="ResTS_ApprMobile_Tab"
        role="tabpanel"
      >
        {/* {projectData.map((project) =>())} */}
        {timesheetData.length > 0 ? (
          <>
            <div className="allEntity col-sm-12" id="ResTSEntity">
              <div className="projListViewDiv" id="projListViewSec"></div>
              <div className="accordion" id="AccordionResource_Mob">
                {/* //insert */}
                {timesheetData.map((timesheetData) => (
                  <div
                    className="accordion-item brdr_left_blu mb-3"
                    key={timesheetData.timesheetID}
                  >
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${
                          openResTS[timesheetData.timesheetID]
                            ? ""
                            : "collapsed"
                        }`}
                        type="button"
                        // onClick={toggleAccordion(projectDataM.projectID)}
                        onClick={() =>
                          toggleAccordion(timesheetData.timesheetID)
                        }
                      >
                        <div className="flex-1 pe-2">
                          <div className="row">
                            <div className="col-5 pe-0">
                              <img
                                src={timesheetData.employeeImg}
                                alt={timesheetData.employeeImg}
                                // src={ResourceTS}
                                // alt={ResourceTS}
                                className="ResIconImg"
                              />
                              <span className="ps-2">
                                {timesheetData.employeeName}
                              </span>
                              {/* <img src="Teams-New/dist/img/Resources/Gauri.jpg" alt="" className="ResIconImg">  */}
                            </div>
                            <div className="col-7">
                              <div className="row gx-1 mt-2">
                                <div className="col-6">
                                  <div className="projDetlsMob">
                                    <div className="font-sm1">From Date</div>
                                    <div className="font-sm1">
                                      {timesheetData.fromDate}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="projDetlsMob font-sm1">
                                    <div className="font-sm1">To Date</div>
                                    <div className="font-sm1">
                                      {timesheetData.todate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-7">
                              <div className="row gx-1 mt-2">
                                <div className="col-12">
                                  <div className="projDetlsMob ">
                                    <div className="font-sm1">
                                      Leaves Taken -{" "}
                                      <span className="text_red">
                                        {" "}
                                        {timesheetData.leavetaken}{" "}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      // className={`accordion-collapse collapse ${
                      //   openProject === projectDataM.projectID ? "show" : ""
                      // }`}
                      className={`accordion-collapse collapse ${
                        openResTS[timesheetData.timesheetID] ? "show" : ""
                      }`}
                    >
                      <div className="accordion-body">
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            Expected Efforts of the Week :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">
                              {timesheetData.expectedHours}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            Actual Efforts :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">
                              {timesheetData.actualHours}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            Billable Hours :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">
                              {timesheetData.billableHours}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            Non Billable Hours :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">
                              {timesheetData.nonBillableHours}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            From Date :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">{timesheetData.fromDate}</span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            To Date :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">{timesheetData.todate}</span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 col-sm-6 col-md-6 text-end">
                            Submitted Date :
                          </div>
                          <div className="col-6 col-sm-6 col-md-6 text-start ">
                            <span className="">
                              {timesheetData.createdDate}
                            </span>
                          </div>
                        </div>

                        <div className="Project_DetailsBtns d-flex justify-content-end gap-1">
                          <button
                            className="btn p-0"
                            type="button"
                            // onClick={() => {
                            //   setSelectedProjectId(projectDataM.projectID);
                            //   handleApprove();
                            // }}
                            onClick={() => {
                              setStatusID(2);
                              // setCat(2);
                              settimesheetid(timesheetData.timesheetID);
                              setopenResTSDrawer(true);
                            }}
                          >
                            <span>
                              <i className="far fa-thumbs-up text-green fnt-16"></i>
                            </span>
                          </button>
                          <button
                            className="btn p-0"
                            type="button"
                            // onClick={() => {
                            //   setSelectedProjectId(projectDataM.projectID);
                            //   handleReject();
                            // }}
                            onClick={() => {
                              setStatusID(3);
                              // setCat(2);
                              settimesheetid(timesheetData.timesheetID);
                              setopenResTSDrawer(true);
                            }}
                          >
                            <span>
                              <i className="far fa-thumbs-down textRed fnt-16"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center" }}>No Timesheet available.</div>
          </>
        )}

        {/* Project Drawer */}
        {/* //kam baki hai  */}
        {/* <ProjectDrawerMobile
          show={isDrawerOpen}
          handleClose={closeDrawer}
          projectId={SelectedProjectId}
        /> */}
      </div>

      {/* // drawer */}
      <div
        className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
          openResTSDrawer ? "show" : ""
        }`}
        tabIndex="-1"
        style={{
          visibility: openResTSDrawer ? "visible" : "hidden",
          transition: "0.3s ease-in-out",
        }}
      >
        <div className="offcanvas-body">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {statusID === 2 ? "Approve" : "Reject"}
              </h5>
              <button
                type="button"
                className="btn-close"
                // onClick={(e) => setopenARDrawer(false)}
                onClick={(e) => {
                  setopenResTSDrawer(false);
                  setResTSComment("");
                }}
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
                  {statusID === 2 ? "Approval Comments" : "Rejection Comments"}
                </label>
                <div className="col-sm-12">
                  <textarea
                    rows="3"
                    className="form-control"
                    value={ResTSComment}
                    onChange={(e) => setResTSComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="text-center my-2">
                <a
                  href="javascript:;"
                  // className="btn btnGreen me-3"
                  className={
                    statusID === 2 ? "btn btnGreen me-3" : "btn btnRed me-3"
                  }
                  
                  onClick={handleApprovalSubmit2}
                >
                  {statusID === 2 ? "Approve" : "Reject"}{" "}
                </a>
                <a
                  href="javascript:;"
                  className="btn borderbtn mr-5"
                  onClick={(e) => {
                    setopenResTSDrawer(false);
                    setResTSComment("");
                  }}
                >
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <div
  //     className="tab-pane ApprTabs fade"
  //     id="ResTS_ApprMobile_Tab"
  //     role="tabpanel"
  //   >
  //     <div className="allEntity col-sm-12" id="ResTSEntity">
  //       {/* Mobile View Starts here */}
  //       <div className="projListViewDiv" id="projListViewSec">
  //         <div className="accordion" id="AccordionResource_Mob">
  //           {/* Accordion Items go here */}
  //         </div>
  //       </div>
  //       {/* Mobile View Ends here */}
  //     </div>
  //   </div>
  // );
};

const LeavesTab = ({ leaveData, refresh, setRefresh }) => {
  const [show, setshow] = useState(false);
  const [openLeaves, setopenLeaves] = useState({});
  const [openLARDrawer, setopenLARDrawer] = useState(false);
  const [LARComment, setLARComment] = useState("");
  const [statusID, setStatusID] = useState("");

  const [leaveid, setLeaveid] = useState([]);

  const toggleAccordion = (leaveID) => {
    setopenLeaves((prev) => ({
      ...prev,
      [leaveID]: !prev[leaveID], // Toggle open/close state for each project
    }));
  };

  const handleClose = () => {
    setshow(false);
    setLARComment("");
  };

  const handleApprovalSubmit1 = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userid = user.data.employeeId;
    const accessToken = sessionStorage.getItem("token");
    const comments = LARComment;
    if (!leaveid) {
      return; // Stop the function execution if projectid is not present
    }
    if (!comments || comments.trim() === "") {
      toast.error("Comment should not be left blank!");
      return;
    }

    try {
      let response;

      if (statusID === 2) {
        // Approve project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/UpdateLeavesDetails?LeaveID=${leaveid}&StatusID=${statusID}&ApproverID=${userid}&Comments=${comments}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.status === 200) {
          const result =
            response?.data?.data?.listLeaveApprovalEntity?.[0]?.result;

          if (result === "Success") {
            // If the result is Success, show a success toast
            toast.success("Leaves approved successfully ");
            // setApproveModalOpen1(false); // Close modal after success
            setopenLARDrawer(false);
            setLARComment("");

            // setRefresh();
            setRefresh((prev) => !prev);

            // setRefresh(!refresh);
            // setApprovalComment(""); // Clear the comment
          } else {
            // If the result is not Success, show an error toast and alert
            toast.error("Failed to submit approval");

            return; // Stop execution if approval fails
          }
        } else {
          // Handle cases where the HTTP status is not 200
          toast.error("Failed to submit approval");

          return;
        }
      } else if (statusID === 3) {
        // Reject project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/UpdateLeavesDetails?LeaveID=${leaveid}&StatusID=${statusID}&ApproverID=${userid}&Comments=${comments}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.status === 200) {
          const result =
            response?.data?.data?.listLeaveApprovalEntity?.[0]?.result;

          if (result === "Success") {
            // If the result is Success, show a success toast
            toast.success("Leaves rejected successfully ");
            // setRefresh(!refresh);
            // setApproveModalOpen1(false); // Close modal after success
            // setApprovalComment(""); // Clear the comment
            setopenLARDrawer(false);
            setLARComment("");
            setRefresh((prev) => !prev);
          } else {
            // If the result is not Success, show an error toast and alert
            toast.error("Failed to submit approval");

            return; // Stop execution if approval fails
          }
        } else {
          // Handle cases where the HTTP status is not 200
          toast.error("Failed to submit approval");

          return;
        }
      }

      // Proceed to email sending if the approval/rejection was successful
      const approvalEntity =
        response.data.data.listLeaveApprovalEntity ||
        response.data.data.listLeaveApprovalEntity;

      const { fromEmailID, toEmailID, ccEmailID, subject, body } =
        approvalEntity[0];
      console.log(
        "listLeaveApprovalEntity",
        response.data.data.listLeaveApprovalEntity
      );

      // Construct the query string
      const requestBody = {
        fromAddress: fromEmailID,
        toAddress: toEmailID,
        ccAddress: ccEmailID || "", // Include CC if available
        subject: subject,
        body: body,
        isHtml: 1,
      };

      console.log("listLeaveApprovalEntity", sessionStorage.getItem("token"));

      if (fromEmailID) {
        await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`,
          requestBody, // Send the request body with email details
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json", // Ensure the content type is set as JSON
            },
          }
        );

        toast.success("Email sent successfully.");
      }
    } catch (error) {
      console.error("Error in approval or email sending", error);
      // toast.error("Error during submission or email sending");
    }
  };

  console.log("levedata", leaveData);
  return (
    <>
      <div
        className="tab-pane ApprTabs fade show active"
        id="LeavesAppr_MobTab"
        role="tabpanel"
      >
        {/* {projectData.map((project) =>())} */}

        {leaveData.length > 0 ? (
          <>
            <div className="allEntity col-sm-12" id="projectEntity">
              <div className="projListViewDiv" id="projListViewSec"></div>
              <div className="accordion" id="AccordionProjTaskMob">
                {/* //insert */}
                {leaveData.map((leaveData) => (
                  <div
                    className="accordion-item brdr_left_blu mb-3"
                    key={leaveData.leaveID}
                  >
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${
                          openLeaves[leaveData.leaveID] ? "" : "collapsed"
                        }`}
                        type="button"
                        // onClick={toggleAccordion(projectDataM.projectID)}
                        onClick={() => toggleAccordion(leaveData.leaveID)}
                      >
                        <div className="flex-1 pe-2">
                          <div className="row">
                            <div className="col-5 pe-0">
                              <img
                                src={leaveData.employeeImage}
                                alt={leaveData.employeeImage}
                                // src={Leaves}
                                // alt={Leaves}
                                className="ResIconImg"
                              />
                              <span className="ps-2">
                                {leaveData.employeeName}
                              </span>
                              {/* <img src="Teams-New/dist/img/Resources/Gauri.jpg" alt="" className="ResIconImg">  */}
                            </div>
                            <div className="col-7">
                              <div className="row gx-1 mt-2">
                                <div className="col-6">
                                  <div className="projDetlsMob">
                                    <div className="font-sm1">From Date</div>
                                    <div className="font-sm1">
                                      {leaveData.fromDate}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="projDetlsMob font-sm1">
                                    <div className="font-sm1">To Date</div>
                                    <div className="font-sm1">
                                      {leaveData.toDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      // className={`accordion-collapse collapse ${
                      //   openProject === projectDataM.projectID ? "show" : ""
                      // }`}
                      className={`accordion-collapse collapse ${
                        openLeaves[leaveData.leaveID] ? "show" : ""
                      }`}
                    >
                      <div className="accordion-body">
                        <div className="row mb-1">
                          <div className="col-6 text-end">Role :</div>
                          <div className="col-6 text-start">
                            <span>{leaveData.roleDescription}</span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 text-end">Leave Type :</div>
                          <div className="col-6 text-start">
                            <span>{leaveData.leaveType}</span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-6 text-end">Status :</div>
                          <div className="col-6 text-start">
                            <span>{leaveData.leaveStatus}</span>
                          </div>
                        </div>
                        <div className="Project_DetailsBtns d-flex justify-content-end gap-1">
                          <a
                            onClick={() => {
                              setshow(true);
                              // setStatusID(2);
                              // setCat(2);
                              setLeaveid(leaveData.leaveID);
                            }}
                            href="javascript:;"
                            // id={`ProjDetailsBtn${projectDataM.projectID}`}
                          >
                            <i className="fa-solid fa-rectangle-list"></i>
                          </a>
                          <button
                            className="btn p-0"
                            type="button"
                            // onClick={() => {
                            //   setSelectedProjectId(projectDataM.projectID);
                            //   handleApprove();
                            // }}
                            onClick={() => {
                              setStatusID(2);
                              // setCat(2);
                              setLeaveid(leaveData.leaveID);
                              setopenLARDrawer(true);
                            }}
                          >
                            <span>
                              <i className="far fa-thumbs-up text-green fnt-16"></i>
                            </span>
                          </button>
                          <button
                            className="btn p-0"
                            type="button"
                            // onClick={() => {
                            //   setSelectedProjectId(projectDataM.projectID);
                            //   handleReject();
                            // }}
                            onClick={() => {
                              setStatusID(3);
                              // setCat(2);
                              setLeaveid(leaveData.leaveID);
                              setopenLARDrawer(true);
                            }}
                          >
                            <span>
                              <i className="far fa-thumbs-down textRed fnt-16"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center" }}>No Leaves available.</div>
          </>
        )}

        {/* Project Drawer */}
        {/* //kam baki hai  */}
        {/* <ProjectDrawerMobile
          show={isDrawerOpen}
          handleClose={closeDrawer}
          projectId={SelectedProjectId}
        /> */}
      </div>

      {/* // drawer */}
      <div
        className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
          openLARDrawer ? "show" : ""
        }`}
        tabIndex="-1"
        style={{
          visibility: openLARDrawer ? "visible" : "hidden",
          transition: "0.3s ease-in-out",
        }}
      >
        <div className="offcanvas-body">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {statusID === 2 ? "Approve" : "Reject"}
              </h5>
              <button
                type="button"
                className="btn-close"
                // onClick={(e) => setopenARDrawer(false)}
                onClick={(e) => {
                  setopenLARDrawer(false);
                  setLARComment("");
                }}
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
                  {statusID === 2 ? "Approval Comments" : "Rejection Comments"}
                </label>
                <div className="col-sm-12">
                  <textarea
                    rows="3"
                    className="form-control"
                    value={LARComment}
                    onChange={(e) => setLARComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="text-center my-2">
                <a
                  href="javascript:;"
                  // className="btn btnGreen me-3"
                  className={
                    statusID === 2 ? "btn btnGreen me-3" : "btn btnRed me-3"
                  }
                  onClick={handleApprovalSubmit1}
                >
                  {statusID === 2 ? "Approve" : "Reject"}{" "}
                </a>
                <a
                  href="javascript:;"
                  className="btn borderbtn mr-5"
                  onClick={(e) => {
                    setopenLARDrawer(false);
                    setLARComment("");
                  }}
                >
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LeaveDetailDrawerMobile
        show={show}
        handleClose={handleClose}
        leaveid={leaveid}
        setLeaveid={setLeaveid}
        openLARDrawer={openLARDrawer}
        setopenLARDrawer={setopenLARDrawer}
        statusID={statusID}
        setStatusID={setStatusID}
        setRefresh={setRefresh}
      />
    </>
  );

  // return (
  //   <div
  //     className="tab-pane ApprTabs fade"
  //     id="LeavesAppr_MobTab"
  //     role="tabpanel"
  //   >
  //     <div className="allEntity col-sm-12" id="LeavesEntity">
  //       {/* Mobile View Starts here */}
  //       <div className="projListViewDiv" id="LeavesListViewSec">
  //         <div className="accordion" id="AccordionLeaveMob">
  //           {/* Accordion Items go here */}
  //         </div>
  //       </div>
  //       {/* Mobile View Ends here */}
  //     </div>
  //   </div>
  // );
};

const ProjectTab = ({ projectData = [], refresh, setRefresh }) => {
  const [openProject, setOpenProject] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [SelectedProjectId, setSelectedProjectId] = useState(null);
  const [openARDrawer, setopenARDrawer] = useState(false);
  const [ARComment, setARComment] = useState("");
  const [statusID, setStatusID] = useState("");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.data?.employeeId;

  // const [isOpen, setIsOpen] = useState({});

  // const toggleAccordion = () => {
  //   setIsOpen(!isOpen);
  // };

  // const toggleAccordion = (projectID) => {
  //   setOpenProject(openProject === projectID ? null : projectID);
  // };
  const toggleAccordion = (projectID) => {
    setOpenProject((prev) => ({
      ...prev,
      [projectID]: !prev[projectID], // Toggle open/close state for each project
    }));
  };

  const openDrawer = (projectId) => {
    setSelectedProjectId(projectId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProjectId(null);
  };

  // useEffect(() => {}, []);

  // const projectDataM = {
  //   projectName: "Marketplace",
  //   startDate: "01 Dec 2024",
  //   endDate: "31 Nov 2025",
  //   projectCode: "IND-16",
  //   workHours: "2264:00",
  //   organizationUnit: "Mumbai",
  //   currentStage: "Started",
  //   revisionDetails:
  //     "Schedule updated to 05 Dec, Timeline adjusted to 31 Dec, Effort revised to 2046:00",
  // };

  // approve outside btn
  const handleApprove = async () => {
    const projectid = SelectedProjectId;
    const accessToken = sessionStorage.getItem("token");
    if (!projectid) {
      return; // Stop the function execution if projectid is not present
    }
    try {
      // Call validateProjectApproval API
      const validateResponse = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/validateProjectApproval?ProjectID=${projectid}&userID=${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (validateResponse.data.data[0].result === "Success") {
        toast.success("Project Validation successfully.");
        // setApproveModalOpen(true); // Open modal if validation is successful
        setopenARDrawer(true);
        setStatusID(2); // Set status to Approve
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during approval validation:", error);
    }
  };

  // Reject function
  const handleReject = async () => {
    const projectid = SelectedProjectId;

    const accessToken = sessionStorage.getItem("token");
    if (!projectid) {
      return; // Stop the function execution if projectid is not present
    }
    try {
      // Call validateProjectApproval API first
      const validateResponse = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/validateProjectApproval?ProjectID=${projectid}&userID=${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (validateResponse.data.data[0].result === "Success") {
        toast.success("Project Validation successful.");
        // setApproveModalOpen(true); // Open modal for rejection

        setopenARDrawer(true);
        setStatusID(3); // Set status to Reject
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during validation:", error);
    }
  };

  const handleApprovalSubmit = async () => {
    const projectid = SelectedProjectId;

    const accessToken = sessionStorage.getItem("token");
    const comments = ARComment;
    if (!projectid) {
      return; // Stop the function execution if projectid is not present
    }
    if (!comments || comments.trim() === "") {
      toast.error("Comment should not be left blank!");
      return;
    }

    try {
      let response;

      if (statusID === 2) {
        // Approve project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/ApproveProjectWorkflow?UserId=${UserID}&ProjectID=${projectid}&Comments=${comments}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.status === 200) {
          toast.success("Project approved");
          // setRefresh(!refresh);
          // setApproveModalOpen(false); // Close modal after success
          setopenARDrawer(false);
          setARComment("");
          setRefresh((prev) => !prev);
        } else {
          toast.error("Failed to submit approval");
          alert("Failed to submit approval/rejection.");
          return; // Stop execution if the approval fails
        }
      } else if (statusID === 3) {
        // Reject project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/RejectProjectWorkflow?UserId=${UserID}&ProjectID=${projectid}&Comments=${comments}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.status === 200) {
          toast.success("Project rejected");
          setopenARDrawer(false);
          setARComment("");
          setRefresh((prev) => !prev);
        } else {
          toast.error("Failed to submit rejection");
          alert("Failed to submit approval/rejection.");
          return; // Stop execution if the rejection fails
        }
      }

      // Proceed to email sending if the approval/rejection was successful
      const approvalEntity =
        response.data.data.projectWorkFlowApprover ||
        response.data.data.projectWorkFlowApprover;

      const { fromEmailID, toEmailID, ccEmailID, subject, body } =
        approvalEntity[0];

      // Construct the query string
      const requestBody = {
        fromAddress: fromEmailID,
        toAddress: toEmailID,
        ccAddress: ccEmailID || "", // Include CC if available
        subject: subject,
        body: body,
        isHtml: 1,
      };

      if (fromEmailID) {
        await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`,
          requestBody, // Send the request body with email details
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json", // Ensure the content type is set as JSON
            },
          }
        );

        toast.success("Email sent successfully.");
      }
    } catch (error) {
      console.error("Error in approval or email sending", error);
      // toast.error("Error during submission or email sending");
    }
  };

  if (!Array.isArray(projectData) || projectData.length === 0) {
    return <div style={{ textAlign: "center" }}>No Projects available.</div>;
  }

  return (
    <>
      <div
        className="tab-pane ApprTabs fade show active"
        id="project_MobTab"
        role="tabpanel"
      >
        {/* {projectData.map((project) =>())} */}

        <div className="allEntity col-sm-12" id="projectEntity">
          <div className="projListViewDiv" id="projListViewSec"></div>
          <div className="accordion" id="AccordionProjTaskMob">
            {/* //insert */}
            {projectData.map((projectDataM) => (
              <div
                className="accordion-item brdr_left_blu mb-3"
                key={projectDataM.projectID}
              >
                <h2 className="accordion-header">
                  <button
                    // className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                    // className={`accordion-button ${
                    //   openProject === projectDataM.projectID ? "" : "collapsed"
                    // }`}
                    className={`accordion-button ${
                      openProject[projectDataM.projectID] ? "" : "collapsed"
                    }`}
                    type="button"
                    // onClick={toggleAccordion(projectDataM.projectID)}
                    onClick={() => toggleAccordion(projectDataM.projectID)}
                  >
                    <div className="flex-1 pe-2">
                      <div className="row">
                        <div className="col-5 pe-0">
                          <span>{projectDataM.projectName}</span>
                        </div>
                        <div className="col-7">
                          <div className="row gx-1 mt-2">
                            <div className="col-6">
                              <div className="projDetlsMob">
                                <div className="font-sm1">Start Date</div>
                                <div className="font-sm1">
                                  {projectDataM.expectedStartDate}
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="projDetlsMob font-sm1">
                                <div className="font-sm1">End Date</div>
                                <div className="font-sm1">
                                  {projectDataM.expectedEndDate}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row gx-1 mt-2">
                        <label className="col-12 text_pink fw-500">
                          Revision Details:{" "}
                          <span className="font-sm1">
                            {projectDataM.revisionDetails}
                          </span>
                        </label>
                      </div>
                    </div>
                  </button>
                </h2>
                <div
                  // className={`accordion-collapse collapse ${
                  //   openProject === projectDataM.projectID ? "show" : ""
                  // }`}
                  className={`accordion-collapse collapse ${
                    openProject[projectDataM.projectID] ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    <div className="row mb-1">
                      <div className="col-6 text-end">Project Code:</div>
                      <div className="col-6 text-start">
                        <span>{projectDataM.projectCode}</span>
                      </div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-6 text-end">Work (Hrs):</div>
                      <div className="col-6 text-start">
                        <span>{projectDataM.workHours}</span>
                      </div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-6 text-end">Organization Unit:</div>
                      <div className="col-6 text-start">
                        <span>{projectDataM.organizationUnit}</span>
                      </div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-6 text-end">Current Stage:</div>
                      <div className="col-6 text-start">
                        <span>{projectDataM.requeststage}</span>
                      </div>
                    </div>
                    <div className="Project_DetailsBtns d-flex justify-content-end gap-1">
                      <a
                        onClick={() => openDrawer(projectDataM.projectID)}
                        href="javascript:;"
                        id={`ProjDetailsBtn${projectDataM.projectID}`}
                      >
                        <i className="fa-solid fa-rectangle-list"></i>
                      </a>
                      <button
                        className="btn p-0"
                        type="button"
                        onClick={() => {
                          setSelectedProjectId(projectDataM.projectID);
                          handleApprove();
                        }}
                      >
                        <span>
                          <i className="far fa-thumbs-up text-green fnt-16"></i>
                        </span>
                      </button>
                      <button
                        className="btn p-0"
                        type="button"
                        onClick={() => {
                          setSelectedProjectId(projectDataM.projectID);
                          handleReject();
                        }}
                      >
                        <span>
                          <i className="far fa-thumbs-down textRed fnt-16"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Project Drawer */}
        {/* //kam baki hai  */}
        <ProjectDrawerMobile
          show={isDrawerOpen}
          handleClose={closeDrawer}
          projectId={SelectedProjectId}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>

      {/* // drawer */}
      <div
        className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
          openARDrawer ? "show" : ""
        }`}
        tabIndex="-1"
        style={{
          visibility: openARDrawer ? "visible" : "hidden",
          transition: "0.3s ease-in-out",
        }}
      >
        <div className="offcanvas-body">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {statusID === 2 ? "Approve" : "Reject"}
              </h5>
              <button
                type="button"
                className="btn-close"
                // onClick={(e) => setopenARDrawer(false)}
                onClick={(e) => {
                  setopenARDrawer(false);
                  setARComment("");
                }}
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
                  {statusID === 2 ? "Approval Comments" : "Rejection Comments"}
                </label>
                <div className="col-sm-12">
                  <textarea
                    rows="3"
                    className="form-control"
                    value={ARComment}
                    onChange={(e) => setARComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="text-center my-2">
                <a
                  href="javascript:;"
                  // className="btn btnGreen me-3"
                  className={
                    statusID === 2 ? "btn btnGreen me-3" : "btn btnRed me-3"
                  }
                  onClick={handleApprovalSubmit}
                >
                  {statusID === 2 ? "Approve" : "Reject"}{" "}
                </a>
                <a
                  href="javascript:;"
                  className="btn borderbtn mr-5"
                  onClick={(e) => {
                    setopenARDrawer(false);
                    setARComment("");
                  }}
                >
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Tabs = ({
  projectData,
  leaveData,
  timesheetData,
  refresh,
  setRefresh,
}) => {
  const [activeTab, setActiveTab] = useState("project");
  return (
    <div className="row my-2 pe-0 ps-0">
      <div
        className="searchList d-flex justify-content-between gap-2 me-2"
        id="searching"
      >
        <div
          className="allWorkflowTabsDiv d-flex justify-content-start ms-2"
          id="MobkWF_TabsDiv"
        >
          <ul
            className="nav nav-tabs mb-3"
            id="AllEntityTabsMob"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link position-relative border-0 ${
                  activeTab === "project" ? "active" : ""
                }`}
                // className="nav-link position-relative active border-0"
                id="projectTab_Mob"
                data-bs-toggle="tab"
                data-bs-target="#project_MobTab"
                role="tab"
                onClick={() => setActiveTab("project")}
              >
                <img
                  //   src="./img/Project-orange.svg"
                  //   alt=""
                  //   className="ApprIcns"
                  src={Project}
                  alt="Project Icon"
                  className="ApprIcns"
                />
                Project
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link position-relative border-0 ${
                  activeTab === "leaves" ? "active" : ""
                }`}
                onClick={() => setActiveTab("leaves")}
                id="MyTimesheetTab_Mob"
                data-bs-toggle="tab"
                data-bs-target="#LeavesAppr_MobTab"
                role="tab"
                tabIndex="-1"
              >
                <img src={Leaves} alt="Leaves Icon" className="ApprIcns" />
                Leaves
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link position-relative border-0 ${
                  activeTab === "timesheet" ? "active" : ""
                }`}
                onClick={() => setActiveTab("timesheet")}
                id="ResoTimesheet_Tab_Mob"
                data-bs-toggle="tab"
                data-bs-target="#ResTS_ApprMobile_Tab"
                role="tab"
                tabIndex="-1"
              >
                <img
                  src={ResourceTS}
                  alt="Timesheet Icon"
                  className="ApprIcns"
                />
                Timesheet
              </button>
            </li>
          </ul>
        </div>
        <div className="mt-2">
          <a
            href="javascript:;"
            id="showConvIniBtn"
            className="textUndrln"
            data-bs-toggle="collapse"
            data-bs-target="#CompIniCards"
          >
            {/* <i className="fa-regular fa-circle-up arrowBtn"></i> */}
          </a>
        </div>
      </div>
      <div className="ApprTabContent" id="">
        <div className="tab-content" id="ApprTabContent">
          {activeTab === "project" && (
            <ProjectTab
              projectData={projectData}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
          {activeTab === "leaves" && (
            <LeavesTab
              leaveData={leaveData}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
          {activeTab === "timesheet" && (
            <ResourceTimesheetTab
              timesheetData={timesheetData}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}

          {/* <ProjectTab projectData={projectData} />
          <LeavesTab leaveData={leaveData} />
          <ResourceTimesheetTab /> */}
        </div>
      </div>
    </div>
  );
};

const GraphSection = ({ approvalPendingData, approvalAgeingData }) => {
  console.log("Parth.G", approvalPendingData, approvalAgeingData);
  const pieData = {
    labels: ["Projects", "Leaves", "Timesheets"],

    datasets: [
      {
        data: [
          approvalPendingData.projectCount,
          approvalPendingData.leavesCount,
          approvalPendingData.timesheetCount,
        ],
        backgroundColor: ["#8cb8ff", "#ff76a7", "#FFA500"],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", // Position the legend on the right
        labels: {
          boxWidth: 20, // Width of the colored box in the legend
          padding: 15, // Padding between legend items
        },
      },
    },
  };

  const barData = {
    labels: ["Projects", "Leaves", "Resources Timesheet"], // X-axis labels
    datasets: [
      {
        label: "Approval Ageing Data", // Singular label for the dataset
        data: [
          approvalAgeingData.projectCount, // Projects count
          approvalAgeingData.leavesCount, // Leaves count
          approvalAgeingData.timesheetCount, // Timesheet count
        ],
        backgroundColor: ["#8cb8ff", "#ff76a7", "#FFA500"], // Colors for each bar
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Approval Ageing Data",
        font: {
          size: 18,
        },
      },
      legend: {
        position: "top",
        labels: {
          fontSize: 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Approvals", // X-axis label
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Ageing", // Y-axis label
          font: {
            size: 16,
          },
        },
        beginAtZero: true, // Ensures the Y-axis starts from zero
      },
    },
    maintainAspectRatio: false, // Allows the height to be controlled directly
  };
  return (
    <div className="accordion main_acordian_panel mt-3" id="CompletedIniAcc">
      <div className="accordion-item border-0">
        <div
          id="CompIniCards"
          className="IniCardsAcc accordion-collapse collapse show"
        >
          <div className="accordion-body p-2">
            <div className="col-12 col-sm-12 col-md-12">
              <div className="ApprGraphSec">
                <div className="row">
                  <div className="col-sm-6 col-md-12 col-12 col-md-12">
                    {/* <p className="graphTitle text-center">
                      Overall Approval Pending
                    </p>
                    <div className="ApprPendingSection">
                      <canvas id="ApprPendingChart1"></canvas>
                    </div> */}

                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        marginBottom: "40px",
                      }}
                    >
                      <p className="graphTitle text-center">
                        Overall Approval Pending
                      </p>
                      <Pie data={pieData} options={options} />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-12 col-12 col-md-12">
                    {/* <div className="ApprGraphs">
                      <p className="graphTitle text-center mt-3 mb-0">
                        Approval Ageing &gt; 5
                      </p>
                    </div>
                    <div className="barGraphSec">
                      <canvas id="AgeingGraph1"></canvas>
                    </div> */}
                    <div
                      style={{
                        width: "85%",
                        height: "300px",
                        marginBottom: "40px",
                      }}
                    >
                      <p className="graphTitle text-center">
                        {`Approval Ageing > 5`}
                      </p>

                      <Bar data={barData} options={barOptions} />
                    </div>
                    <div
                      className="legends-div d-flex justify-content-center mt-xl-3"
                      id="legends-div"
                    >
                      <div className="row g-0">
                        <div className="col-4 col-sm-4">
                          <div className="legends">
                            <div className="legend-box blue-box"></div>
                            <div className="l-name">Project</div>
                          </div>
                        </div>
                        <div className="col-4 col-sm-4">
                          <div className="legends">
                            <div className="legend-box pink-box"></div>
                            <div className="l-name">Leave</div>
                          </div>
                        </div>
                        <div className="col-4 col-sm-4">
                          <div className="legends">
                            <div className="legend-box yellow-box"></div>
                            <div className="l-name">Resources Timesheet</div>
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
    </div>
  );
};

const WorkFlowTabs = ({
  projectData,
  leaveData,
  timesheetData,
  approvalAgeingData,
  approvalPendingData,
  refresh,
  setRefresh,
}) => {
  return (
    <div className="workFlowTabs" id="EntityWF_Tabs">
      <GraphSection
        projectData={projectData}
        leaveData={leaveData}
        timesheetData={timesheetData}
        approvalAgeingData={approvalAgeingData}
        approvalPendingData={approvalPendingData}
      />
      <Tabs
        projectData={projectData}
        leaveData={leaveData}
        timesheetData={timesheetData}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
};

const ContentWrapper = ({
  projectData,
  leaveData,
  timesheetData,
  approvalPendingData,
  approvalAgeingData,
  refresh,
  setRefresh,
}) => {
  return (
    <section
      id="content-wrapper2"
      className="content_wrapper d-block d-lg-none"
    >
      <WorkFlowTabs
        projectData={projectData}
        leaveData={leaveData}
        timesheetData={timesheetData}
        approvalAgeingData={approvalAgeingData}
        approvalPendingData={approvalPendingData}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </section>
  );
};

const DashboardMobile = () => {
  const [activeTab, setActiveTab] = useState("project");
  const [leaveData, setLeaveData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [showProjectInfo1, setShowProjectInfo1] = useState(false);
  const [leaveid, setLeaveid] = useState([]);
  const [projectID, setprojectID] = useState([]);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveModalOpen1, setApproveModalOpen1] = useState(false);
  const [approveModalOpen2, setApproveModalOpen2] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const accessToken = sessionStorage.getItem("token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const [statusID, setStatusID] = useState("");
  const [cat, setCat] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user.data.employeeId;
  const [refresh, setRefresh] = useState("");
  const employeeId = userdata?.data?.employeeId;
  const [approvalPendingData, setApprovalPendingData] = useState({
    leavesCount: 0,
    timesheetCount: 0,
    projectCount: 0,
  });
  const [approvalAgeingData, setApprovalAgeingData] = useState({
    leavesCount: 0,
    timesheetCount: 0,
    projectCount: 0,
  });

  const UserID = userdata?.data?.employeeId;

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Fetch leave data
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetLeavesList?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Mobile Leave Data:", response.data);
        setLeaveData(response.data.data.listInitiativeDetailEntity);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    // Fetch project data
    const fetchProjectData = async () => {
      //
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectList?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProjectData(response.data.data.listMyApprovalProjectEntity);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    // Fetch timesheet data
    const fetchTimesheetData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetTimesheetList?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTimesheetData(response.data.data.listMyApprovalTimesheeEntity);
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      }
    };

    // Fetch overall approval pending pie chart data
    const fetchApprovalPendingData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetApprovalPendingCount?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApprovalPendingData(
          response.data.data.listMyApprovalPendingCountEntity[0]
        );
      } catch (error) {
        console.error("Error fetching approval pending data:", error);
      }
    };

    // Fetch approval ageing > 5 data
    const fetchApprovalAgeingData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetApprovalAgeingCount?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApprovalAgeingData(
          response.data.data.listMyApprovalAgeingCountEntity[0]
        );
      } catch (error) {
        console.error("Error fetching approval ageing data:", error);
      }
    };

    fetchLeaveData();
    fetchProjectData();
    fetchTimesheetData();
    fetchApprovalPendingData();
    fetchApprovalAgeingData();
  }, [refresh]);

  return (
    <>
      <ContentWrapper
        projectData={projectData}
        leaveData={leaveData}
        timesheetData={timesheetData}
        approvalAgeingData={approvalAgeingData}
        approvalPendingData={approvalPendingData}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {/* <Offcanvas /> */}
    </>
  );
};

export default DashboardMobile;
