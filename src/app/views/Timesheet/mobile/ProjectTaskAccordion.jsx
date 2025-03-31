import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import moment from "moment";
// import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import "./TimesheetMobileView.css";
// import "../css/style.css";
// import "../css/style_bk.css";
import "../css/style_Madhuri.css";

const ProjectTaskAccordion = ({
  selectedDate,
  setSelectedDate,
  weekDates,
  projects,
  setProjects,
}) => {
  // Handle Previous Week
  const handlePrevWeek = () => {
    const prevWeekDate = new Date(selectedDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setSelectedDate(prevWeekDate);
  };

  // Handle Next Week
  const handleNextWeek = () => {
    const nextWeekDate = new Date(selectedDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setSelectedDate(nextWeekDate);
  };

  return (
    <div className="days_section my-3">
      <div className="row gx-0">
        <div className="col-auto my-auto">
          {/* <FaCaretLeft className="cursor_icon p-2" onClick={handlePrevWeek} /> */}
          <KeyboardDoubleArrowLeftIcon className="cursor_icon " onClick={handlePrevWeek} />
        </div>
        {weekDates.map((date, index) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const isWeekend = date.getDay() === 6 || date.getDay() === 0; // Saturday & Sunday
          // const project = projects.find((proj) => proj?.Day1 == `Day${date.getDay()}`)
          let className = "orange";
          if (projects.length > 0) {
            const formattedDate = date.toISOString().split("T")[0];
            const colourData = projects.find(
              // (proj) => proj?.Day1 === `Day${date.getDay() + 1}`
              (proj) => proj?.dateValue.split("T")[0] === formattedDate
            )?.dayType;

            if (colourData === "WeekEnd") {
              className = "Grey";
            } else if (colourData == "Leave") {
              className = "Blue";
            } else if (colourData == "Holiday") {
              className = "SkyBlue";
            }
          }
          return (
            <div className="col" key={index}>
              <div
                className={`dayDiv_${className} ${isSelected ? "selected-date" : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className={`TS_Day ${isWeekend ? "text_red" : ""}`}>
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className={`TS_Date ${isWeekend ? "text_red" : ""}`}>
                  {date.getDate()}
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-auto my-auto">
          {/* <FaCaretRight className="cursor_icon p-2" onClick={handleNextWeek} /> */}
          {/* import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'; */}
          <KeyboardDoubleArrowRightIcon className="cursor_icon " onClick={handleNextWeek}/>
        </div>
      </div>
    </div>
  );
};

const refreshTSPage = () => {
  console.log("Timesheet page refreshed");
};

export default ProjectTaskAccordion;
