import React from "react";
// import DatePicker from "@fluentui/react";
// import { Label, Dropdown, TextField, Stack, DefaultButton, DatePicker } from "@fluentui/react";
// import "react-datepicker/dist/react-datepicker.css";
import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";

import { Label, DatePicker, defaultDatePickerStrings } from "@fluentui/react";

const WeekPicker = ({ selectedDate, setSelectedDate }) => {
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
    let days = [];
    for (let i = 0; i < 7; i++) {
      let currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({
        day: currentDay
          .toLocaleDateString("en-US", { weekday: "short" })
          .charAt(0),
        date: currentDay.getDate(),
        fullDate: currentDay,
        weekend: currentDay.getDay() === 6 || currentDay.getDay() === 0,
        today: currentDay.toDateString() === new Date().toDateString(),
      });
    }
    return days;
  };

  const getWeekNumber = (date) => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJan.getDay() + 1) / 7);
  };

  const WeekPicker = ({ selectedDate, onDateChange }) => {
    const onSelectDate = (date) => {
      if (date) {
        onDateChange(date);
      }
    };
  };

  return (
    <div className="week-picker-container">
      <div>
        Date:
        <span className="font-weight-600"> {selectedDate.toDateString()} </span>
        | Week Number:{" "}
        <span className="font-weight-600">{getWeekNumber(selectedDate)}</span>
      </div>
      <div className="row">
        <div className="">
          <DatePicker
            // label="Select a Date"
            value={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            strings={defaultDatePickerStrings}
            isMonthPickerVisible={false}
            allowTextInput={false}
          />
        </div>
        {/* <div></div> */}
      </div>
    </div>
  );
};

export default WeekPicker;
