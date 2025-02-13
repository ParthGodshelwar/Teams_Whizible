import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import StatisticsCard from "./StatisticsCard";
import AlertNotification from "./AlertNotification";
import TodayPriority from "./TodayPriority";
import QuickInbox from "./QuickInbox";
import MyTimeline from "./MyTimeline";
import { FaSync, FaRandom, FaCamera, FaLock, FaUnlock } from "react-icons/fa";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import stats from "../../hooks/landingpage/stats";
import ProfileMessage from "../../hooks/landingpage/ProfileMessage";
import GetAlertNot from "../../hooks/landingpage/GetAlertNot";
import GetMTimeline from "../../hooks/landingpage/GetMTimeline";
import GetQinbox from "../../hooks/landingpage/GetQinbox";
import GetTPriority from "../../hooks/landingpage/GetTPriority";

const Dashboard = () => {
  const [isDraggable, setIsDraggable] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [usermessage, setUserUsermessage] = useState(null);
  const [qinbox, setQinbox] = useState(null);
  const [alertNot, setAlertNot] = useState(null);
  const [mTimeline, setMTimeline] = useState(null);
  const [tPriority, setTPriority] = useState(null);
  const [date, setDate] = useState(new Date());
  const [prevMonth, setPrevMonth] = useState(date.getMonth());
  const [prevYear, setPrevYear] = useState(date.getFullYear());
  const [refrsh, setRefresh] = useState(true);

  const fetchStatsData = async () => {
    try {
      const data = await stats();
      setUserProfileData(data.listLandingDBStatistics[0]);
    } catch (error) {
      console.error("Failed to fetch user profile data:", error);
    }
  };

  const fetchMTimelineData = async (year, month) => {
    try {
      const data = await GetMTimeline(year, month);
      setMTimeline(data);
    } catch (error) {
      console.error("Failed to fetch timeline data:", error);
    }
  };

  const fetchAlertNotData = async () => {
    try {
      const data = await GetAlertNot();
      setAlertNot(data);
    } catch (error) {
      console.error("Failed to fetch alert notifications:", error);
    }
  };

  // const fetchQinboxData = async () => {
  //   try {
  //     const data = await GetQinbox();
  //     setQinbox(data);
  //   } catch (error) {
  //     console.error("Failed to fetch quick inbox data:", error);
  //   }
  // };

  const fetchProfileMessageData = async () => {
    try {
      const data = await ProfileMessage();
      setUserUsermessage(data);
    } catch (error) {
      console.error("Failed to fetch profile message:", error);
    }
  };

  const fetchTPriorityData = async () => {
    try {
      const data = await GetTPriority();
      setTPriority(data);
    } catch (error) {
      console.error("Failed to fetch today priority data:", error);
    }
  };

  useEffect(() => {
    fetchStatsData();
    fetchProfileMessageData();
    // fetchQinboxData();
    fetchTPriorityData();
    fetchAlertNotData();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    fetchMTimelineData(year, month);
  }, [refrsh]);

  useEffect(() => {
    fetchMTimelineData(prevYear, prevMonth + 1);
  }, [prevMonth, prevYear]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const toggleDraggable = () => {
    setIsDraggable((prev) => !prev);
  };

  const resetLayout = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: "2px", backgroundColor: "#F9F9F9" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2px" }}>
        {/* Button actions */}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ flex: "1 1 calc(55% - 10px)", backgroundColor: "#fff", padding: "1px" }}>
          <ProfileCard usermessage={usermessage} />
        </div>
        <div style={{ flex: "1 1 calc(6% - 10px)", backgroundColor: "#fff", padding: "1px" }}>
          <AlertNotification alertNot={alertNot} />
        </div>
        <div style={{ display: "flex", flex: "1 1 100%", gap: "10px", flexWrap: "nowrap" }}>
          <div style={{ flex: "1 1 auto", backgroundColor: "#fff", padding: "1px" }}>
            <TodayPriority tPriority={tPriority} refrsh={refrsh} setRefresh={setRefresh} />
          </div>
          <div style={{ flex: "1 1 auto", backgroundColor: "#fff", padding: "1px" }}>
            <QuickInbox refrsh={refrsh} setRefresh={setRefresh} />
          </div>
          <div style={{ flex: "1 1 auto", backgroundColor: "#fff", padding: "1px" }}>
            <MyTimeline
              mTimeline={mTimeline}
              prevMonth={prevMonth}
              prevYear={prevYear}
              setPrevMonth={setPrevMonth}
              setPrevYear={setPrevYear}
              refrsh={refrsh}
              setRefresh={setRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
