import React, { useState, useRef } from "react";
import WeekPicker from "./WeekPicker";
import FilterPanel from "./FilterPanel";
import ProjectTaskSection from "./ProjectTaskSection ";
import ProjectTaskAccordion from "./ProjectTaskAccordion";
// import moment from "moment";
import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";
import axios from "axios";
import { useEffect } from "react";
import NewTaskEntry from "./NewTaskEntry";

const TimesheetEntryTab = ({ timesheetdate = "" }) => {
  // const [selectedWeek, setSelectedWeek] = useState(moment()); // Default to current week
  // const [selectedWeek, setSelectedWeek] = useState(moment().startOf("isoWeek"));
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timesheetData, setTimesheetData] = useState([]);
  const [projects, setProjects] = useState({});
  const [topdata, setTopdata] = useState({});
  const [date1, setDate1] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [date, setDate] = useState(new Date());
  const [selectedProjectid, setSelectedProjectid] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    setRefresh((prev) => !prev);
  }, [appliedFilters]);

  useEffect(() => {
    if (timesheetdate) {
      setSelectedDate(new Date(timesheetdate));
    }
  }, []);

  //filter states
  const [phaseFilters, setPhaseFilters] = useState([
    { id: "PhaseFil1", label: "Phase 01" },
    { id: "PhaseFil2", label: "Phase 02" },
    { id: "PhaseFil3", label: "Phase 03" },
    { id: "PhaseFil4", label: "Phase 04" },
    { id: "PhaseFil5", label: "Phase 05" },
  ]);

  // const [taskStatusFilters, setTaskStatusFilters] = useState([
  //   { id: "TaskStatusFil1", label: "In Progress" },
  //   { id: "TaskStatusFil2", label: "Not Started" },
  //   { id: "TaskStatusFil3", label: "Started but Overdue" },
  //   { id: "TaskStatusFil4", label: "Taken More Time" },
  //   { id: "TaskStatusFil5", label: "Started Late" },
  // ]);

  const [taskPriorityFilters, setTaskPriorityFilters] = useState([
    { id: "TaskPriorityFil1", label: "All" },
    { id: "TaskPriorityFil2", label: "High" },
    { id: "TaskPriorityFil3", label: "Low" },
    { id: "TaskPriorityFil4", label: "Medium" },
  ]);

  const [billableFilters, setBillableFilters] = useState([
    { id: "1", label: "Yes" },
    { id: "0", label: "No" },
  ]);

  const [projectFilters, setProjectFilters] = useState([
    { id: "ProjectFil1", label: "Project A" },
    { id: "ProjectFil2", label: "Project B" },
  ]);

  const [subProjectFilters, setSubProjectFilters] = useState([
    { id: "SubProjectFil1", label: "Sub Project 1" },
    { id: "SubProjectFil2", label: "Sub Project 2" },
  ]);

  const [moduleFilters, setModuleFilters] = useState([
    { id: "ModuleFil1", label: "Module X" },
    { id: "ModuleFil2", label: "Module Y" },
  ]);

  const [deliverableFilters, setDeliverableFilters] = useState([
    { id: "DeliverableFil1", label: "Deliverable 1" },
    { id: "DeliverableFil2", label: "Deliverable 2" },
  ]);

  const [taskTypeFilters, setTaskTypeFilters] = useState([
    { id: "TaskTypeFil1", label: "Type A" },
    { id: "TaskTypeFil2", label: "Type B" },
  ]);

  const [taskCategoryFilters, setTaskCategoryFilters] = useState([
    { id: "TaskCategoryFil1", label: "Category 1" },
    { id: "TaskCategoryFil2", label: "Category 2" },
  ]);

  const [milestoneFilters, setMilestoneFilters] = useState([
    { id: "MilestoneFil1", label: "Milestone 1" },
    { id: "MilestoneFil2", label: "Milestone 2" },
  ]);

  const [filters, setFilters] = useState({
    priority: [],
    project: [],
    subProject: [],
    module: [],
    phase: [],
    deliverable: [],
    milestone: [],
    taskType: [],
    taskCategories: [],
    // status: []
  });

  var isFetchedPrevvalue = useRef(false);
  const previousEfforts = useRef({});
  const setPreviousEfforts = (newEfforts) => {
    previousEfforts.current = { ...previousEfforts.current, ...newEfforts };
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // Adjust to Monday
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i);
      return newDate;
    });
  };

  //Wait

  const weekDates = getWeekDates(selectedDate);

  return (
    <div
      className="tab-pane ApprTabs fade show active"
      id="TSEntryMobTab"
      role="tabpanel"
    >
      <div className="TimesheetEntryDetlsSec">
        <div>
          <WeekPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {/* Week Total | Expected Hours */}
          <div className="d-flex justify-content-end align-items-center fw-500">
            Week Total | Expected Hours -&nbsp;
            <span className="fw-500 text_red">
              <i className="fa-regular fa-clock " /> {""}
              {topdata.weekActualHours} | {topdata.weekExpectedHours}
            </span>
          </div>

          <FilterPanel
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            date={date}
            setDate={setDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setAppliedFilters={setAppliedFilters}
            appliedFilters={appliedFilters}
            phaseFilters={phaseFilters}
            setPhaseFilters={setPhaseFilters}
            taskPriorityFilters={taskPriorityFilters}
            setTaskPriorityFilters={setTaskPriorityFilters}
            billableFilters={billableFilters}
            setBillableFilters={setBillableFilters}
            projectFilters={projectFilters}
            setProjectFilters={setProjectFilters}
            filters={filters}
            setFilters={setFilters}
            milestoneFilters={milestoneFilters}
            setMilestoneFilters={setMilestoneFilters}
            taskCategoryFilters={taskCategoryFilters}
            setTaskCategoryFilters={setTaskCategoryFilters}
            taskTypeFilters={taskTypeFilters}
            setTaskTypeFilters={setTaskTypeFilters}
            deliverableFilters={deliverableFilters}
            setDeliverableFilters={setDeliverableFilters}
            moduleFilters={moduleFilters}
            setModuleFilters={setModuleFilters}
            subProjectFilters={subProjectFilters}
            setSubProjectFilters={setSubProjectFilters}
            selectedProjectid={selectedProjectid}
            setSelectedProjectid={setSelectedProjectid}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />

          <ProjectTaskAccordion
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            weekDates={weekDates}
            projects={projects}
            setProjects={setProjects}
          />

          <NewTaskEntry
            selectedDate={selectedDate}
            date1={date1}
            setRefresh={setRefresh}
          />
        </div>

        <div>
          <ProjectTaskSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timesheetData={timesheetData}
            setTimesheetData={setTimesheetData}
            previousEfforts={previousEfforts}
            setPreviousEfforts={setPreviousEfforts}
            topdata={topdata}
            setTopdata={setTopdata}
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
      </div>
    </div>
  );
};

export default TimesheetEntryTab;
