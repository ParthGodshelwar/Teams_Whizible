import React, { useState, useEffect } from "react";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Box, IconButton, Typography } from "@mui/material"; // Import Material-UI components
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Project from "../../../assets/latest/img/Project-orange.svg";
import ResourceTS from "../../../assets/latest/img/ResourceTS-icon.svg";
import {
  Drawer,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import Leaves from "../../../assets/latest/img/Leaves-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as farThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown as farThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faRectangleList as fasRectangleList } from "@fortawesome/free-solid-svg-icons";
import ProjectInfo from "./ProjectInfo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaveInfo from "./LeaveInfo";
import DashboardMobile from "./DashboardMobile";
import { Tab, Nav } from "react-bootstrap";
import {
  faRectangleList,
  faThumbsUp as fasThumbsUp,
  faThumbsDown as fasThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip1 from "@mui/material/Tooltip";
import useResponsive from "app/hooks/useMediaQuery";
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("project");
  const [leaveData, setLeaveData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [showProjectInfo1, setShowProjectInfo1] = useState(false);
  const [leaveid, setLeaveid] = useState([]);
  const [projectid, setProjectid] = useState([]);
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

  const UserID = userdata?.data?.employeeId;
  // Toggle function to show/hide ProjectInfo
  const toggleProjectInfo = () => {
    console.log("showProjectInfo", showProjectInfo);
    setShowProjectInfo(!showProjectInfo);
  };
  const toggleProjectInfo1 = () => {
    console.log("showProjectInfo", showProjectInfo1);
    setShowProjectInfo1(!showProjectInfo1);
  };
  const handleModalClose = () => {
    setApproveModalOpen(false);
    setApprovalComment("");
  };
  const handleModalClose1 = () => {
    setApproveModalOpen1(false);
    setApprovalComment("");
  };
  const handleModalClose2 = () => {
    setApproveModalOpen2(false);
    setApprovalComment("");
  };
  const handleApproveClick = () => setApproveModalOpen(true);
  const handleApproveClick1 = () => setApproveModalOpen1(true);
  const handleApproveClick2 = () => setApproveModalOpen2(true);
  const handleApprovalSubmit = async () => {
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
          setRefresh(!refresh);
          setApproveModalOpen(false); // Close modal after success
          setApprovalComment("");
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
      // toast.error("Error during submission or email sending");
    }
  };
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
  const handleApprovalSubmit2 = async () => {
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
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/UpdateTimesheet?UserID=${UserID}&TImesheetID=${leaveid}&Comments=${comments}&Status=V}`,
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
            setRefresh(!refresh);
            setApproveModalOpen2(false);
            setApprovalComment("");
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
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/UpdateTimesheet?UserID=${UserID}&TImesheetID=${leaveid}&Comments=${comments}&Status=J`,
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
            setRefresh(!refresh);
            setApproveModalOpen2(false);
            setApprovalComment("");
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Other State Variables...
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
  const data = {
    labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Fetch leave data
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetLeavesList?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Leave Data:", response.data);
        setLeaveData(response.data.data.listInitiativeDetailEntity);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    // Fetch project data
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectList?UserID=${userid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Project Data:", response.data);
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
        console.log(
          "Timesheet Data:",
          response.data.data.listMyApprovalTimesheeEntity
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
        console.log("Approval Pending Data:", response.data);
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
        console.log("Approval Ageing Data:", response.data);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProjectData = projectData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const currentLeaveData = leaveData.slice(indexOfFirstItem, indexOfLastItem);
  const currentTimesheetData = timesheetData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Data for charts using fetched approval pending and approval ageing counts
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
  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // approve outside btn
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
    const accessToken = sessionStorage.getItem("token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const UserID = userdata?.data?.employeeId;
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
        setApproveModalOpen(true); // Open modal for rejection
        setStatusID(3); // Set status to Reject
      } else {
        toast.error(validateResponse.data.data[0].result);
      }
    } catch (error) {
      console.error("Error during validation:", error);
    }
  };
  console.log("activeTab", activeTab);
  const isMobile = useResponsive();

  return (
    <>
      {/* added by Parth.G For mobile view */}
      {isMobile ? (
        <DashboardMobile />
      ) : (
        <>
          <div className="container">
            {/* Header Section */}
            <Tab.Container defaultActiveKey="project" onSelect={handleTabClick}>
              <Nav
                variant="tabs"
                id="AllEntityTab"
                // className="pe-3"
                className="pe-3 d-flex justify-content-end mt-2"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="project"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <img
                      src={Project}
                      alt="Project Icon"
                      className="ApprIcns"
                    />
                    Project
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="leave"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <img src={Leaves} alt="Leaves Icon" className="ApprIcns" />
                    Leaves
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="timesheet"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <img
                      src={ResourceTS}
                      alt="Timesheet Icon"
                      className="ApprIcns"
                    />
                    Timesheet
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <div className="row mt-4" style={{ display: "flex" }}>
                <div
                  className="col-lg-4 col-md-4"
                  style={{ width: "30%", paddingRight: "15px" }}
                >
                  <div style={{ width: "90%", height: "300px" }}>
                    <h5>Overall Approval Pending</h5>
                    <Pie data={pieData} options={options} />
                  </div>
                  <div
                    className="chart-container mt-3"
                    style={{ width: "80%", height: "300px" }}
                  >
                    <h5>{`Approval Ageing > 5`}</h5>
                    <div style={{ height: "300px", width: "100%" }}>
                      {" "}
                      {/* Increased height to 500px */}
                      <Bar data={barData} options={barOptions} />
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-8 col-md-8"
                  style={{ width: "70%", paddingLeft: "15px" }}
                >
                  {/* Conditional Rendering for Tables */}
                  {/* Project Section */}
                  {activeTab === "project" && (
                    <div className="mt-2">
                      <h5 className="dark-blue">Project</h5>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Project Code</th>
                              <th>Project Name</th>
                              <th>Organization Unit</th>

                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Work (Hrs)</th>
                              <th>Current Stage</th>
                              <th>Revision Details</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentProjectData.length === 0 ? (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  No Data Available
                                </td>
                              </tr>
                            ) : (
                              currentProjectData.map((project) => (
                                <tr key={project.projectID}>
                                  <td style={{ width: "10%" }}>
                                    {project.projectCode}
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    {project.projectName}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {project.organizationUnit}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {project.expectedStartDate}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {project.expectedEndDate}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {project.estimatedEfforts}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {project.requeststage}
                                  </td>
                                  <td style={{ width: "15%" }}>
                                    {project.revisionDetails}
                                  </td>
                                  <td className="" style={{ width: "10%" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                      }}
                                    >
                                      <button
                                        className="btn p-0"
                                        type="button"
                                        aria-label="Details"
                                        onClick={() => {
                                          toggleProjectInfo();
                                          setProjectid(project.projectID);
                                        }}
                                      >
                                        <Tooltip1 title="Details">
                                          <FontAwesomeIcon
                                            icon={faRectangleList}
                                            className="fnt-16"
                                            style={{ color: "#33b3b" }}
                                          />
                                        </Tooltip1>
                                      </button>

                                      <button
                                        className="btn p-0"
                                        type="button"
                                        aria-label="Approve"
                                        onClick={() => {
                                          console.log(
                                            "project.projectID",
                                            project.projectID
                                          );
                                          setProjectid(project.projectID);
                                          handleApprove();
                                        }}
                                      >
                                        <Tooltip1 title="Approve">
                                          <FontAwesomeIcon
                                            icon={fasThumbsUp}
                                            className="text-green fnt-16"
                                          />
                                        </Tooltip1>
                                      </button>

                                      <button
                                        className="btn p-0"
                                        type="button"
                                        aria-label="Reject"
                                        onClick={() => {
                                          setProjectid(project.projectID);
                                          handleReject();
                                        }}
                                      >
                                        <Tooltip1 title="Reject">
                                          <FontAwesomeIcon
                                            icon={fasThumbsDown}
                                            className="textRed fnt-16"
                                          />
                                        </Tooltip1>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Leave Section */}
                  {/* Leave Section */}
                  {/* Leave Section */}
                  {activeTab === "leave" && (
                    <div className="mt-2">
                      {/* <div className="col-sm-12 text-end mb-3">
                  <a
                    href="javascript:;"
                    className="btn greenBrdrbtn me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#approveRevModal"
                  >
                    <span data-bs-toggle="tooltip" data-bs-original-title="Approve">
                      Approve
                    </span>
                  </a>
                  <a
                    href="javascript:;"
                    className="btn redBrdrbtn me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#rejectRevModal"
                  >
                    <span data-bs-toggle="tooltip" data-bs-original-title="Reject">
                      Reject
                    </span>
                  </a>
                </div> */}
                      <h5 className="dark-blue">Leave</h5>

                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Employee Name</th>
                              <th>Leave Type</th>
                              <th>Role Description </th>
                              <th>From Date</th>
                              <th>To Date</th>
                              <th>Actions</th>
                              {/* <th>
                          <input
                            type="checkbox"
                            // onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {currentLeaveData.length > 0 ? (
                              currentLeaveData.map((leave, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    transition: "background-color 0.3s ease",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#c77d7d")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "white")
                                  }
                                >
                                  <td>
                                    <img
                                      src={leave.employeeImage}
                                      alt={leave.employeeImage}
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                        borderRadius: "50%",
                                        marginRight: "8px",
                                      }}
                                    />
                                    {leave.employeeName}
                                  </td>
                                  <td>{leave.leaveType}</td>
                                  <td>{leave.roleDescription}</td>
                                  <td>{leave.fromDate}</td>
                                  <td>{leave.toDate}</td>

                                  <td>
                                    <button
                                      data-bs-toggle="tooltip"
                                      className="btn p-0"
                                      type="button"
                                      aria-label="Approve"
                                      data-bs-original-title="Approve"
                                    >
                                      <span
                                        data-bs-toggle="modal"
                                        data-bs-target="#approveRevModal"
                                      >
                                        <Tooltip1 title="Details">
                                          <FontAwesomeIcon
                                            icon={fasRectangleList}
                                            className="fnt-16"
                                            style={{ color: "#33b3b" }}
                                            onClick={() => {
                                              toggleProjectInfo1();
                                              setLeaveid(leave.leaveID);
                                            }}
                                          />
                                        </Tooltip1>
                                      </span>
                                    </button>
                                    <button
                                      data-bs-toggle="tooltip"
                                      className="btn p-0"
                                      type="button"
                                      aria-label="Approve"
                                      data-bs-original-title="Approve"
                                      onClick={() => {
                                        setStatusID(2);
                                        setCat(2);
                                        setLeaveid(leave.leaveID);
                                        handleApproveClick1();
                                      }}
                                    >
                                      <span
                                        data-bs-toggle="modal"
                                        data-bs-target="#approveRevModal"
                                      >
                                        <Tooltip1 title="Approve">
                                          <FontAwesomeIcon
                                            icon={farThumbsUp}
                                            className="text-green fnt-16 mr-1 ml-1"
                                          />
                                        </Tooltip1>
                                      </span>
                                    </button>
                                    <button
                                      data-bs-toggle="tooltip"
                                      className="btn p-0"
                                      type="button"
                                      aria-label="Reject"
                                      data-bs-original-title="Reject"
                                      onClick={() => {
                                        setStatusID(3);
                                        setCat(2);
                                        setLeaveid(leave.leaveID);
                                        handleApproveClick1();
                                      }}
                                    >
                                      <span
                                        data-bs-toggle="modal"
                                        data-bs-target="#rejectRevModal"
                                      >
                                        <Tooltip1 title="Reject">
                                          <FontAwesomeIcon
                                            icon={farThumbsDown}
                                            className="textRed fnt-16"
                                          />
                                        </Tooltip1>
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  No Data Available
                                </td>{" "}
                                {/* Adjust the colspan to match your table structure */}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Timesheet Section */}
                  {activeTab === "timesheet" && (
                    <div className="mt-2">
                      {/* <div className="col-sm-12 text-end mb-3">
                  <a
                    href="javascript:;"
                    className="btn greenBrdrbtn me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#approveRevModal"
                  >
                    <span data-bs-toggle="tooltip" data-bs-original-title="Approve">
                      Approve
                    </span>
                  </a>
                  <a
                    href="javascript:;"
                    className="btn redBrdrbtn me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#rejectRevModal"
                  >
                    <span data-bs-toggle="tooltip" data-bs-original-title="Reject">
                      Reject
                    </span>
                  </a>
                </div> */}
                      <h5 className="dark-blue">Timesheet</h5>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Employee Name</th>
                              <th>Expected Hours</th>
                              <th>Actual Hours</th>
                              <th>Billable Hours</th>
                              <th>Non-Billable Hours</th>
                              <th>Leave Taken</th>
                              <th> From Date</th>
                              <th>To date</th>
                              <th> Submitted date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentTimesheetData.length > 0 ? (
                              currentTimesheetData.map((timesheet, index) => (
                                <tr key={index}>
                                  <td>
                                    <img
                                      src={timesheet.employeeImg}
                                      alt={timesheet.employeeImg}
                                      style={{
                                        width: "17px",
                                        height: "17px",
                                        borderRadius: "50%",
                                        marginRight: "8px",
                                      }}
                                    />
                                    {timesheet.employeeName}
                                  </td>
                                  <td>{timesheet.expectedHours}</td>
                                  <td>{timesheet.actualHours}</td>
                                  <td>{timesheet.billableHours}</td>
                                  <td>{timesheet.nonBillableHours}</td>
                                  <td>{timesheet.leavetaken}</td>
                                  <td>{timesheet.fromDate}</td>
                                  <td>{timesheet.todate}</td>
                                  <td>{timesheet.createdDate}</td>
                                  <td>
                                    <button
                                      data-bs-toggle="tooltip"
                                      className="btn p-0"
                                      type="button"
                                      aria-label="Approve"
                                      data-bs-original-title="Approve"
                                      onClick={() => {
                                        setCat(3);
                                        setStatusID(2);
                                        setLeaveid(timesheet.timesheetID);
                                        handleApproveClick2();
                                      }}
                                    >
                                      <span
                                        data-bs-toggle="modal"
                                        data-bs-target="#approveRevModal"
                                      >
                                        <Tooltip1 title="Approve">
                                          <FontAwesomeIcon
                                            icon={farThumbsUp}
                                            className="text-green fnt-16 mr-1 ml-1"
                                          />
                                        </Tooltip1>
                                      </span>
                                    </button>
                                    <button
                                      data-bs-toggle="tooltip"
                                      className="btn p-0"
                                      type="button"
                                      aria-label="Reject"
                                      data-bs-original-title="Reject"
                                      onClick={() => {
                                        setCat(3);
                                        setStatusID(3);
                                        setLeaveid(timesheet.timesheetID);
                                        handleApproveClick2();
                                      }}
                                    >
                                      <span
                                        data-bs-toggle="modal"
                                        data-bs-target="#rejectRevModal"
                                      >
                                        <Tooltip1 title="Reject">
                                          <FontAwesomeIcon
                                            icon={farThumbsDown}
                                            className="textRed fnt-16"
                                          />
                                        </Tooltip1>
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="10" className="text-center">
                                  No Data Available
                                </td>{" "}
                                {/* Adjust colSpan to match the number of columns */}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <IconButton
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                    <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
                      {currentPage}
                    </Typography>
                    <IconButton
                      onClick={handleNextPage}
                      disabled={
                        (activeTab === "project" &&
                          currentProjectData.length < itemsPerPage) ||
                        (activeTab === "leave" &&
                          currentLeaveData.length < itemsPerPage) ||
                        (activeTab === "timesheet" &&
                          currentTimesheetData.length < itemsPerPage)
                      }
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                </div>
              </div>
              <Tab.Content>
                <Tab.Pane eventKey="project">
                  <div className="project-info-section">
                    <ProjectInfo
                      setStatusID={setStatusID}
                      setCat={setCat}
                      handleApproveClick={handleApproveClick}
                      showProjectInfo={showProjectInfo}
                      toggleProjectInfo={toggleProjectInfo}
                      projectid={projectid}
                    />
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="leave">
                  <div className="project-info-section">
                    <LeaveInfo
                      showProjectInfo={showProjectInfo1}
                      toggleProjectInfo={toggleProjectInfo1}
                      leaveid={leaveid}
                      setStatusID={setStatusID}
                      handleApproveClick1={handleApproveClick1}
                      setRefresh={setRefresh}
                      refresh={refresh}
                    />
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="timesheet">
                  <div className="project-info-section">
                    <LeaveInfo
                      showProjectInfo={showProjectInfo1}
                      toggleProjectInfo={toggleProjectInfo1}
                      leaveid={leaveid}
                      setStatusID={setStatusID}
                      handleApproveClick1={handleApproveClick1}
                    />
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
            {/* Layout for Charts and Table */}
          </div>
          <Dialog
            open={approveModalOpen}
            onClose={handleModalClose}
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiDialogPaper-root": {
                height: "60%", // Increased height from 40% to 60% (adjust as needed)
                maxHeight: "80vh", // Prevent it from exceeding 80% of the viewport height
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
              {statusID === 2 ? "Approve" : "Reject"}
              <Tooltip1 title="Close">
                <CloseIcon
                  onClick={handleModalClose}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px", // Add space after the "Issues" title
                    marginRight: "10px", // Add space after the close icon
                  }}
                />
              </Tooltip1>
            </DialogTitle>

            <DialogContent sx={{ minHeight: "100px" }}>
              <Box sx={{ marginBottom: "16px" }}>
                {/* Optionally, you can add some text or other content here */}
              </Box>
              <TextField
                label={
                  statusID === 2 ? "Approval Comments:" : "Rejection Comments:"
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
                {statusID === 2 ? "Approve" : "Reject"}
              </Button>
              <Button
                onClick={handleModalClose}
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={approveModalOpen1}
            onClose={handleModalClose1}
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiDialogPaper-root": {
                height: "60%", // Increased height from 40% to 60% (adjust as needed)
                maxHeight: "80vh", // Prevent it from exceeding 80% of the viewport height
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
              {statusID === 2 ? "Approve" : "Reject"}
              <Tooltip1 title="Close">
                <CloseIcon
                  onClick={handleModalClose1}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px", // Add space after the "Issues" title
                    marginRight: "10px", // Add space after the close icon
                  }}
                />
              </Tooltip1>
            </DialogTitle>

            <DialogContent sx={{ minHeight: "100px" }}>
              <Box sx={{ marginBottom: "16px" }}>
                {/* Optionally, you can add some text or other content here */}
              </Box>
              <TextField
                label={
                  statusID === 2 ? "Approval Comments:" : "Rejection Comments:"
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
                onClick={handleApprovalSubmit1}
                variant="contained"
                color="success"
              >
                {statusID === 2 ? "Approve" : "Reject"}
              </Button>
              <Button
                onClick={handleModalClose1}
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={approveModalOpen2}
            onClose={handleModalClose2}
            maxWidth="sm"
            fullWidth
            sx={{
              "& .MuiDialogPaper-root": {
                height: "60%", // Increased height from 40% to 60% (adjust as needed)
                maxHeight: "80vh", // Prevent it from exceeding 80% of the viewport height
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
              {statusID === 2 ? "Approve" : "Reject"}
              <Tooltip1 title="Close">
                <CloseIcon
                  onClick={handleModalClose2}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px", // Add space after the "Issues" title
                    marginRight: "10px", // Add space after the close icon
                  }}
                />
              </Tooltip1>
            </DialogTitle>

            <DialogContent sx={{ minHeight: "100px" }}>
              <Box sx={{ marginBottom: "16px" }}>
                {/* Optionally, you can add some text or other content here */}
              </Box>
              <TextField
                label={
                  statusID === 2 ? "Approval Comments:" : "Rejection Comments:"
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
                onClick={handleApprovalSubmit2}
                variant="contained"
                color="success"
              >
                {statusID === 2 ? "Approve" : "Reject"}
              </Button>
              <Button
                onClick={handleModalClose2}
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Dashboard;
