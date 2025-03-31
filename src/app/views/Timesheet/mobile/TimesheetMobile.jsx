import React, { useState } from 'react';
import TimesheetEntryTab from './TimesheetEntryTab';
import MyTimesheetTab from './MyTimesheetTab';
import "./TimesheetMobileView.css"
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";
import Project_blu_icon from "../img/Project_blu_icon.svg";
import mytimesheet_blu_icon from "../img/mytimesheet_blu_icon.svg";

const TimesheetMobile = () => {
  const [activeTab, setActiveTab] = useState('TimesheetEntry');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section id="Timesheet_mobile" className="content_wrapper d-block d-lg-none">
      <div className="allWorkflowTabsDiv d-flex justify-content-start ms-4" id="MobkWF_TabsDiv">
        <ul className="nav nav-tabs mb-3" id="AllEntityTabsMob" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={`nav-link position-relative ${activeTab === 'TimesheetEntry' ? 'active' : ''}`}
              onClick={() => handleTabChange('TimesheetEntry')}
            >
              <img src={Project_blu_icon} alt="" className="ApprIcns" />
              Timesheet Entry
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={`nav-link position-relative ${activeTab === 'MyTimesheet' ? 'active' : ''}`}
              onClick={() => handleTabChange('MyTimesheet')}
            >
              <img src={mytimesheet_blu_icon} alt="" className="ApprIcns" />
              My Timesheet
            </button>
          </li>
        </ul>
      </div>

      <div className="tab-content" id="TS_entryTabMobContent">
        {activeTab === 'TimesheetEntry' && <TimesheetEntryTab />}
        {activeTab === 'MyTimesheet' && <MyTimesheetTab />}
      </div>
    </section>
  );
};

export default TimesheetMobile;