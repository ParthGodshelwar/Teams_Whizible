import React, { useEffect, useState } from "react";
import { Card, Image, Row, Col } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faListCheck } from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-bootstrap/Pagination";

import Drawer from "@mui/material/Drawer";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
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
        return {
          className: "badge AlertBadge",
          text: "Resource Timesheet Approval Pending",
        };
      case 6:
        return {
          className: "badge SuccessBadge",
          text: "New Project Assigned",
        };
      default:
        return { className: "badge AlertBadge", text: "General Alert" };
    }
  };
  return (
    <Card className="bdayCard">
      <Card.Body className="px-0">
        <Carousel
          controls={false}
          indicators={false}
          interval={3000}
          pause={false}
        >
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
                    style={{
                      width: "70px",
                      height: "70px",
                      marginBottom: "8px",
                    }}
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
  itemsPerPage = 10,
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
            marginRight: "5px",
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
                  color: row.isRed == 1 ? "red" : "Black", // Apply red text color if isRed is 1
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
          marginTop: 2,
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
  itemsPerPage = 10,
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
            marginRight: "5px",
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
                    backgroundColor: index % 2 === 0 ? "red" : "blue",
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        color: row.isRed ? "red" : "Black", // Apply color here
                      }}
                    >
                      {col.key === "status"
                        ? renderStatusCircle(row[col.key])
                        : col.label.toLowerCase().includes("date") &&
                          row[col.key]
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
          marginTop: 2,
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
            currentItems.length < 5 || !currentItems || currentItems.length <= 0
          }
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
    tasks: false,
  });

  const [attentionData, setAttentionData] = useState([]);
  const [issueList, setIssueList] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotalPages, setTaskTotalPages] = useState(1);
  const [taskLoading, setTaskLoading] = useState(false);
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
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [loading, setLoading] = useState(false);
  const [issuePage, setIssuePage] = useState(1);
  const [issueTotalPages, setIssueTotalPages] = useState(1);
  const [IssueLoading, setIssueLoading] = useState(false);
  const [timesheetPage, setTimesheetPage] = useState(1);
  const [timesheetTotalPages, setTimesheetTotalPages] = useState(1);
  const [timesheetLoading, setTimesheetLoading] = useState(false);

  const handleChange = (event) => {
    setTimesheetPage(1);
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
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const attentionData = await attentionResponse.json();
        setAttentionData(attentionData.data);
      }
      // Fetching issue list

      if (drawerOpen.issues) {
        if (IssueLoading) return; // Prevent unnecessary calls
        setIssueLoading(true);

        try {
          const issueResponse = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetIssueList?empID=${employeeId}&PageNo=${issuePage}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const issueData = await issueResponse.json();
          if (issueData.data.length > 0) {
            setIssueList((prevIssues) =>
              issuePage === 1
                ? issueData.data
                : [...prevIssues, ...issueData.data]
            );

            // Update total pages dynamically (only on first load)
            if (issuePage === 1 && issueTotalPages === 1) {
              const totalRecords = issueData.data[0]?.totalCount || 0;
              setIssueTotalPages(Math.ceil(totalRecords / 5)); // Assuming 5 records per page
            }
          }
          // setIssueList(issueData.data);

          // console.log(issueList);
        } catch (error) {
        } finally {
          setIssueLoading(false);
        }
      }
      if (drawerOpen.tasks) {
        // if (taskLoading ) return; // Prevent multiple calls
        if (taskLoading) return; // Prevent unnecessary calls
        setTaskLoading(true);
        try {
          const tasksResponse = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetMyTasks?empID=${employeeId}&PageNo=${taskPage}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const tasksData = await tasksResponse.json();
          if (tasksData.data.length > 0) {
            setMyTasks((prevTasks) =>
              taskPage === 1
                ? tasksData.data
                : [...prevTasks, ...tasksData.data]
            );

            // Update total pages dynamically
            if (taskPage === 1 && taskTotalPages === 1) {
              const totalRecords = tasksData.data[0]?.totalCount || 0;
              console.log("totalRecordsfortask", totalRecords);
              setTaskTotalPages(Math.ceil(totalRecords / 5)); // Assuming 5 per page
            }
          }

          //kam baki hai

          // if (tasksData.data.length > 0) {
          //   setMyTasks((prevTasks) =>
          //     taskPage === 1
          //       ? tasksData.data
          //       : [...prevTasks, ...tasksData.data]
          //   );

          //   // Update total pages dynamically (only set on first load)
          //   if (taskTotalPages === 0) {
          //     const totalRecords = tasksData.data[0]?.totalCount || 0; // Check if totalCount exists
          //     setTaskTotalPages(Math.ceil(totalRecords / 5)); // Assuming 5 records per page
          //   }

          //   // Increment page only if more records exist
          //   if (tasksData.data.length === 5) {
          //     setTaskPage((prevPage) => prevPage + 1);
          //   }
          // }
        } catch (error) {
        } finally {
          setTaskLoading(false);
        }
      }
      if (drawerOpen.timesheets) {
        if (
          timesheetLoading ||
          (timesheetTotalPages && timesheetPage > timesheetTotalPages)
        )
          return; // Prevent extra calls
        setTimesheetLoading(true);

        try {
          const timesheetResponse = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetMyTimesheet?empID=${employeeId}&PageNo=${timesheetPage}&TimesheetStatusCode=${selectedOption}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const timesheetData = await timesheetResponse.json();
          // setMyTimesheets(timesheetData.data);
          if (timesheetData.data.length > 0) {
            setMyTimesheets((prevTimesheets) =>
              timesheetPage === 1
                ? timesheetData.data
                : [...prevTimesheets, ...timesheetData.data]
            );

            // Update total pages dynamically (only on first load)
            if (timesheetPage === 1 && timesheetTotalPages === 1) {
              const totalRecords = timesheetData.data[0]?.totalCount || 0;
              setTimesheetTotalPages(Math.ceil(totalRecords / 5)); // Assuming 5 records per page
            }
          }
        } catch (error) {
        } finally {
          setTimesheetLoading(false);
        }
      }
      if (drawerOpen.projects) {
        if (loading) return; // Prevent multiple calls
        setLoading(true);
        try {
          const projectResponse = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetProject?empID=${employeeId}&PageNo=${currentPage}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const projectData = await projectResponse.json();
          const formattedProjects = projectData.data.map((project) => ({
            ...project,
            startDate: project.startDate,
            endDate: project.endDate,
            lastUpdated: project.lastUpdated,
          }));

          setProjectList((prevProjects) =>
            currentPage === 1
              ? formattedProjects
              : [...prevProjects, ...formattedProjects]
          );

          // Calculate total pages dynamically
          const totalRecords =
            projectData.data.length > 0 ? projectData.data[0].totalCount : 0;
          const calculatedTotalPages = Math.ceil(totalRecords / 5); // Assuming 5 records per page

          setTotalPages(calculatedTotalPages);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }

      // Set carousel items
      const carouselItems = attentionData.data.map((item) => ({
        typeDec: item.typeDec,
        content: item.content,
      }));
      setCarouselItems(carouselItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // setTimesheetPage(1);

    fetchData();
  }, [currentPage, drawerOpen, taskPage, issuePage, timesheetPage]);

  useEffect(() => {
    setTimesheetLoading(false);
    setTimesheetTotalPages(1);
    setMyTimesheets([]);
    fetchData();
  }, [selectedOption]);

  const handleDrawerToggle = (drawer, open) => {
    setCurrentPage(1);
    setTaskPage(1);
    setIssuePage(1);
    setTimesheetPage(1);

    setDrawerOpen({ ...drawerOpen, [drawer]: open });
  };

  return (
    <div className="col-12 mb-2 d-flex">
      {/* kuch toh hai  */}
      <div className="d-flex flex-column justify-content-between flex-1 w-100">
        <div className="profileContent">
          <div className="row">
            <div className="col-lg-4 col-12">
              <div className="profileInfo">
                <div className="d-flex align-items-center mb-3">
                  <div className="profImgSec me-3">
                    <Image
                      src={profilepic}
                      alt=""
                      className="profileImg img-fluid rounded-circle"
                      style={{ width: "130px", height: "130px" }}
                    />
                  </div>

                  <div>
                    <div className="profileName mb-2">
                      <span
                        className="pageHeading"
                        style={{ fontSize: "14px" }}
                      >
                        Welcome, {employee}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span id="profileTitle" className="smallTxt">
                        {roleName}
                      </span>
                    </div>
                    <div className="profileContent">
                      Have a Wonderful Day! <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-12">
              {/* <CustomCarousel items={attentionData} /> */}
              {attentionData.length > 0 && (
                <CustomCarousel items={attentionData} />
              )}
            </div>
          </div>
        </div>
        <div className="IconsSection mt-4 mb-4">
          <div className="row">
            <div className="col-6 col-sm-3 mb-3">
              <div
                className="iconCards"
                onClick={() => handleDrawerToggle("issues", true)}
              >
                <div className="IconCardImg">
                  <FontAwesomeIcon icon={faGlobe} />
                </div>
                <div className="IconCardTxt text-center mt-2">Issues</div>
              </div>
            </div>
            <div className="col-6 col-sm-3 mb-3">
              <div
                className="iconCards"
                onClick={() => handleDrawerToggle("projects", true)}
              >
                <div className="IconCardImg">
                  <Image src={projectIcon} alt="Projects" />
                </div>
                <div className="IconCardTxt text-center mt-2">Projects</div>
              </div>
            </div>
            <div className="col-6 col-sm-3 mb-3">
              <div
                className="iconCards"
                onClick={() => handleDrawerToggle("tasks", true)}
              >
                <div className="IconCardImg">
                  <FontAwesomeIcon icon={faListCheck} size="2x" />
                  {/* <Image src={taskIcon} alt="My Tasks" /> */}
                </div>
                <div className="IconCardTxt text-center mt-2">Tasks</div>
              </div>
            </div>
            <div className="col-6 col-sm-3 mb-3">
              <div
                className="iconCards"
                onClick={() => handleDrawerToggle("timesheets", true)}
              >
                <div className="IconCardImg">
                  <Image src={timesheetIcon} alt="Timesheets" />
                </div>
                <div className="IconCardTxt text-center mt-2">Timesheets</div>
              </div>
            </div>
            {/* <div className="IconsContent greyTxt">
              
              
            </div> */}
          </div>
        </div>
      </div>
      {/* Drawer components for different sections  */}
      <Drawer
        anchor="right"
        open={drawerOpen.issues}
        onClose={() => handleDrawerToggle("issues", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden", // Prevent scrolling on the drawer itself
          },
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3",
            }}
          >
            <h5
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Issues
            </h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("issues", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px", // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>

          {/* <TableContent1
            data={issueList}
            columns={columns1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}
        </div>
        {/* kam baki hai */}
        {/* Scrollable Area for Timesheets */}
        <div
          style={{
            maxHeight: "calc(100vh - 10px)", // Adjust height according to header and other content
            overflowY: "auto",
            paddingBottom: "16px",
          }}
        >
          {IssueLoading ? (
            <div className="text-center my-4">
              <h5>Loading...</h5>
            </div>
          ) : (
            <>
              {issueList.length > 0 ? (
                <>
                  {/* Bootstrap Responsive Card View */}
                  <Row className="mt-3 p-2">
                    {issueList.map((issue, index) => (
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        xl={4}
                        key={index}
                        className="mb-3"
                      >
                        <Card className="shadow-sm">
                          <Card.Body>
                            <Card.Title>{issue.title}</Card.Title>
                            <Card.Text>
                              <strong>Issue ID:</strong> {issue.issueID} <br />
                              <strong>Project Name:</strong> {issue.projectName}{" "}
                              <br />
                              <strong>Reported Date:</strong>{" "}
                              {issue.reportedDate} <br />
                              <strong>Summary:</strong> {issue.summary} <br />
                              <strong>Type :</strong> {issue.type} <br />
                              <strong>Status:</strong> {issue.status} <br />
                              <strong>Sub Type:</strong> {issue.subType} <br />
                              <strong>Priority:</strong> {issue.priority} <br />
                              <strong>Ageing:</strong> {issue.ageing} <br />
                              <strong>Last Updated:</strong> {issue.lastUpdated}{" "}
                              <br />
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  {/* Load More Button */}
                  {issuePage < issueTotalPages && (
                    <div className="text-center my-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => setIssuePage((prev) => prev + 1)}
                        disabled={IssueLoading}
                      >
                        {IssueLoading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center my-4">
                  <h5>No Data Found</h5>
                </div>
              )}
            </>
          )}
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
            overflow: "hidden", // Prevent scrolling on the drawer itself
          },
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3",
            }}
          >
            <h5
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Projects
            </h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("projects", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px", // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>
          {/* <TableContent
            data={projectList}
            columns={projectColumns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          /> */}

          {/* Scrollable Area for Timesheets */}
          {loading ? (
            <div className="text-center my-4">
              <h5>Loading...</h5>
            </div>
          ) : (
            <>
              {projectList.length > 0 ? (
                <>
                  <div
                    style={{
                      maxHeight: "calc(100vh - 10px)", // Adjust height according to header and other content
                      overflowY: "auto",
                      paddingBottom: "16px",
                    }}
                  >
                    {/* Bootstrap Responsive Card View */}
                    <Row className="mt-3 p-2">
                      {projectList.map((project, index) => (
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={6}
                          xl={4}
                          key={index}
                          className="mb-3"
                        >
                          <Card className="shadow-sm">
                            <Card.Body>
                              <Card.Title>{project.title}</Card.Title>
                              <Card.Text>
                                <strong>Project Name:</strong>{" "}
                                {project.projectName} <br />
                                <strong>Status:</strong> {project.status} <br />
                                <strong>Start Date:</strong> {project.startDate}{" "}
                                <br />
                                <strong>End Date:</strong> {project.endDate}{" "}
                                <br />
                                <strong>Project Duration :</strong>{" "}
                                {project.projectDuration} <br />
                                <strong>Allocation Percentage:</strong>{" "}
                                {project.allPecentage} <br />
                                <strong>Total Planned Efforts:</strong>{" "}
                                {project.tPeffort} <br />
                                <strong>Actual Work Hours:</strong>{" "}
                                {project.aworkH} <br />
                                <strong>Billable Hours:</strong>{" "}
                                {project.billableH} <br />
                                <strong>Non-Billable Hours:</strong>{" "}
                                {project.nonBillableHours} <br />
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    {/* Load More Button */}
                    {currentPage < totalPages && (
                      <div className="text-center my-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            console.log(
                              "Load More Clicked - Current Page:",
                              currentPage
                            );
                            setCurrentPage((prev) => prev + 1);
                          }}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center my-4">
                  <h5>No Data Found</h5>
                </div>
              )}
            </>
          )}
        </div>
      </Drawer>

      {/* TaskList Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen.tasks}
        onClose={() => handleDrawerToggle("tasks", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden", // Prevent scrolling on the drawer itself
          },
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3",
            }}
          >
            <h5
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Tasks
            </h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("tasks", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px", // Add space after the "Issues" title
                  marginRight: "10px", // Add space after the close icon
                }}
              />
            </Tooltip>
          </div>

          {/* Scrollable Area for Timesheets */}
          <div
            style={{
              maxHeight: "calc(100vh - 10px)", // Adjust height according to header and other content
              overflowY: "auto",
              paddingBottom: "16px",
            }}
          >
            {myTasks.length > 0 ? (
              <>
                {/* Bootstrap Responsive Card View */}
                <Row className="mt-3 p-2">
                  {myTasks.map((Task, index) => (
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      xl={4}
                      key={index}
                      className="mb-3"
                    >
                      <Card className="shadow-sm">
                        <Card.Body>
                          <Card.Title>{Task.title}</Card.Title>
                          <Card.Text>
                            <strong>Task Name:</strong> {Task.taskName} <br />
                            <strong>Project Name:</strong> {Task.projectName}{" "}
                            <br />
                            <strong>Start Date:</strong> {Task.startDate} <br />
                            <strong>End Date:</strong> {Task.endDate} <br />
                            <strong>Baseline Start Date :</strong>{" "}
                            {Task.bStartDate} <br />
                            <strong>Baseline End Date:</strong> {Task.bEndDate}{" "}
                            <br />
                            <strong>Actual Start Date:</strong>{" "}
                            {Task.aStartDate} <br />
                            <strong>Actual End Date:</strong> {Task.aEndDate}{" "}
                            <br />
                            <strong>Work Hours:</strong> {Task.tPwork} <br />
                            <strong>Actual Work Hours:</strong> {Task.aworkH}{" "}
                            <br />
                            <strong>Status:</strong> {Task.status} <br />
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {/* Load More Button  //kam baki hai*/}
                {taskPage < taskTotalPages && (
                  <div className="text-center my-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => setTaskPage((prev) => prev + 1)}
                      disabled={taskLoading}
                    >
                      {taskLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center my-4">
                <h5>No Tasks Found</h5>
              </div>
            )}
          </div>
        </div>
      </Drawer>
      {/* //TimeSheet Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen.timesheets}
        onClose={() => handleDrawerToggle("timesheets", false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            height: "100%",
            overflow: "hidden",
          },
        }}
      >
        <div className="p-1" style={{ width: "80vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#D3D3D3",
            }}
          >
            <h5
              style={{
                marginTop: "5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Timesheets
            </h5>
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => handleDrawerToggle("timesheets", false)}
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                  marginRight: "10px",
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
              style={{ height: "40px" }}
            >
              <MenuItem value="J">Rejected</MenuItem>
              <MenuItem value="R">Submitted</MenuItem>
              <MenuItem value="V">Approved</MenuItem>
            </Select>
          </FormControl>

          {/* Bootstrap Responsive Card View */}
          {/* Scrollable Area for Timesheets */}
          <div
            style={{
              maxHeight: "calc(100vh - 100px)", // Adjust height according to header and other content
              overflowY: "auto",
              paddingBottom: "16px",
            }}
          >
            {timesheetLoading ? (
              <>
                <div className="text-center my-4">
                  <h5>Loading</h5>
                </div>
              </>
            ) : (
              <>
                {myTimesheets.length > 0 ? (
                  <>
                    <Row className="mt-3 p-2">
                      {myTimesheets.map((timesheet, index) => (
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={6}
                          xl={4}
                          key={index}
                          className="mb-3"
                        >
                          <Card className="shadow-sm">
                            <Card.Body>
                              <Card.Title>{timesheet.title}</Card.Title>
                              <Card.Text>
                                <strong>Submitted Date:</strong>{" "}
                                {timesheet.submittedDate} <br />
                                <strong>Status:</strong> {timesheet.status}{" "}
                                <br />
                                <strong>Time:</strong> {timesheet.tPeriod}{" "}
                                <br />
                                <strong>Actual Work:</strong> {timesheet.aworkH}{" "}
                                <br />
                                <strong>Approve/Reject Comment:</strong>{" "}
                                {timesheet.remark} <br />
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    {/* Load More Button */}
                    {timesheetPage < timesheetTotalPages && (
                      <div className="text-center my-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => setTimesheetPage((prev) => prev + 1)}
                          disabled={timesheetLoading}
                        >
                          {timesheetLoading ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center my-4">
                    <h5>No Data Found</h5>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default UserProfilePage;
