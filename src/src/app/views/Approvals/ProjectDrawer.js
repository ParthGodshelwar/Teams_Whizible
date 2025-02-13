import React, { useEffect, useState } from "react";
import {
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Divider
} from "@mui/material";
import axios from "axios";

const ProjectDrawer = ({ showDrawer, toggleDrawer, projectID }) => {
  const [projectData, setProjectData] = useState(null); // State to store project data
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userid = user.data.employeeId;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const accessToken = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectApprovalCheckList?ProjectID=${projectID}&userID=${userid}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        const projectDetails = response.data.data.listMyApprovalProjectDetailEntity[0];
        setProjectData(projectDetails); // Set project details to state
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (projectID) {
      fetchProjectDetails(); // Fetch project details if projectID exists
    }
  }, [projectID]);

  // Loading state

  return (
    <Drawer
      anchor="right"
      open={showDrawer}
      onClose={toggleDrawer}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80vw",
          height: "100%",
          overflow: "hidden" // Prevent scrolling on the drawer itself
        }
      }}
    >
      <div style={{ padding: 16 }}>
        {/* CheckList and Stage Header */}
        <div
          className="d-flex justify-content-between font-weight-500"
          style={{
            marginBottom: "16px",
            backgroundColor: "#f5f5f5", // Light grey background
            padding: "8px 16px", // Padding for spacing
            borderRadius: "4px" // Optional: Add rounded corners
          }}
        >
          <label className="">CheckList: Project Review Checklist</label>
          <label className="">Stage: Head Approval</label>
        </div>

        {/* Divider */}
        <Divider style={{ marginBottom: "16px" }} />

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.No.</TableCell>
                <TableCell>CheckList Item</TableCell>
                <TableCell>Responses</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectData?.checkListItems && projectData.checkListItems.length > 0 ? (
                projectData?.checkListItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.response || "N/A"}</TableCell>
                    <TableCell>{item.comments || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center" }}>
                    No checklist items available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Save and Cancel Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
            gap: "8px"
          }}
        >
          <Button variant="contained" color="primary" onClick={() => console.log("Save clicked")}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={toggleDrawer}>
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ProjectDrawer;
