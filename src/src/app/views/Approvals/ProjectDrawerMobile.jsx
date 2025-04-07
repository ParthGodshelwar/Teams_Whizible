import { React, useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import axios from "axios";
import { Drawer } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import ChecklistDrawerMobile from "./ChecklistDrawerMobile";
import Tooltip1 from "@mui/material/Tooltip";

const ProjectDrawerMobile = ({ show, handleClose, projectId,refresh,setRefresh }) => {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [openHoldDrawer, setopenHoldDrawer] = useState(null);
  // const [showApproveDrawer, setshowApproveDrawer] = useState(null);

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusID, setStatusID] = useState("");

  const [approvalComments, setApprovalComments] = useState("");
  const [hold, setHold] = useState(null);
  const [holdComment, setHoldComments] = useState("");
  const [resumeComment, setresumeComment] = useState("");

  const fetchProjectHold = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    const accessToken = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectOnHoldComments?ProjectID=${projectId}&TagID=32`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const projectDetails =
        response.data?.data?.listProjectCommentsEntity?.[0];
      setHold(projectDetails || {});
      setHoldComments(projectDetails?.projectOnHoldComments);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Failed to fetch project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const [comments, setComments] = useState({
  //   approve: "",
  //   reject: "",
  //   hold: "",
  //   resume: "",
  // });
  // const handleChange = (e, type) => {
  //   alert("1");

  //   setComments((prev) => ({ ...prev, [type]: e.target.value }));
  // };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      
      if (!projectId) return;

      setLoading(true);
      setError(null);

      const accessToken = sessionStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectDetails?ProjectID=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const projectDetails =
          response.data?.data?.listMyApprovalProjectDetailEntity?.[0];
        setProjectData(projectDetails || {});
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to fetch project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleCloseDrawer = () => {
    setOpenDrawer(null);
    setApprovalComments("");
  };

  const handleResumeTimesheetSubmit = async () => {
    const accessToken = sessionStorage.getItem("token");
    if (!resumeComment || resumeComment.trim() === "") {
      toast.error("Comment should not be left blank.");
      return; // Exit the function
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/PostResumeTimesheet?ProjectID=${projectId}&Comments=${resumeComment}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response?.status === 200) {
        toast.success("Timesheet resumed successfully.");
        setOpenDrawer(null); // Close modal
        setRefresh((prev) => !prev);
        // handleClose();
      } else {
        toast.error(response?.data?.result || "Failed to resume timesheet.");
      }
    } catch (err) {
      console.error("Error resuming timesheet:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleHoldTimesheetSubmit = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;
    const accessToken = sessionStorage.getItem("token");
    if (!holdComment || holdComment.trim() === "") {
      toast.error("Comment should not be left blank.");
      return; // Exit the function
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/PostProjectOnHold?ProjectID=${projectId}&Comments=${holdComment}&UseID=${UserID}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response?.status === 200) {
        toast.success("Project Put on Hold Successfully.");
        setOpenDrawer(null); // Close modal
        setRefresh((prev) => !prev);
      } else {
        toast.error(response?.data?.result || "Failed to resume timesheet.");
      }
    } catch (err) {
      console.error("Error resuming timesheet:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleApprove = async () => {
    // setOpenDrawer("approve");
    const accessToken = sessionStorage.getItem("token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;
    if (!projectId) {
      return; // Stop the function execution if projectid is not present
    }
    try {
      // Call validateProjectApproval API
      const validateResponse = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/validateProjectApproval?ProjectID=${projectId}&userID=${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("validateResponse", validateResponse);
      if (validateResponse.data.data[0].result === "Success") {
        toast.success("Project Validation successfully.");
        setOpenDrawer("approve");
        // setApproveModalOpen(true); // Open modal if validation is successful
        setStatusID(1); // Set status to Approve
        
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during approval validation:", error);
    }
  };

  const handleReject = async () => {
    const accessToken = sessionStorage.getItem("token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;
    try {
      // Call validateProjectApproval API first
      const validateResponse = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/validateProjectApproval?ProjectID=${projectId}&userID=${UserID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (validateResponse.data.data[0].result === "Success") {
        toast.success("Project Validation successful.");
        // setApproveModalOpen(true); // Open modal for rejection
        setStatusID(2); // Set status to Reject
        setOpenDrawer("approve");
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during validation:", error);
    }
  };

  // Submit Approval or Rejection
  const handleApprovalSubmit = async () => {
    //kam baki hai
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;
    console.log("handleApprovalSubmit", projectId);
    const accessToken = sessionStorage.getItem("token");

    const comments = approvalComments;

    if (!comments || comments.trim() === "") {
      toast.error("Comment should not be left blank!");
      return;
    }

    try {
      let response;

      if (statusID === 1) {
        // Approve project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/ApproveProjectWorkflow?UserId=${UserID}&ProjectID=${projectId}&Comments=${comments}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.status === 200) {
          toast.success("Project approved");
          setOpenDrawer(null); // Close modal after success
          setApprovalComments("");
          setRefresh((prev) => !prev);
          handleClose();
        } else {
          toast.error("Failed to submit approval");
          alert("Failed to submit approval/rejection.");
          return; // Stop execution if the approval fails
        }
      } else if (statusID === 2) {
        // Reject project
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/RejectProjectWorkflow?UserId=${UserID}&ProjectID=${projectId}&Comments=${comments}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.status === 200) {
          toast.success("Project rejected");
          // setApproveModalOpen(false); // Close modal after success
          // setApprovalComments("");

          setOpenDrawer(null); // Close modal after success
          setApprovalComments("");
          setRefresh((prev) => !prev);
          handleClose();
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
      console.log(
        "listLeaveApprovalEntity",
        response.data.data.projectWorkFlowApprover
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
      toast.error("Error during submission or email sending");
    }
  };
  /*
  const handleApprovalSubmit1 = async () => {
    console.log("handleApprovalSubmit", projectid);
    const accessToken = sessionStorage.getItem("token");
    const comments = approvalComment;
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
            setApproveModalOpen1(false); // Close modal after success
            setRefresh(!refresh);
            setApprovalComment(""); // Clear the comment
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
            setRefresh(!refresh);
            setApproveModalOpen1(false); // Close modal after success
            setApprovalComment(""); // Clear the comment
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
*/
  const projectData1 = {
    projectName: "Marketplace",
    startDate: "01 Dec 2024",
    endDate: "31 Nov 2025",
    projectCode: "IND-16",
    workHours: "2264:00",
    organizationUnit: "Mumbai",
    currentStage: "Started",
    revisionDetails:
      "Schedule updated to 05 Dec, Timeline adjusted to 31 Dec, Effort revised to 2046:00",
  };

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="bottom"
        className="offcanvas-bottom offcanvasHeight-85"
      >
        <Offcanvas.Body className="pt-0">
          <div id="ProjInfo_Sec" className="ProjInfoDetails">
            <div className="stickyOffHeader pt-3">
              <div className="greyCloseOffcanvas" onClick={handleClose}>
                &nbsp;
              </div>
              <div className="p-2 mb-2">
                <div className="row">
                  <div className="col-10 col-sm-10">
                    <h5 className="offcanvasTitleMob mt-1">
                      Project Information
                    </h5>
                  </div>
                </div>
              </div>
              {/* //Added by parth cross button */}
              {/* <div className="col-sm-6 text-end">
                          <Tooltip1 title="Close">
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleClose}
                              aria-label="Close"
                            ></button>
                          </Tooltip1>
                        </div> */}

              <div className="row">
                  <div className="col-sm-12 col-12 pe-0">
                    <div className="apprBtns d-flex justify-content-start gap-3">
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="modal"
                        data-bs-target="#approveRevModal"
                        onClick={handleApprove}
                      >
                        <i className="fas fa-check-circle text_green pe-1"></i>{" "}
                        Approve
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#RejectDetlsOffcanvas"
                        onClick={handleReject}
                      >
                        <i className="fas fa-times-circle text_red pe-1"></i>{" "}
                        Reject
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#putOnHold_Offcanvas"
                        onClick={() => {
                          setOpenDrawer("PutOnHold");
                          fetchProjectHold();
                        }}
                      >
                        Put On Hold
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#chcklistItem_Mobile_Offcanvas"
                        onClick={() => {
                          setOpenDrawer("ChecklistResponse");
                        }}
                      >
                        Checklist Responses
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#resumeTimesheet_Offcanvas"
                        onClick={() => {
                          setOpenDrawer("ResumeTimeSheet");
                        }}
                      >
                        Resume Timesheet
                      </a>
                    </div>
                  </div>
                </div>

                <h6 className="text-end py-2">
                  <a href="javascript:;">
                    <i className="fas fa-recycle statusIcon pe-2"></i>
                  </a>
                  Status:{" "}
                  <span className="color-red">
                    {projectData ? projectData.projectStatus : "N/A"}{" "}
                  </span>
                </h6>
            </div>
            {/* <div className="row my-2">
              <div className="col-sm-12 col-12">
                <div className="row">
                  <div className="col-sm-12 col-12 pe-0">
                    <div className="apprBtns d-flex justify-content-start gap-3">
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="modal"
                        data-bs-target="#approveRevModal"
                        onClick={handleApprove}
                      >
                        <i className="fas fa-check-circle text_green pe-1"></i>{" "}
                        Approve
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#RejectDetlsOffcanvas"
                        onClick={handleReject}
                      >
                        <i className="fas fa-times-circle text_red pe-1"></i>{" "}
                        Reject
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#putOnHold_Offcanvas"
                        onClick={() => {
                          setOpenDrawer("PutOnHold");
                          fetchProjectHold();
                        }}
                      >
                        Put On Hold
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#chcklistItem_Mobile_Offcanvas"
                        onClick={() => {
                          setOpenDrawer("ChecklistResponse");
                        }}
                      >
                        Checklist Responses
                      </a>
                      <a
                        href="javascript:;"
                        className="txt_underline"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#resumeTimesheet_Offcanvas"
                        onClick={() => {
                          setOpenDrawer("ResumeTimeSheet");
                        }}
                      >
                        Resume Timesheet
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="ProjInfoDetailsContent">
              {/* <h6 className="text-end">
                <a href="javascript:;">
                  <i className="fas fa-recycle statusIcon"></i>
                </a>
                Status:{" "}
                <span className="color-red">
                  {projectData ? projectData.projectStatus : "N/A"}{" "}
                </span>
              </h6> */}

              {/* Loading State */}
              {loading && <h5>Loading...</h5>}

              {/* Error State */}
              {error && <h5 className="text-danger">{error}</h5>}

              {/* Content */}
              {!loading && !error && projectData && (
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
                                  <label>Project Code:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.projectCode}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Abbreviated Name:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.abbrivatedName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Project Name:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.projectName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Description:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.description}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Project Group:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.projectGroup !== null
                                      ? projectData.projectGroup
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Billable:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.billable}</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Start Date:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="far fa-calendar-check iconBlue pe-1"></i>
                                    {projectData.startDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>End Date:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="far fa-calendar-check iconBlue pe-1"></i>
                                    {projectData.endDate}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Commercial Details:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.commercialDetails}</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Work (Hrs):</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    <i className="far fa-clock iconBlue pe-1"></i>
                                    {projectData.workHours}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Duration (days):</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>{projectData.duration}</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label> Project Value:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.projectValue !== null
                                      ? projectData.projectValue
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label> Project Currency:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <div>
                                    {projectData.projectCurrency !== null
                                      ? projectData.projectCurrency
                                      : "N/A"}
                                    (
                                    <span className="INRCurncy">
                                      <i className="fa-solid fa-indian-rupee-sign iconBlue"></i>
                                    </span>
                                    )
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Business Group:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.businessGroup !== null
                                      ? projectData.businessGroup
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Organization Unit:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.organizationUnit !== null
                                      ? projectData.organizationUnit
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Delivery Unit:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.deliveryUnit !== null
                                      ? projectData.deliveryUnit
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Delivery Team:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.deliveryTeam !== null
                                      ? projectData.deliveryTeam
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Practice:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.practice !== null
                                      ? projectData.practice
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Project Type:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.projectType !== null
                                      ? projectData.projectType
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Customer:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.customerName !== null
                                      ? projectData.customerName
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Project Size:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.projectSize !== null
                                      ? projectData.projectSize
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>No. of Resources:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.noOfResource !== null
                                      ? projectData.noOfResource
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-6 col-12 mb-3">
                              <div className="row">
                                <div className="col-sm-5 col-5 text-end">
                                  <label>Project Status:</label>
                                </div>
                                <div className="col-sm-7 col-7 text-start">
                                  <span>
                                    {projectData.projectStatus !== null
                                      ? projectData.projectStatus
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
        <div
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
                    // className="btn btnGreen me-3"
                    className={
                      statusID === 1 ? "btn btnGreen me-3" : "btn btnRed me-3"
                    }                    
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
        </div>

        {/* Bootstrap Offcanvas Drawer for Project Hold*/}
        <div
          className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
            openDrawer === "PutOnHold" ? "show" : ""
          }`}
          tabIndex="-1"
          style={{
            visibility: openDrawer === "PutOnHold" ? "visible" : "hidden",
            transition: "0.3s ease-in-out",
          }}
        >
          <div className="offcanvas-body">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Put on Hold</h5>
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
                      value={holdComment}
                      onChange={(e) => setHoldComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="text-center my-2">
                  <a
                    href="javascript:;"
                    className="btn btnGreen me-3"
                    onClick={handleHoldTimesheetSubmit}
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

        {/* Bootstrap Offcanvas Drawer for ResumeTimesheet*/}
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
                    className="btn btnGreen me-3"
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
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Offcanvas>
    </>
  );
};

export default ProjectDrawerMobile;
