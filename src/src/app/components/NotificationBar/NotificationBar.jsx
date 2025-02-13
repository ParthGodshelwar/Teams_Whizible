import { Fragment, useState, useEffect } from "react";
import {
  Box,
  Badge,
  IconButton,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { Clear, Notifications } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Left Arrow
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Right Arrow
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import useSettings from "app/hooks/useSettings";
import notification from "../../hooks/notification/notification"; // Import the notification API call
import alertDurations from "../../hooks/notification/alertDurations"; // Import the alert durations API call
import "./Notification.css";

export default function NotificationBar() {
  const { settings } = useSettings();
  const [panelOpen, setPanelOpen] = useState(false);
  const [duration, setDuration] = useState("6. Older"); // Default to "6. Older"
  const [page, setPage] = useState(1);
  const [apiNotifications, setApiNotifications] = useState([]); // Initialize with an empty array
  const [alertOptions, setAlertOptions] = useState([]); // Initialize as an empty array
  const itemsPerPage = 5; // Number of items per page

  // Fetch notifications
  const { notification: fetchedNotifications, loading, error } = notification("", duration, page);

  // Fetch alert durations
  const { alert, loading: alertLoading } = alertDurations();

  // Fetch notifications whenever duration or page changes, including initial load
  useEffect(() => {
    if (!loading && fetchedNotifications?.listInitiativeAlertsEntity) {
      setApiNotifications(fetchedNotifications.listInitiativeAlertsEntity);
    }
  }, [fetchedNotifications, loading, duration, page]);

  // Fetch alert options on load
  useEffect(() => {
    if (!alertLoading && alert?.listAlterDurationEntity) {
      setAlertOptions(alert.listAlterDurationEntity); // Set the alert options from API response
    }
  }, [alert, alertLoading]);

  const handleDrawerToggle = () => setPanelOpen(!panelOpen);
  const handleDurationChange = (event) => {
    setDuration(event.target.value); // Use selected duration as value
    setPage(1); // Reset to first page when duration changes
  };

  // Handle previous and next page navigation
  const handlePreviousPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent page from going below 1
  const handleNextPage = () => setPage((prevPage) => prevPage + 1); // Simply increment the page

  // Ensure apiNotifications is an array and apply .slice() safely
  const paginatedNotifications = Array.isArray(apiNotifications)
    ? apiNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : [];

  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        <Badge color="secondary" badgeContent={apiNotifications.length || 0}>
          <NotificationsNoneIcon sx={{ color: "text.primary" }} />
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Dialog open={panelOpen} onClose={handleDrawerToggle} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              backgroundColor: "#4263c1",
              color: "#fff",
              textAlign: "center",
              paddingBottom: 2
            }}
          >
            <Typography variant="h6">Alert</Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ position: "absolute", top: 0, right: 0, color: "#fff" }}
            >
              <Clear />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box>
              <Box mb={3} display="flex" alignItems="center">
                <NotificationsNoneIcon color="action" sx={{ color: "#fd7e14", mr: 1 }} />
                <Typography variant="h6" component="h6">
                  Alerts
                </Typography>
              </Box>
              <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                <Typography variant="body1">Duration</Typography>
                <Select
                  value={duration} // Default to "6. Older"
                  onChange={handleDurationChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Select your Duration" }}
                  sx={{ ml: 2, width: 200, height: 25 }}
                >
                  {alertOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.value}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <hr />
              {/* Notification Table */}
              <Box>
                <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="alert table">
                    <TableHead>
                      <TableRow>
                        {/* <TableCell className="text-center">Flag</TableCell> */}
                        <TableCell>Initiative Title</TableCell>
                        <TableCell>Nature of Initiative</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Due Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedNotifications.map((notification) => (
                        <TableRow
                          key={notification.uniqueID} // Use uniqueID for better identification
                          sx={{
                            backgroundColor:
                              notification.dueDateState === "L" ? "#f0f0f0" : "transparent",
                            "&:hover": {
                              backgroundColor: "#e0e0e0"
                            }
                          }}
                        >
                          {/* <TableCell className="text-center">
                            <i
                              className={`fa-solid fa-flag ${notification.flagColor}`}
                              data-bs-toggle="tooltip"
                              data-bs-original-title={notification.contextType}
                            ></i>
                          </TableCell> */}
                          <TableCell>
                            <a href={`Initiative_Information.aspx?id=${notification.initiativeID}`}>
                              {notification.title}
                            </a>
                          </TableCell>
                          <TableCell>{notification.contextType}</TableCell>
                          <TableCell>{notification.dueDate}</TableCell>
                          <TableCell>{notification.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Pagination with only left and right arrows */}
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <IconButton onClick={handlePreviousPage} disabled={page === 1}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {page}</Typography>
                <IconButton onClick={handleNextPage}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
              <hr />
              <Box textAlign="right" className="modal-footer">
                <Button variant="outlined" color="primary" onClick={handleDrawerToggle}>
                  Close
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </Fragment>
  );
}
