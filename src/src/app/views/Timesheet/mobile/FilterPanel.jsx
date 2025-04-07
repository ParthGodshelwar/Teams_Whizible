import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Refresh } from "@mui/icons-material";

const FilterPanel = ({
  showFilters,
  setShowFilters,
  date,
  setDate,
  selectedDate,
  setSelectedDate,
  setAppliedFilters,
  appliedFilters,
  phaseFilters,
  setPhaseFilters,
  taskPriorityFilters,
  setTaskPriorityFilters,
  billableFilters,
  setBillableFilters,
  projectFilters,
  setProjectFilters,
  filters,
  setFilters,
  milestoneFilters,
  setMilestoneFilters,
  taskCategoryFilters,
  setTaskCategoryFilters,
  taskTypeFilters,
  setTaskTypeFilters,
  deliverableFilters,
  setDeliverableFilters,
  moduleFilters,
  setModuleFilters,
  subProjectFilters,
  setSubProjectFilters,
  selectedProjectid,
  setSelectedProjectid,
  selectedProject,
  setSelectedProject,
}) => {
  const [isProjectSelected, setIsProjectSelected] = useState(false);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;
  // const [appliedFilters,setAppliedFilters] = useState({});

  // const [selectedTaskStatus, setSelectedTaskStatus] = useState(null);

  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedTaskPriority, setSelectedTaskPriority] = useState(null);
  const [selectedBillable, setSelectedBillable] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  // const [showFilters, setShowFilters] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const hasFetchedFilters = useRef(false);

  const handlePhaseChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = phaseFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedPhase(selectedFilter);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getFormatedDate = (date) => {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleTaskPriorityChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = taskPriorityFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedTaskPriority(selectedFilter);
  };

  const handleBillableChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = billableFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedBillable(selectedFilter);
  };

  const handleProjectChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = projectFilters.find(
      (filter) => filter.id == selectedId
    );
    setSelectedProjectid(selectedId);

    if (selectedFilter) {
      setSelectedProject(selectedFilter);
    } else {
      setSelectedProject(selectedFilter);
    }

    localStorage.setItem("lastSelectedProjectId", selectedId);
  };

  const handleSubProjectChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = subProjectFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedSubProject(selectedFilter);
  };

  const handleModuleChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = moduleFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedModule(selectedFilter);
  };

  const handleDeliverableChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = deliverableFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedDeliverable(selectedFilter);
  };

  const handleTaskTypeChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = taskTypeFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedTaskType(selectedFilter);
  };

  const handleTaskCategoryChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = taskCategoryFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedTaskCategory(selectedFilter);
  };

  const handleMilestoneChange = (event) => {
    const selectedId = event.target.value;
    const selectedFilter = milestoneFilters.find(
      (filter) => filter.id === selectedId
    );
    setSelectedMilestone(selectedFilter);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // useEffect(() => {
  //
  //   setRefresh(prev => !prev);
  // }, [appliedFilters]);

  useEffect(() => {
    fetchUserDAEntryFilter();
  }, []);

  //To get filterdata initially
  const fetchUserDAEntryFilter = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetUserDAEntryFilter?UserID=${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("User DA Entry Filter Response:", response.data);

      const filterData = response.data?.data?.listDAFilterDetails[0];

      if (filterData.projectName) {
        setSelectedProjectid(filterData.projectName);
      }

      const newAppliedFilters = {
        selectedProject: filterData.projectName,
        priority: filterData.priority,
        subProject: filterData.subProject,
        module: filterData.modules,
        phase: filterData.phase,
        deliverable: filterData.deliverable,
        milestone: filterData.milestone,
        taskType: filterData.taskType,
        taskCategories: filterData.tasksCategories,
        // commented by parth.g
        // status: filterData.priority,
        billable:
          filterData.billable == "Yes"
            ? 1
            : filterData.billable == "No"
            ? 0
            : "",
      };

      setAppliedFilters(newAppliedFilters);
    } catch (error) {
      console.error("Error fetching DA entry filter:", error);
    }
  };

  //To bind Project Dropdown initially
  useEffect(() => {
    const todaysDate = getCurrentDate();
    var tempdate = selectedDate ? getFormatedDate(selectedDate) : "";
    // var vardate = date? date || todaysDate;
    var vardate = tempdate || todaysDate;
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetEntryDetail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Add token if required
            },
            body: JSON.stringify({
              userID: employeeId,
              inputDate: vardate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.data?.listProjectDetailsEntity) {
          const options = data.data.listProjectDetailsEntity.map((item) => ({
            // key: item.projectID, // Unique identifier
            // text: item.projectName, // Label to display
            id: item.projectID,
            name: item.projectName,
          }));
          setProjectFilters(options);
          // setProjects(options);
          localStorage.setItem("selectedProject", JSON.stringify(options));
          const idofproj = selectedProjectid;
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchProjectDetails();
  }, [employeeId, date, selectedProjectid, selectedDate]);

  useEffect(() => {
    if (selectedProjectid) {
      setIsProjectSelected(true);
      hasFetchedFilters.current = false;
      fetchFiltersData();
    } else {
      setIsProjectSelected(false);
      resetFilters();
      // setIsProjectSelected(false);
      // setPhaseFilters([]);
      // setTaskPriorityFilters([]);
      // setSubProjectFilters([]);
      // setModuleFilters([]);
      // setDeliverableFilters([]);
      // setTaskTypeFilters([]);
      // setTaskCategoryFilters([]);
      // setMilestoneFilters([]);
      // setProjectFilters([]);
      // setSelectedPhase(null);
      // setSelectedTaskPriority(null);
      // setSelectedSubProject(null);
      // setSelectedModule(null);
      // setSelectedDeliverable(null);
      // setSelectedTaskType(null);
      // setSelectedTaskCategory(null);
      // setSelectedMilestone(null);
    }
  }, [selectedProjectid]);

  const resetFilters = () => {
    setPhaseFilters([]);
    setTaskPriorityFilters([]);
    setSubProjectFilters([]);
    setModuleFilters([]);
    setDeliverableFilters([]);
    setTaskTypeFilters([]);
    setTaskCategoryFilters([]);
    setMilestoneFilters([]);
    setProjectFilters([]);
    setSelectedPhase(null);
    setSelectedTaskPriority(null);
    setSelectedSubProject(null);
    setSelectedModule(null);
    setSelectedDeliverable(null);
    setSelectedTaskType(null);
    setSelectedTaskCategory(null);
    setSelectedMilestone(null);
  };

  //To set dropdowns with applied filters respectively
  useEffect(() => {
    // if (
    //   !appliedFilters ||
    //   Object.values(appliedFilters).every((value) => value === null || value === "" )
    // ) {
    //   return; // Do nothing if all values are null
    // }

    const filterSources = {
      selectedProject: projectFilters,
      priority: taskPriorityFilters,
      subProject: subProjectFilters,
      module: moduleFilters,
      phase: phaseFilters,
      deliverable: deliverableFilters,
      milestone: milestoneFilters,
      taskType: taskTypeFilters,
      taskCategories: taskCategoryFilters,
      billable: billableFilters,
    };

    const setFilterState = {
      selectedProject: setSelectedProject,
      priority: setSelectedTaskPriority,
      subProject: setSelectedSubProject,
      module: setSelectedModule,
      phase: setSelectedPhase,
      deliverable: setSelectedDeliverable,
      milestone: setSelectedMilestone,
      taskType: setSelectedTaskType,
      taskCategories: setSelectedTaskCategory,
      billable: setSelectedBillable,
    };

    // Object.entries(appliedFilters).forEach(([key, value]) => {
    //   if (value && filterSources[key]) {
    //     const matchingValue = Object.values(filterSources[key]).find(
    //       (filter) => `${filter.id}` === value
    //     );

    //     // if (matchingValue && setFilterState[key]) {
    //     //   setFilterState[key](matchingValue);
    //     // }

    //     if (matchingValue) {
    //       setFilterState[key](matchingValue);
    //     } else {
    //       setFilterState[key](null); // Set to null if no match is found
    //     }
    //   }
    // });

    Object.entries(setFilterState).forEach(([key, setState]) => {
      const filterValue = appliedFilters[key]; // Get the applied filter value

      if (filterValue && filterSources[key]) {
        const matchingValue = Object.values(filterSources[key]).find(
          (filter) => `${filter.id}` === filterValue
        );

        setState(matchingValue || null); // If no match, set to null
      } else {
        setState(null); // If filter is removed, set state to null
      }
    });
  }, [
    appliedFilters,
    // projectFilters,
    // taskPriorityFilters,
    // subProjectFilters,
    // moduleFilters,
    // phaseFilters,
    // deliverableFilters,
    // milestoneFilters,
    // taskTypeFilters,
    // taskCategoryFilters,
    // billableFilters,
  ]);

  const handleApplyFilters = async (filterParam, flag) => {
    const newAppliedFilters = {
      selectedProject: selectedProject?.id ? `${selectedProject?.id}` : "",
      priority: selectedTaskPriority?.id || "",
      subProject: selectedSubProject?.id || "",
      module: selectedModule?.id || "",
      phase: selectedPhase?.id || "",
      deliverable: selectedDeliverable?.id || "",
      milestone: selectedMilestone?.id || "",
      taskType: selectedTaskType?.id || "",
      taskCategories: selectedTaskCategory?.id || "",
      billable: selectedBillable?.id || "",
    };

    setAppliedFilters(newAppliedFilters);
    // setAppliedFilters({ ...newAppliedFilters });
    // setAppliedFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    // setAppliedFilters(newAppliedFilters);

    // Pass the new filters directly to avoid relying on stale state
    postDAEntryFilters(newAppliedFilters);

    // setRefresh((prev) => !prev);
  };

  const postDAEntryFilters = async (filters) => {
    console.log("postDAEntryFilters", filters);

    const sanitizeValue = (value) => (value ? String(value) : "");

    const params = {
      projectIDs: sanitizeValue(filters?.selectedProject),
      taskTypeIDs: sanitizeValue(filters?.taskType),
      taskCategoriesIDs: sanitizeValue(filters?.taskCategories),
      subProjectIDs: sanitizeValue(filters?.subProject),
      milestonesIDs: sanitizeValue(filters?.milestone), // If always empty
      deliverableIDs: sanitizeValue(filters?.deliverable),
      phaseIDs: sanitizeValue(filters?.phase),
      statusIDs: sanitizeValue(filters?.status),
      moduleIDs: sanitizeValue(filters?.module),
      priorityIDs: sanitizeValue(filters?.priority),
      // billable: sanitizeValue(filters?.billable === 0 ? "No" : "Yes"),
      billable:
        filters?.billable === "0"
          ? "No"
          : filters?.billable === "1"
          ? "Yes"
          : "",

      employeeID: sanitizeValue(employeeId),
    };
    console.log("Request Body:", params);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/PostDAEntryFilters`,
        params,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      // toast.success("DA Entry Filters Saved Successfully");
      if (showFilters) {
        setShowFilters(false);
      }

      console.log("DA Entry Filters Saved Response:", response.data);
    } catch (error) {
      console.error("Error saving DA entry filters:", error);
    }
  };

  const fetchFiltersData = async () => {
    if (hasFetchedFilters.current) return; // Prevent multiple calls
    hasFetchedFilters.current = true;
    try {
      // Define filter categories
      const filterCategories = [
        "Priority",
        "SubProject",
        "project",
        "Module",
        "Phase",
        "Deliverable",
        "TaskType",
        "TasksCategories",
        "milestone",
        // "Status"
      ];

      const filterData = {};

      for (let category of filterCategories) {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetDropDownForFiletes?UserID=${employeeId}&ProjectIDs=${selectedProjectid}&FlagWise=${category}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        // Save fetched data for each category
        filterData[category.toLowerCase()] =
          response.data.data.listDropDownForFiletes;
      }

      // Update the filters state
      setFilters(filterData);

      //added by parth
      // Function to transform filter data into the required format
      const transformFilters = (data, prefix) => {
        return data.map((item) => ({
          id: `${item.id}`,
          name: item.name,
        }));
      };

      // Setting state with transformed data
      setPhaseFilters(transformFilters(filterData.phase || [], "PhaseFil"));
      setTaskPriorityFilters(
        transformFilters(filterData.priority || [], "TaskPriorityFil")
      );

      setSubProjectFilters(
        transformFilters(filterData.subproject || [], "SubProjectFil")
      );
      setModuleFilters(transformFilters(filterData.module || [], "ModuleFil"));
      setDeliverableFilters(
        transformFilters(filterData.deliverable || [], "DeliverableFil")
      );
      setTaskTypeFilters(
        transformFilters(filterData.tasktype || [], "TaskTypeFil")
      );
      setTaskCategoryFilters(
        transformFilters(filterData.taskscategories || [], "TaskCategoryFil")
      );
      setMilestoneFilters(
        transformFilters(filterData.milestone || [], "MilestoneFil")
      );

      //ended by parth

      if (projectFilters.length > 0)
        localStorage.setItem(
          "selectedProject1",
          JSON.stringify(projectFilters)
        );

      // Store filter data in local storage with category names
      Object.entries(filterData).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      if (projectFilters.length !== 0)
        localStorage.setItem("selectedProject", JSON.stringify(projectFilters));

      console.log("Filters saved to local storage:", filterData);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const removeFilter = async (filterKey) => {
    //added by parth.G
    var finalFilter;
    setAppliedFilters(async (prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterKey === "billable") {
        updatedFilters[filterKey] = ""; // Set to empty string instead of deleting
      } else {
        delete updatedFilters[filterKey]; // Delete other keys normally
      }

      finalFilter = updatedFilters;

      await postDaForremovefilter(finalFilter);
      setAppliedFilters(finalFilter);
      // setRefresh((prev)=>!prev )
      setRefresh((prev) => !prev);


      return updatedFilters;
    });
  };

  const postDaForremovefilter = async (filters) => {
    const sanitizeValue = (value) => (value ? String(value) : "");
    if(sanitizeValue(filters?.selectedProject) == ""){
      // selectedProjectid
      setSelectedProjectid(null);
    }


    const params = {
      projectIDs: sanitizeValue(filters?.selectedProject),
      taskTypeIDs: sanitizeValue(filters?.taskType),
      taskCategoriesIDs: sanitizeValue(filters?.taskCategories),
      subProjectIDs: sanitizeValue(filters?.subProject),
      milestonesIDs: sanitizeValue(filters?.milestone), // If always empty
      deliverableIDs: sanitizeValue(filters?.deliverable),
      phaseIDs: sanitizeValue(filters?.phase),
      statusIDs: sanitizeValue(filters?.status),
      moduleIDs: sanitizeValue(filters?.module),
      priorityIDs: sanitizeValue(filters?.priority),
      // billable: sanitizeValue(filters?.billable === 0 ? "No" : "Yes"),
      billable:
        filters?.billable === 0 ? "No" : filters?.billable === 1 ? "Yes" : "",

      employeeID: sanitizeValue(employeeId),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/PostDAEntryFilters`,
        params,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      toast.success("DA Entry Filters Removed Successfully");
    } catch (error) {
      console.error("Error saving DA entry filters:", error);
    }
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-sm-2 col-2 d-flex align-items-center">
            <button
              className="btn "
              onClick={toggleFilters}
              id="AdvanceFilterIcon"
            >
              <i
                className="fa-solid fa-filter"
                data-bs-toggle="tooltip"
                title="Filter"
              ></i>
            </button>
          </div>
        </div>
        {showFilters && (
          <div id="TimesheetMobFilters" className="collapse show">
            <div className="row">
              {/* Project */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="ProjectFilSec">
                    <label className="fw-500">Project</label>
                    <select
                      className="form-select"
                      value={
                        selectedProject ? selectedProject.id : selectedProjectid
                      }
                      // value={selectedProject ? : ""}
                      onChange={handleProjectChange}
                    >
                      <option value="">Select Project</option>
                      {projectFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Priority */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="TaskPriorityFilSec">
                    <label className="fw-500">Priority</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      onChange={handleTaskPriorityChange}
                      value={
                        selectedTaskPriority ? selectedTaskPriority.id : ""
                      }
                    >
                      <option value="">Select Priority</option>
                      {taskPriorityFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Sub Project */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="SubProjectFilSec">
                    <label className="fw-500">Sub Project</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedSubProject ? selectedSubProject.id : ""}
                      onChange={handleSubProjectChange}
                    >
                      <option value="">Select Sub Project</option>
                      {subProjectFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Module */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="ModuleFilSec">
                    <label className="fw-500">Module</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedModule ? selectedModule.id : ""}
                      onChange={handleModuleChange}
                    >
                      <option value="">Select Module</option>
                      {moduleFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Phase */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="PhaseFilSec">
                    <label className="fw-500">Phase</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedPhase ? selectedPhase.id : ""}
                      onChange={handlePhaseChange}
                    >
                      <option value="">Select Phase</option>
                      {phaseFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Deliverable */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="DeliverableFilSec">
                    <label className="fw-500">Deliverable</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedDeliverable ? selectedDeliverable.id : ""}
                      onChange={handleDeliverableChange}
                    >
                      <option value="">Select Deliverable</option>
                      {deliverableFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Task Type */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="TaskTypeFilSec">
                    <label className="fw-500">Task Type</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedTaskType ? selectedTaskType.id : ""}
                      onChange={handleTaskTypeChange}
                    >
                      <option value="">Select Task Type</option>
                      {taskTypeFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Task Category */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="TaskCategoryFilSec">
                    <label className="fw-500">Task Category</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={
                        selectedTaskCategory ? selectedTaskCategory.id : ""
                      }
                      onChange={handleTaskCategoryChange}
                    >
                      <option value="">Select Task Category</option>
                      {taskCategoryFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Milestone */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="MilestoneFilSec">
                    <label className="fw-500">Milestone</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedMilestone ? selectedMilestone.id : ""}
                      onChange={handleMilestoneChange}
                    >
                      <option value="">Select Milestone</option>
                      {milestoneFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Status */}
              {/* <div className="col-12 col-sm-4 col-lg-2 mb-3">
              <div className="row">
                <div className="TaskStatusFilSec">
                  <label className="fw-500">Status</label>
                  <select
                    className="form-select"
                    disabled={!isProjectSelected}
                    value={selectedTaskStatus ? selectedTaskStatus.id : ""}
                    onChange={handleTaskStatusChange}
                  >
                    <option value="">Select Status</option>
                    {taskStatusFilters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div> */}

              {/* Billable */}
              <div className="col-12 col-sm-4 col-lg-2 mb-3">
                <div className="row">
                  <div className="BillableMobFilSec">
                    <label className="fw-500">Billable</label>
                    <select
                      className="form-select"
                      disabled={!isProjectSelected}
                      value={selectedBillable ? selectedBillable.id : ""}
                      onChange={handleBillableChange}
                    >
                      <option value="">Select Billable</option>
                      {billableFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-12 text-center mt-3">
                <button
                  className="btn btn-primary"
                  // onhover={handleApplyFilters}
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* // */}

      <div className="applied-filters">
        <h6>Applied Filters:</h6>
        <div className="d-flex flex-wrap">
          {Object.entries(appliedFilters).map(([filterKey, filterValue]) => {
            if (filterKey === "billable") {
              const billableValue = filterValue;

              return (
                <>
                  {billableValue != null &&
                    billableValue !== "" &&
                    billableValue !== undefined && (
                      <div
                        key={filterKey}
                        className="filter-item me-2"
                        style={{
                          backgroundColor: "#f0f0f0",
                          padding: "8px",
                          borderRadius: "5px",
                          marginBottom: "5px",
                        }}
                      >
                        <span>
                          Billable:{" "}
                          {billableValue === 0
                            ? "No"
                            : billableValue
                            ? "Yes"
                            : ""}
                        </span>
                        <button
                          className="btn-close ms-1"
                          style={{ fontSize: "0.7rem" }}
                          onClick={() => removeFilter(filterKey)} // Removes the specific filter
                          aria-label={`Remove ${filterKey} filter`}
                        />
                      </div>
                    )}
                </>
              );
            }

            // Handle other filters
            if (filterValue && filterValue.length > 0) {
              const localStorageKeyMap = {
                taskCategories: "taskscategories",
                subProject: "subproject",
                taskType: "tasktype",
                phase: "phase",
              };
              const localStorageKey =
                localStorageKeyMap[filterKey] || filterKey;
              const storedFilterData =
                JSON.parse(localStorage.getItem(localStorageKey)) || [];
              const filterNames = Array.isArray(filterValue)
                ? filterValue
                    .map((id) => {
                      const matchedFilter = storedFilterData.find(
                        (item) => item.id?.toString() === id.toString()
                      );
                      return matchedFilter
                        ? matchedFilter.name || matchedFilter.text
                        : ` ${id}`;
                    })
                    .join(", ")
                : (() => {
                    const matchedFilter = storedFilterData.find(
                      (item) =>
                        item.id?.toString() === filterValue.toString() ||
                        item.key?.toString() === filterValue.toString()
                    );
                    return matchedFilter
                      ? matchedFilter.name || matchedFilter.text
                      : `${filterValue}`;
                  })();

              const displayKey =
                filterKey === "selectedProject"
                  ? "Project"
                  : filterKey === "taskCategories"
                  ? "Task Categories"
                  : filterKey === "taskType"
                  ? "Task Type"
                  : filterKey.charAt(0).toUpperCase() + filterKey.slice(1);

              return (
                <div
                  key={filterKey}
                  className="filter-item me-2"
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "8px",
                    borderRadius: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <span>
                    {displayKey}: {filterNames}
                  </span>
                  <button
                    className="btn-close ms-1"
                    style={{ fontSize: "0.7rem" }}
                    onClick={() => removeFilter(filterKey)} // Removes the specific filter
                    aria-label={`Remove ${filterKey} filter`}
                  />
                </div>
              );
            }
            return null; // Render nothing if filterValue is empty
          })}
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
