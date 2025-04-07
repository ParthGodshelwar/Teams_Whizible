import React, { useState } from 'react';

import ProjectCard from './ProjectCard';
import "./TimesheetMobileView.css"
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";

const TimesheetMobileView = () => {
  const [selectedDay, setSelectedDay] = useState('17'); // Default selected day

  const days = [
    { day: 'M', date: '13' },
    { day: 'T', date: '14' },
    { day: 'W', date: '15' },
    { day: 'T', date: '16' },
    { day: 'F', date: '17' },
    { day: 'S', date: '18', isWeekend: true },
    { day: 'S', date: '19', isWeekend: true },
  ];

  const projects = [
    {
      name: 'Market place',
      startDate: '12 Jan 2025',
      endDate: '20 Jan 2025',
      allocation: '70',
      actualHours: '08:30',
      tasks: [
        { name: 'Generic Task 1', allocatedWork: '08:00', actualWork: '00:00' },
        { name: 'Requirements', allocatedWork: '08:75', actualWork: '00:00' },
        { name: 'Development', allocatedWork: '09:15', actualWork: '00:00' },
      ],
    },
    {
      name: 'Healthcare System',
      startDate: '12 Jan 2025',
      endDate: '20 Jan 2025',
      allocation: '70',
      actualHours: '08:75',
      tasks: [
        { name: 'Unit Testing', allocatedWork: '08:00', actualWork: '00:00' },
        { name: 'Technical Review', allocatedWork: '08:75', actualWork: '00:00' },
      ],
    },
  ];

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  return (
    <div className="timesheet-mobile-view">
      <div className="days-section">
        <i className="fa-solid fa-caret-left cursor-icon p-2"></i>
        {days.map((day, index) => (
          <div
            key={index}
            className={`day-div ${day.date === selectedDay ? 'selected' : ''}`}
            onClick={() => handleDayClick(day.date)}
          >
            <div className={`ts-day ${day.isWeekend ? 'text-red' : ''}`}>{day.day}</div>
            <div className={`ts-date ${day.date === selectedDay ? 'today-date' : ''} ${day.isWeekend ? 'text-red' : ''}`}>
              {day.date}
            </div>
          </div>
        ))}
        <i className="fa-solid fa-caret-right cursor-icon p-2"></i>
      </div>

      <div className="save-submit-buttons">
        <div className="search-row">
          <input type="text" placeholder="Search Tasks.." className="form-control input-sm" />
          <button className="btn btn-default srch-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="buttons">
          <button className="btn border-btn">Submit Timesheet</button>
          <button className="btn btn-yellow">Save</button>
        </div>
      </div>

      <div className="projects-section">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default TimesheetMobileView;