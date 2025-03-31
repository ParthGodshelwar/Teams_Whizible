import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import axios from "axios";
import ProjectDrawer from "./ProjectDrawer";
import { toast, ToastContainer } from "react-toastify";
import ChecklistDrawer from "./ChecklistDrawer";
import Tooltip from "@mui/material/Tooltip";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const ProjectInfo = ({
  setCat,
  handleApproveClick,
  showProjectInfo,
  toggleProjectInfo,
  projectid,
}) => {
  const [projectData, setProjectData] = useState(null);
  const [hold, setHold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChecklistDrawer, setShowChecklistDrawer] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [resumeComment, setResumeComment] = useState("");
  const [holdComment, setHoldComment] = useState("");
  // New state for modal
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [statusID, setStatusID] = useState(null); // To check if it's approve or reject
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.data?.employeeId;

  const fetchProjectHold = async () => {
    if (!projectid) return;

    setLoading(true);
    setError(null);

    const accessToken = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectOnHoldComments?ProjectID=${projectid}&TagID=32`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const projectDetails =
        response.data?.data?.listProjectCommentsEntity?.[0];
      setHold(projectDetails || {});
      setHoldComment(projectDetails?.projectOnHoldComments);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Failed to fetch project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectid) return;

      setLoading(true);
      setError(null);

      const accessToken = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectDetails?ProjectID=${projectid}`,
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
  }, [projectid]);
  const handleResumeTimesheetSubmit = async () => {
    const accessToken = sessionStorage.getItem("token");
    if (!resumeComment || resumeComment.trim() === "") {
      toast.error("Comment should not be left blank.");
      return; // Exit the function
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/PostResumeTimesheet?ProjectID=${projectid}&Comments=${resumeComment}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response?.status === 200) {
        toast.success("Timesheet resumed successfully.");
        setResumeModalOpen(false); // Close modal
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
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/PostProjectOnHold?ProjectID=${projectid}&Comments=${holdComment}&UseID=${UserID}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response?.status === 200) {
        toast.success("Project Put on Hold Successfully.");
        setHoldModalOpen(false); // Close modal
      } else {
        toast.error(response?.data?.result || "Failed to resume timesheet.");
      }
    } catch (err) {
      console.error("Error resuming timesheet:", err);
      toast.error("An error occurred. Please try again.");
    }
  };
  // Approve function
  const handleApprove = async () => {
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
      console.log("validateResponse", validateResponse);
      if (validateResponse.data.data[0].result === "Success") {
        toast.success("Project Validation successfully.");
        setApproveModalOpen(true); // Open modal if validation is successful
        setStatusID(1); // Set status to Approve
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during approval validation:", error);
    }
  };

  // Reject function
  const handleReject = async () => {
    const accessToken = sessionStorage.getItem("token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;
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
        setApproveModalOpen(true); // Open modal for rejection
        setStatusID(2); // Set status to Reject
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during validation:", error);
    }
  };

  // Submit Approval or Rejection
  const handleApprovalSubmit = async () => {
    console.log("handleApprovalSubmit", projectid);
    const accessToken = sessionStorage.getItem("token");
    const comments = approvalComment;

    if (!comments || comments.trim() === "") {
      toast.error("Comment should not be left blank!");
      return;
    }

    try {
      let response;

      if (statusID === 1) {
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
          setApproveModalOpen(false); // Close modal after success
          setApprovalComment("");
        } else {
          toast.error("Failed to submit approval");
          alert("Failed to submit approval/rejection.");
          return; // Stop execution if the approval fails
        }
      } else if (statusID === 2) {
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
          setApproveModalOpen(false); // Close modal after success
          setApprovalComment("");
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

  // Handle modal close
  const handleModalClose = () => {
    setApproveModalOpen(false);
    setApprovalComment("");
  };

  return (
    <Drawer
      anchor="right"
      open={showProjectInfo}
      onClose={toggleProjectInfo}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80vw",
          height: "100%",
          overflow: "hidden", // Prevent scrolling on the drawer itself
        },
      }}
    >
      <div
        className="offcanvas-body"
        style={{
          overflowY: "auto", // Enable vertical scrolling
          overflowX: "hidden", // Hide horizontal scrolling
        }}
      >
        {/* Drawer Header */}
        <div className="graybg container-fluid py-1 mb-2">
          <div className="row">
            <div className="col-sm-6">
              <h5 className="pgtitle">Project Information</h5>
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

        {/* Loading State */}
        {loading && <h5>Loading...</h5>}

        {/* Error State */}
        {error && <h5 className="text-danger">{error}</h5>}

        {/* Content */}
        {!loading && !error && projectData && (
          <>
            {/* Action Buttons */}
            <div className="row mt-2 mb-2">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-2"></div>
                  <div className="col-sm-10">
                    <div className="apprBtns d-flex justify-content-end gap-2">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleApprove}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleReject}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setHoldModalOpen(true);
                          fetchProjectHold();
                        }}
                      >
                        Put On Hold
                      </Button>
                      <Button
                        onClick={() => setShowChecklistDrawer(true)}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Checklist Responses
                      </Button>
                      <Button
                        onClick={() => setResumeModalOpen(true)}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Resume Timesheet
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ProjInfoDetailsContent">
              <h6 className="text-end">
                Status:{" "}
                <span className="color-red">
                  {projectData.projectStatus || "N/A"}
                </span>
              </h6>

              {/* Project Information Accordion */}
              <div className="mb-3 mt-3">
                <h5>Details</h5>
                <div className="main-form">
                  <div className="row mt-2">
                    {Object.entries(projectData).map(([key, value], index) => (
                      <div className="col-sm-6 mb-3" key={index}>
                        <div className="row">
                          <div className="col-sm-5 text-end">
                            <label>
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </label>
                          </div>
                          <div className="col-sm-7 text-start">
                            <span>{value !== null ? value : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Checklist Drawer */}
      {showChecklistDrawer && (
        <ProjectDrawer
          showDrawer={showChecklistDrawer}
          toggleDrawer={() => setShowChecklistDrawer(false)}
          projectID={projectid}
        />
      )}

      <ChecklistDrawer
        showDrawer={showChecklistDrawer}
        toggleDrawer={() => setShowChecklistDrawer(false)}
        projectID={projectid}
      />
      <Dialog
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialogPaper-root": {
            height: "70%", // Increased height from default to 70% of the viewport height
            maxHeight: "80vh", // Prevents the dialog from exceeding 80% of the viewport height
            overflowY: "auto", // Adds scroll if content exceeds the set height
          },
        }}
      >
        <DialogTitle>Resume Timesheet</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: "16px" }}>
            {/* Optionally, you can add some text or other content here */}
          </Box>
          <TextField
            label="Comments"
            variant="outlined"
            fullWidth
            multiline
            required
            value={resumeComment}
            onChange={(e) => setResumeComment(e.target.value)}
            placeholder="Enter your comments..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleResumeTimesheetSubmit}
            variant="contained"
            color="success"
          >
            OK
          </Button>
          <Button
            onClick={() => setResumeModalOpen(false)}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={holdModalOpen}
        onClose={() => setHoldModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialogPaper-root": {
            height: "70%", // Increased height from default to 70% of the viewport height
            maxHeight: "80vh", // Prevents the dialog from exceeding 80% of the viewport height
            overflowY: "hidden", // Hides the scrollbar for vertical overflow
            width: "80%", // Sets the width to 80% of the viewport width
          },
        }}
      >
        <DialogTitle>
          Put on Hold
          {/* Close button with tooltip */}
          <Tooltip title="Close" placement="top">
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setHoldModalOpen(false)}
              sx={{
                position: "absolute",
                right: "19px",
                top: "8px",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ marginBottom: "16px" }}>
            {/* Optionally, you can add some text or other content here */}
          </Box>
          <TextField
            label="Comments"
            variant="outlined"
            fullWidth
            multiline
            required
            value={holdComment}
            onChange={(e) => setHoldComment(e.target.value)}
            placeholder="Enter your comments..."
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleHoldTimesheetSubmit}
            variant="contained"
            color="success"
          >
            OK
          </Button>
          <Button
            onClick={() => setHoldModalOpen(false)}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={approveModalOpen}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialogPaper-root": {
            height: "70%", // Increased height from default to 70% of the viewport height
            maxHeight: "80vh", // Prevents the dialog from exceeding 80% of the viewport height
            overflowY: "auto", // Adds scroll if content exceeds the set height
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {statusID === 1 ? "Approve" : "Reject"}
          <Tooltip title="Close">
            <CloseIcon
              onClick={handleModalClose}
              style={{
                cursor: "pointer",
                marginLeft: "10px", // Add space after the "Issues" title
                marginRight: "10px", // Add space after the close icon
              }}
            />
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "100px" }}>
          <Box sx={{ marginBottom: "16px" }}>
            {/* Optionally, you can add some text or other content here */}
          </Box>
          <TextField
            label={
              statusID === 1 ? "Approval Comments:" : "Rejection Comments:"
            }
            variant="outlined"
            fullWidth
            multiline
            required
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleApprovalSubmit}
            variant="contained"
            color="success"
          >
            {statusID === 1 ? "Approve" : "Reject"}
          </Button>
          <Button onClick={handleModalClose} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default ProjectInfo;
