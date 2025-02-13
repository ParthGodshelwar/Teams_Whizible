import React from "react";
import { Stack } from "@fluentui/react";
import { Card } from "react-bootstrap";

// Sample data (this could be fetched from an API)
const notifications = [
  {
    id: 1,
    icon: "fa-bell",
    title: "Task is delayed",
    description: "Design Task",
    date: "20-08-2024",
    endDate: "25-08-2024",
    color: "text_red"
  },
  {
    id: 2,
    icon: "fa-flag",
    title: "Issues is Flagged For Follow Up",
    description: "Issue01 - Details are not getting updated."
  },
  {
    id: 3,
    icon: "fa-comments",
    title: "New Comment is Posted on Project",
    description: "ICICI - Admin",
    date: "20-07-2024",
    time: "11:00:00 AM"
  }
  // Add more notifications as needed
];

const StatisticsCard = () => {
  return (
    <div className="NotificationsContent">
      {notifications.map((notification) => (
        <div key={notification.id} className="Notification_Card">
          <div className="row gx-0">
            <div className="col-sm-1 px-0">
              <i className={`fa-solid ${notification.icon} ntfIcn mt-2`} />
            </div>
            <div className="col-sm-10">
              <div
                className={`NotificationCardTitle d-flex justify-content-between ${
                  notification.color || ""
                }`}
              >
                {notification.title}
              </div>
              <div className="NotificationSpan">
                <span>{notification.description}</span>
                {notification.date && (
                  <span>
                    <i className="fa-regular fa-calendar" /> {notification.date} <br />
                    {notification.endDate && <span>{notification.endDate}</span>}
                  </span>
                )}
                {notification.time && (
                  <span>
                    <i className="fa-regular fa-clock" /> {notification.date} <br />{" "}
                    {notification.time}
                  </span>
                )}
              </div>
            </div>
            <div className="col-sm-1">
              <i className="fa-solid fa-square-xmark Notification_Cross" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCard;
