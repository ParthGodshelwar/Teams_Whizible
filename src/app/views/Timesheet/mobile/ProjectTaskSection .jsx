import React from "react";

import ProjectTaskMobile from "./ProjectTaskMobile";
import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";

const ProjectTaskSection = ({
  selectedDate,
  setSelectedDate,
  timesheetData,
  setTimesheetData,
  setTopdata,
  topdata,
  previousEfforts,
  setPreviousEfforts,
  isFetchedPrevvalue,
  appliedFilters,
  setAppliedFilters,
  refresh,
  setRefresh,
  projects,
  setProjects,
  setDate1,
}) => {
  return (
    <div className="TS_ProjTask_Card mb-3">
      <ProjectTaskMobile
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timesheetData={timesheetData}
        setTimesheetData={setTimesheetData}
        topdata={topdata}
        setTopdata={setTopdata}
        previousEfforts={previousEfforts}
        setPreviousEfforts={setPreviousEfforts}
        isFetchedPrevvalue={isFetchedPrevvalue}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        refresh={refresh}
        setRefresh={setRefresh}
        projects={projects}
        setProjects={setProjects}
        setDate1={setDate1}
      />
    </div>
  );
};

export default ProjectTaskSection;
