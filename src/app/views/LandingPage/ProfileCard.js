import React, { useEffect, useState } from "react";
import { Card, Image } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faListCheck } from "@fortawesome/free-solid-svg-icons";
import Drawer from "@mui/material/Drawer";
import { FormControl, InputLabel, Select, MenuItem, IconButton, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Carousel } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import "./Jwt.css";
import { Dropdown } from "react-bootstrap";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

// Import images
import profilePic from "../../../assets/latest/img/profile-pic.jpg";
import projectIcon from "../../../assets/latest/img/Project-icon.svg";
import timesheetIcon from "../../../assets/latest/img/Timesheet.svg";
import taskIcon from "../../../assets/latest/img/Project-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import profImg from "../../../assets/latest/img/profImg.jpg";
import milestoneIcon from "../../../assets/latest/img/Milestone-Icn.svg"; // If needed for milestones
import image1 from "../../../assets/latest/img/timesheet_alert.png";
import image2 from "../../../assets/latest/img/task_new.jpg";
import image3 from "../../../assets/latest/img/approval_pending.png";
import image4 from "../../../assets/latest/img/project_new.jpg";
import image5 from "../../../assets/latest/img/birthdaygirl-happybirthday.gif";
import image6 from "../../../assets/latest/img/task_new.jpg";
import defaultImage from "../../../assets/latest/img/task_new.jpg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Tooltip from "@mui/material/Tooltip";
const CustomCarousel = ({ items }) => {
  const getImageByTypeID = (typeID) => {
    switch (typeID) {
      case 1:
        return image5;
      case 2:
        return image5;
      case 3:
        return image1;
      case 4:
        return image2;
      case 5:
        return image3;
      case 6:
        return image4;
      default:
        return defaultImage;
    }
  };
  const getBadgeDetailsByTypeID = (typeID) => {
    switch (typeID) {
      case 1:
        return { className: "badge bdayBadge", text: "Happy Birthday" };
      case 2:
        return { className: "badge bdayBadge", text: "Birthday Wishes" };
      case 3:
        return { className: "badge AlertBadge", text: "Timesheet Alert" };
      case 4:
        return { className: "badge SuccessBadge", text: "New Task Assigned" };
      case 5:
        return { className: "badge AlertBadge", text: "Resource Timesheet Approval Pending" };
      case 6:
        return { className: "badge SuccessBadge", text: "New Project Assigned" };
      default:
        return { className: "badge AlertBadge", text: "General Alert" };
    }
  };
  return (
    <Card className="bdayCard">
      <Card.Body className="px-0">
        <Carousel controls={false} indicators={false} interval={3000} pause={false}>
          {items?.map((item, index) => {
            const { className, text } = getBadgeDetailsByTypeID(item.typeID);
            return (
              <Carousel.Item key={index}>
                <div className="d-flex flex-column align-items-center">
                  {/* Dynamic Badge */}
                  <span className={`${className} `}>{text}</span>

                  {/* Image */}
                  <Image
                    src={getImageByTypeID(item.typeID)}
                    alt={item.typeDec}
                    style={{ width: "70px", height: "70px", marginBottom: "8px" }}
                    roundedCircle
                  />

                  {/* Text Content */}
                  <div className="text-center">
                    <p>{item.content}</p>
                  </div>
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Card.Body>
    </Card>
  );
};

const TableContent = ({
  data = [],
  columns = [],
  currentPage,
  setCurrentPage,
  itemsPerPage = 10
}) => {
  console.log("data", data);

  const currentItems = data;
  console.log("data", data);
  const renderStatusCircle = (status) => {
    let color = "gray"; // Default color
    switch (status) {
      case "Approved":
        color = "green";
        break;
      case "Rejected":
        color = "red";
        break;
      case "Submitted":
      case "Initiated":
        color = "#00FFFF";
        break;
      case "Open":
        color = "orange";
        break;
      default:
        color = "gray"; // Default for undefined or unknown statuses
    }

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: color,
            marginRight: "5px"
          }}
        />
        <span>{status}</span>
      </div>
    );
  };
  console.log("Issue ID", currentItems);
  return (
    <div className="table-responsive ml-4">
      <table className="table" style={{ width: "98%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={col.className}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((row, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "red" : "blue",
                  color: row.isRed == 1 ? "red" : "Black" // Apply red text color if isRed is 1
                }}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.key === "status"
                      ? renderStatusCircle(row[col.key])
                      : col.label.toLowerCase().includes("date") && row[col.key]
                      ? row[col.key]
                      : row[col.key] !== undefined
                      ? row[col.key]
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2
        }}
      >
        <IconButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <span>{currentPage}</span>
        <IconButton
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={
            currentItems.length < 5 ||
            !currentItems ||
            currentItems.length <= 0 ||
            currentItems == []
          }
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </div>
  );
};
const TableContent1 = ({
  data = [],
  columns = [],
  currentPage,
  setCurrentPage,
  itemsPerPage = 10
}) => {
  console.log("data", data);

  const currentItems = data;

  const renderStatusCircle = (status) => {
    let color = "gray"; // Default color
    switch (status) {
      case "Approved":
        color = "green";
        break;
      case "Rejected":
        color = "red";
        break;
      case "Submitted":
      case "Initiated":
        color = "#00FFFF";
        break;
      case "Open":
        color = "orange";
        break;
      default:
        color = "gray"; // Default for undefined or unknown statuses
    }

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: color,
            marginRight: "5px"
          }}
        />
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="table-responsive ml-4">
      <table className="table" style={{ width: "98%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={col.className}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((row, index) => {
              console.log("row.isRed", row.isRed); // Check the value of isRed in the console
              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "red" : "blue"
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        color: row.isRed ? "red" : "Black" // Apply color here
                      }}
                    >
                      {col.key === "status"
                        ? renderStatusCircle(row[col.key])
                        : col.label.toLowerCase().includes("date") && row[col.key]
                        ? row[col.key]
                        : row[col.key] !== undefined
                        ? row[col.key]
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2
        }}
      >
        <IconButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <span>{currentPage}</span>
        <IconButton
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentItems.length < 5 || !currentItems || currentItems.length <= 0}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </div>
  );
};
// Example usage

// Date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Converts to a readable date format (e.g., MM/DD/YYYY)
};

// Main UserProfilePage Component
const UserProfilePage = () => {
  const [drawerOpen, setDrawerOpen] = useState({
    issues: false,
    projects: false,
    milestones: false,
    timesheets: false,
    tasks: false
  });

  const [attentionData, setAttentionData] = useState([]);
  const [issueList, setIssueList] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [myTimesheets, setMyTimesheets] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const profilepic = userdata?.data?.profilePicURL;
  const employee = userdata?.data?.employeeName;
  const roleName = userdata?.data?.roleName;
  const [selectedOption, setSelectedOption] = useState("R"); // Default value 'V'
  const [currentPage, setCurrentPage] = useState(1);
  const employeeId = userdata?.data?.employeeId;
  const accessToken = sessionStorage.getItem("token");
  const columns1 = [
    { key: "issueID", label: "Issue ID" },
    { key: "projectName", label: "Project Name" },
    { key: "reportedDate", label: "Reported Date" },
    { key: "summary", label: "Summary" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "subType", label: "Sub Type" },
    { key: "priority", label: "Priority" },
    { key: "ageing", label: "Ageing" },
    { key: "lastUpdated", label: "Last Updated" }

    // { key: "isRed", label: "Is Red" }
  ];
  const projectColumns = [
    { key: "projectName", label: "Project Name" },
    { key: "status", label: "Status" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "projectDuration", label: "Project Duration" },
    { key: "allPecentage", label: "Allocation Percentage" },
    { key: "tPeffort", label: "Total Planned Efforts" },
    { key: "aworkH", label: "Actual Work Hours" },
    { key: "billableH", label: "Billable Hours" },
    { key: "nonBillableHours", label: "Non-Billable Hours" }
  ];
  const taskColumns = [
    { key: "taskName", label: "Task Name" },
    { key: "projectName", label: "Project Name" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "bStartDate", label: "Baseline Start Date" },
    { key: "bEndDate", label: "Baseline End Date" },
    { key: "aStartDate", label: "Actual Start Date" },
    { key: "aEndDate", label: "Actual End Date" },
    { key: "tPwork", label: "Work Hours" },
    { key: "aworkH", label: "Actual Work Hours" },
    // { key: "acualPec", label: "Actual Percentage" },
    { key: "status", label: "Status" }
    // { key: "tdelay", label: "Delay" }
  ];

  const timesheetColumns = [
    // { key: "empID", label: "Employee ID" },
    { key: "submittedDate", label: "Submitted Date" },
    { key: "tPeriod", label: "Time " },
    { key: "aworkH", label: "Actual Work Hours" },
    { key: "status", label: "Status" },
    { key: "remark", label: "Approve/Reject Comment" }
  ];

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const fetchData = async () => {
    try {
      // Fetching attention data
      if (
        !drawerOpen.issues &&
        !drawerOpen.tasks &&
        !drawerOpen.projects &&
        !drawerOpen.timesheets
      ) {
        const attentionResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetMessage?empID=${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const attentionData = await attentionResponse.json();
        setAttentionData(attentionData.data);
      }
      // Fetching issue list
      if (drawerOpen.issues) {
        const issueResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetIssueList?empID=${employeeId}&PageNo=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const issueData = await issueResponse.json();
        setIssueList(issueData.data);
      }
      if (drawerOpen.tasks) {
        const tasksResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetMyTasks?empID=${employeeId}&PageNo=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const tasksData = await tasksResponse.json();
        setMyTasks(tasksData.data);
      }
      if (drawerOpen.timesheets) {
        const timesheetResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetMyTimesheet?empID=${employeeId}&PageNo=${currentPage}&TimesheetStatusCode=${selectedOption}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const timesheetData = await timesheetResponse.json();
        setMyTimesheets(timesheetData.data);
      }
      if (drawerOpen.projects) {
        const projectResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetProject?empID=${employeeId}&PageNo=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const projectData = await projectResponse.json();
        const formattedProjects = projectData.data.map((project) => ({
          ...project,
          startDate: project.startDate,
          endDate: project.endDate,
          lastUpdated: project.lastUpdated
        }));
        setProjectList(formattedProjects);
      }
      // Set carousel items
      const carouselItems = attentionData.data.map((item) => ({
        typeDec: item.typeDec,
        content: item.content
      }));
      setCarouselItems(carouselItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption, currentPage, drawerOpen]);

  const handleDrawerToggle = (drawer, open) => {
    setCurrentPage(1);
    setDrawerOpen({ ...drawerOpen, [drawer]: open });
  };

  return (
    <div className="col-12 mb-2 d-flex">
      <div className="profImgSec position-relative d-inline-block">
        <Image
          src={profilepic}
          alt=""
          className="profileImg img-fluid rounded-circle"
          style={{ width: "130px", height: "130px" }} // Set width and height to 130px
        />
      </div>

      <div className="d-flex flex-column justify-content-between flex-1 ps-5 w-100">
        <div className="profileContent">
          <div className="row">
            <div className="col-lg-4 col-12">
              <div className="profileInfo">
                <div className="profileName mb-2">
                  <span className="pageHeading" style={{ fontSize: "14px" }}>
                    Welcome, {employee}
                  </span>
                </div>

                <div className="mb-3">
                  {/* <Image src={profilePic} alt="Profile Pic" className="smallImg" roundedCircle /> */}
                  <span id="profileTitle" className="smallTxt">
                    {roleName}
                  </span>
                </div>
                <div className="profileContent">
                  Have a Wonderful Day! <br />
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-12">
              <CustomCarousel items={attentionData} />
            </div>
          </div>
        </div>
        <div className="IconsSection mt-4 mb-4">
          <div className="row">
            <div className="IconsContent greyTxt">
              <div className="iconCards" onClick={() => handleDrawerToggle("issues", true)}>
                <div className="IconCardImg">
                  <FontAwesomeIcon icon={faGlobe} />
                </div>
                <div className="IconCardTxt text-center mt-2">Issues</div>
              </div>
              <div className="iconCards" onClick={() => handleDrawerToggle("projects", true)}>
                <div className="IconCardImg">
                  <Image src={projectIcon} alt="Projects" />
                </div>
                <div className="IconCardTxt text-center mt-2">Projects</div>
              </div>
              <div className="iconCards" onClick={() => handleDrawerToggle("tasks", true)}>
                <div className="IconCardImg">
                  <FontAwesomeIcon icon={faListCheck} size="2x" />
                  {/* <Image src={taskIcon} alt="My Tasks" /> */}
                </div>
                <div className="IconCardTxt text-center mt-2">Tasks</div>
              </div>
              <div className="iconCards" onClick={() => handleDrawerToggle("timesheets", true)}>
                <div className="IconCardImg">
                  <FontAwesomeIcon icon={faFileLines} size="2x" />
                  {/* <Image src={timesheetIcon} alt="Timesheets" /> */}
                </div>
                <div className="IconCardTxt text-center mt-2">Timesheets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer components for different sections */}
      <Drawer
        anchor="right"
        open={drawerOpen.issues}
        onClose={() => handleDrawerToggle("issues", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden" // Prevent scrolling on the drawer itself
          }
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3"
            }}
          >
            <h5 style={{ marginTop: "5px", marginLeft: "10px", marginRight: "10px" }}>Issues</h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("issues", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px" // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>

          <TableContent1
            data={issueList}
            columns={columns1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={drawerOpen.projects}
        onClose={() => handleDrawerToggle("projects", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden" // Prevent scrolling on the drawer itself
          }
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3"
            }}
          >
            <h5 style={{ marginTop: "5px", marginLeft: "10px", marginRight: "10px" }}>Projects</h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("projects", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px" // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>
          <TableContent
            data={projectList}
            columns={projectColumns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={drawerOpen.tasks}
        onClose={() => handleDrawerToggle("tasks", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden" // Prevent scrolling on the drawer itself
          }
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3"
            }}
          >
            <h5 style={{ marginTop: "5px", marginLeft: "10px", marginRight: "10px" }}>Tasks</h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("tasks", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px" // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>
          <TableContent
            data={myTasks}
            columns={taskColumns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={drawerOpen.timesheets}
        onClose={() => handleDrawerToggle("timesheets", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden" // Prevent scrolling on the drawer itself
          }
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3"
            }}
          >
            <h5 style={{ marginTop: "5px", marginLeft: "10px", marginRight: "10px" }}>
              Timesheets
            </h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("timesheets", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px" // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>
          <FormControl
            className="mt-5 mb-2"
            variant="outlined"
            style={{ width: "120px", height: "40px", marginLeft: "auto" }}
          >
            <InputLabel id="status-select-label">Select Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={selectedOption}
              onChange={handleChange}
              label="Select Status"
              style={{ height: "40px" }} // Adjust height here
            >
              <MenuItem value="J">Rejected</MenuItem>
              <MenuItem value="R">Submitted</MenuItem>
              <MenuItem value="V">Approved</MenuItem>
            </Select>
          </FormControl>

          <TableContent
            data={myTimesheets}
            columns={timesheetColumns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default UserProfilePage;
