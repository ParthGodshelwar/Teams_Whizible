import React, { useState, useEffect } from "react";
import { Stack, Text, IconButton } from "@fluentui/react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";

const AlertNotification = ({ alertNot }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (Array.isArray(alertNot)) {
      setNotifications(alertNot);
    } else {
      console.error("alertNot is not an array:", alertNot);
    }
  }, [alertNot]); // Update notifications when alertNot changes

  const handleDismiss = (id) => {
    setNotifications(notifications.filter((notification) => notification.typeID !== id));
  };

  // Map notifications to the required structure
  const mappedNotifications = notifications.map((alert) => {
    let icon;

    switch (alert.icon) {
      case "Bell":
        icon = <NotificationsIcon style={{ color: "#ffbc00" }} />;
        break;
      case "Comment":
        icon = <CommentIcon style={{ color: "#ffbc00" }} />;
        break;
      case "Flag":
        icon = <FlagIcon style={{ color: "#ffbc00" }} />;
        break;
      default:
        icon = null;
    }
    const isRed = alert.typeDec.includes("delayed") || alert.typeDec.includes("Risk");
    return {
      id: alert.typeID,
      icon: icon,
      title: alert.typeDec,
      details: alert.content,
      color: isRed ? "text_red" : ""
    };
  });

  return (
    <Stack className="NotificationsSec">
      <Text
        variant="large"
        style={{
          backgroundColor: "#377fdb", // Highlight color
          padding: "4px 8px", // Padding around the text for better visibility
          borderRadius: "4px", // Optional: rounded corners
          color: "white", // Set text color to white
          textAlign: "center"
        }}
        className="NotificationsTitle"
      >
        Need Your Attention
      </Text>
      <Stack tokens={{ childrenGap: 5 }}>
        {mappedNotifications.length === 0 ? (
          <Text
            style={{
              textAlign: "center"
            }}
          >
            No Notifications Available
          </Text> // Message when no notifications
        ) : (
          mappedNotifications.map((notification) => (
            <Stack
              key={notification.id}
              horizontal
              verticalAlign="center"
              className="Notification_Card"
              tokens={{ childrenGap: 10 }}
            >
              <div>{notification.icon}</div>
              <Stack grow>
                <Text
                  variant="medium"
                  className={`NotificationCardTitle ${notification.color || ""}`}
                >
                  {notification.title}
                </Text>
                <Text variant="small" className="NotificationSpan">
                  <span>{notification.details}</span>
                </Text>
              </Stack>
              <IconButton
                iconProps={{ iconName: "Cancel" }} // Using the iconName for cancel
                title="Close"
                ariaLabel="Dismiss"
                onClick={() => handleDismiss(notification.id)} // Call dismiss function on click
                className="Notification_Cross"
              />
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default AlertNotification;
