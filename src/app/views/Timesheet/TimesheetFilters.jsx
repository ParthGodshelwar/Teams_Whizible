// import React, { useState, useEffect, useRef } from "react";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import axios from "axios";

const TimesheetFilters = forwardRef(
  ({ handleFilterChange, appliedFilters, setAppliedFilters }, ref) => {
    // States for filter values
    const [selectedProject, setSelectedProject] = useState("");
    var selectedProject23;
    const [priority, setPriority] = useState([]);
    const [project, setProject] = useState([]);
    const [subProject, setSubProject] = useState([]);
    const [module, setModule] = useState([]);
    const [phase, setPhase] = useState([]);
    const [deliverable, setDeliverable] = useState([]);
    const [taskType, setTaskType] = useState([]);
    const [taskCategories, setTaskCategories] = useState([]);
    const [status, setStatus] = useState([]);
    const [projects, setProjects] = useState([]);
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.data?.employeeId;
    const [preSelectedFilters, setPreSelectedFilters] = useState({
      projectName: "",
      modules: "",
      subProject: "",
      milestone: "",
      subTaskType: "",
      // tasksStatus: "",
      taskType: "",
      priority: "",
      deliverable: "",
      billable: ""
    });
    const [billable, setBillable] = useState("");

    const handleBillableToggle = (e) => {
      const selectedValue = e.target.value; // "Yes", "No", or ""
      setBillable(selectedValue === "Yes" ? 1 : selectedValue === "No" ? 0 : null); // Set billable to 1, 0, or null
      setPreSelectedFilters((prev) => ({
        ...prev,
        billable: selectedValue === "Yes" ? 1 : selectedValue === "No" ? 0 : null // Set "Yes", "No", or "" in preSelectedFilters
      }));

      console.log(
        "Billable toggled to:",
        selectedValue === "Yes" ? 1 : selectedValue === "No" ? 0 : null
      );
    };

    const [filters, setFilters] = useState({
      priority: [],
      project: [],
      subProject: [],
      module: [],
      phase: [],
      deliverable: [],
      taskType: [],
      taskCategories: []
      // status: []
    });

    // Set up a flag to track if data should be loaded
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const hasFetchedFilters = useRef(false);
    const getCurrentDate = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };
    useEffect(() => {
      if (appliedFilters) {
        // setSelectedProject(appliedFilters.selectedProject || "");
        // setProject(appliedFilters.selectedProject || "");
        setPriority(appliedFilters.priority || []);
        setSubProject(appliedFilters.subProject || []);
        setModule(appliedFilters.module || []);
        setPhase(appliedFilters.phase || []);
        setDeliverable(appliedFilters.deliverable || []);
        setTaskType(appliedFilters.taskType || []);
        setTaskCategories(appliedFilters.taskCategories || []);
        setStatus(appliedFilters.status || []);
        setBillable(appliedFilters.billable || "");
      }
    }, [appliedFilters]);

    // Fetch User DA Entry Filters when component mounts
    useEffect(() => {
      const fetchUserDAEntryFilter = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetUserDAEntryFilter?UserID=${employeeId}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              }
            }
          );
          console.log("User DA Entry Filter Response:", response.data);

          const filterData = response.data?.data?.listDAFilterDetails[0];

          if (filterData) {
            setPriority(filterData.priority);
            setSubProject(filterData.subProject);
            setModule(filterData.modules);
            setPhase(filterData.milestone);
            setDeliverable(filterData.deliverable);
            setTaskType(filterData.taskType);
            setTaskCategories(filterData.tasksCategories);
            // commented by parth.G
            // setStatus(filterData.tasksStatus);
            fetchFiltersData();
            setSelectedProject(Number(filterData.projectName));
            setProject(Number(filterData.projectName));
            setBillable(billable == "Yes" ? 1 : filterData.billable == "No" ? 0 : "");

            const newAppliedFilters = {
              selectedProject: filterData.projectName,
              priority: filterData.priority,
              subProject: filterData.subProject,
              module: filterData.modules,
              phase: filterData.milestone,
              deliverable: filterData.deliverable,
              taskType: filterData.taskType,
              taskCategories: filterData.tasksCategories,
              // commented by parth.g
              // status: filterData.priority,
              billable: filterData.billable == "Yes" ? 1 : filterData.billable == "No" ? 0 : ""
            };

            console.log("Applied Filters:", newAppliedFilters);
            setAppliedFilters(newAppliedFilters);

            setPreSelectedFilters({
              projectName: Number(filterData.projectName) || 0,
              modules: filterData.modules || "",
              subProject: filterData.subProject || "",
              milestone: filterData.milestone || "",
              subTaskType: filterData.subTaskType || "",
              tasksStatus: filterData.tasksStatus || "",
              taskType: filterData.taskType || "",
              priority: filterData.priority || "",
              deliverable: filterData.deliverable || "",
              billable: filterData.billable || "No"
            });
          }
        } catch (error) {
          console.error("Error fetching DA entry filter:", error);
        }
      };
      setTimeout(() => {
        fetchUserDAEntryFilter();
      }, 1000);
    }, [employeeId]);

    // Fetch all projects initially
    useEffect(() => {
      const fetchProjectDetails = async () => {
        try {
          const todaysDate = getCurrentDate();

          const response = await fetch(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetTimesheetEntryDetail`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}` // Add token if required
              },
              body: JSON.stringify({
                userID: employeeId,
                inputDate: todaysDate
              })
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data?.data?.listProjectDetailsEntity) {
            const options = data.data.listProjectDetailsEntity.map((item) => ({
              key: item.projectID, // Unique identifier
              text: item.projectName // Label to display
            }));
            setProjects(options);
            localStorage.setItem("selectedProject", JSON.stringify(options));
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      };
      fetchProjectDetails();
    }, [employeeId]);
    useEffect(() => {
      if (appliedFilters) {
        setSelectedProject(appliedFilters.selectedProject || "");
        setPriority(appliedFilters.priority || []);
        setSubProject(appliedFilters.subProject || []);
        setModule(appliedFilters.module || []);
        setPhase(appliedFilters.phase || []);
        setDeliverable(appliedFilters.deliverable || []);
        setTaskType(appliedFilters.taskType || []);
        setTaskCategories(appliedFilters.taskCategories || []);
        setStatus(appliedFilters.status || []);
        setBillable(appliedFilters.billable);
      } else {
        // Reset dropdowns to default when appliedFilters is cleared
        setSelectedProject("");
        setPriority([]);
        setSubProject([]);
        setModule([]);
        setPhase([]);
        setDeliverable([]);
        setTaskType([]);
        setTaskCategories([]);
        setStatus([]);
        setBillable("");
      }
    }, [appliedFilters]);
    const handleApplyFilters = async (filterParam, flag) => {
      if (flag) {
        setAppliedFilters(filterParam);
        postDAEntryFilters(filterParam);
        return;
      }

      const newAppliedFilters = {
        selectedProject,
        priority,
        subProject,
        module,
        phase,
        deliverable,
        taskType,
        taskCategories,
        status,
        billable
      };

      setAppliedFilters(newAppliedFilters);

      // Pass the new filters directly to avoid relying on stale state
      postDAEntryFilters(newAppliedFilters);
    };
    useImperativeHandle(
      ref,
      () => ({
        applyFilters: (filters, flag) => handleApplyFilters(filters, flag)
      }),
      []
    );

    const postDAEntryFilters = async (filters) => {
      console.log("postDAEntryFilters", filters);

      const sanitizeValue = (value) => (value ? String(value) : "");

      const params = {
        projectIDs: sanitizeValue(filters?.selectedProject),
        taskTypeIDs: sanitizeValue(filters?.taskType),
        taskCategoriesIDs: sanitizeValue(filters?.taskCategories),
        subProjectIDs: sanitizeValue(filters?.subProject),
        milestonesIDs: "", // If always empty
        deliverableIDs: sanitizeValue(filters?.deliverable),
        phaseIDs: sanitizeValue(filters?.phase),
        statusIDs: sanitizeValue(filters?.status),
        moduleIDs: sanitizeValue(filters?.module),
        priorityIDs: sanitizeValue(filters?.priority),
        billable: billable === 0 ? "No" : billable ? "Yes" : "",

        employeeID: sanitizeValue(employeeId)
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
              Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
          }
        );
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
          "TasksCategories"
          // "Status"
        ];

        const filterData = {};

        for (let category of filterCategories) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheetEntry/GetDropDownForFiletes?UserID=${employeeId}&ProjectIDs=${selectedProject23}&FlagWise=${category}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              }
            }
          );

          // Save fetched data for each category
          filterData[category.toLowerCase()] = response.data.data.listDropDownForFiletes;
        }

        // Update the filters state
        setFilters(filterData);
        if (project.length > 0) localStorage.setItem("selectedProject1", JSON.stringify(projects));

        // Store filter data in local storage with category names
        Object.entries(filterData).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        if (projects.length !== 0)
          localStorage.setItem("selectedProject", JSON.stringify(projects));

        console.log("Filters saved to local storage:", filterData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    useEffect(() => {
      // Check if selectedProject is empty
      if (selectedProject === "") {
        // Clear all the dropdown states
        setPriority([]);
        setSubProject([]);
        setModule([]);
        setPhase([]);
        setDeliverable([]);
        setTaskType([]);
        setTaskCategories([]);
        setStatus([]);
        setBillable("");
      }
    }, [selectedProject]); // This effect will run whenever selectedProject changes

    useEffect(() => {
      if (selectedProject) {
        setIsProjectSelected(true);

        fetchFiltersData();
      } else {
        setIsProjectSelected(false);
      }
    }, [selectedProject]);

    //these filters are project independent
    const fetchInitialFilters = async () => {
      try {
        // Define filter categories
        const filterCategories = ["Priority", "TaskType", "TasksCategories", "Status"];
        const initalfilterData = {};

        for (let category of filterCategories) {
          const response = await axios.get(
            `${
              process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
            }/MyTimesheetEntry/GetDropDownForFiletes?UserID=${employeeId}&ProjectIDs=${""}&FlagWise=${category}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              }
            }
          );

          // Save fetched data for each category
          initalfilterData[category.toLowerCase()] = response.data.data.listDropDownForFiletes;
        }

        // Update the filters state
        setFilters(initalfilterData);

        // Store filter data in local storage with category names
        // Object.entries(initalfilterData).forEach(([key, value]) => {
        //   localStorage.setItem(key, JSON.stringify(value));
        // });
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    useEffect(() => {
      fetchInitialFilters();
    }, []);

    console.log("Priority", filters);
    const handleSearchInput = (e, setSearch) => {
      setSearch(e.target.value);
    };
    console.log("filters", filters, taskCategories);
    return (
      <div className="container">
        <div className="row">
          {/* Project Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="ProjectFilSec">
                <label className="fw-500">Project</label>
                <select
                  className="form-control"
                  value={selectedProject}
                  onChange={(e) => {
                    const projectId = e.target.value;
                    setSelectedProject(projectId);
                    selectedProject23 = projectId;
                    setProject(projectId);
                    hasFetchedFilters.current = false;
                    // Clear all other filter values
                    setPriority([]);
                    setSubProject([]);
                    setModule([]);
                    setPhase([]);
                    setDeliverable([]);
                    setTaskType([]);
                    setTaskCategories([]);
                    setStatus([]);

                    // Optionally clear `appliedFilters` if required
                    // setAppliedFilters((prev) => ({
                    //   ...prev,
                    //   priority: [],
                    //   subProject: [],
                    //   module: [],
                    //   phase: [],
                    //   deliverable: [],
                    //   taskType: [],
                    //   taskCategories: [],
                    //   status: [],
                    //   billable: 0
                    // }));

                    // Refetch filters for the newly selected project
                    if (projectId) {
                      fetchFiltersData(); // Assuming `fetchFiltersData` is updated to depend on `selectedProject`
                    }
                  }}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.key} value={project.key}>
                      {project.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="PriorityFilSec">
                <label className="fw-500">Priority</label>
                <select
                  className="form-control"
                  // disabled={!isProjectSelected}
                  onChange={(e) => setPriority(e.target.value)}
                  value={priority}
                >
                  <option value="">Select Priority</option>
                  {filters?.priority?.length > 0 &&
                    filters.priority.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* SubProject Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="SubProjectFilSec">
                <label className="fw-500">Sub Project</label>
                <select
                  className="form-control"
                  disabled={!isProjectSelected}
                  onChange={(e) => setSubProject(e.target.value)}
                  value={subProject}
                >
                  <option value="">Select Sub Project</option>
                  {filters?.subproject?.length > 0 &&
                    filters?.subproject?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Module Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="ModuleFilSec">
                <label className="fw-500">Module</label>
                <select
                  className="form-control"
                  disabled={!isProjectSelected}
                  onChange={(e) => setModule(e.target.value)}
                  value={module}
                >
                  <option value="">Select Module</option>
                  {filters?.module?.length > 0 &&
                    filters.module.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Phase Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="PhaseFilSec">
                <label className="fw-500">Phase</label>
                <select
                  className="form-control"
                  disabled={!isProjectSelected}
                  onChange={(e) => setPhase(e.target.value)}
                  value={phase}
                >
                  <option value="">Select Phase</option>
                  {filters?.phase?.length > 0 &&
                    filters.phase.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Deliverable Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="DeliverableFilSec">
                <label className="fw-500">Deliverable</label>
                <select
                  className="form-control"
                  disabled={!isProjectSelected}
                  onChange={(e) => setDeliverable(e.target.value)}
                  value={deliverable}
                >
                  <option value="">Select Deliverable</option>
                  {filters?.deliverable?.length > 0 &&
                    filters.deliverable.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Task Type Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="TaskTypeFilSec">
                <label className="fw-500">Task Type</label>
                <select
                  className="form-control"
                  onChange={(e) => setTaskType(e.target.value)}
                  value={taskType}
                >
                  <option value="">Select Task Type</option>
                  {filters?.tasktype?.length > 0 &&
                    filters.tasktype.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Task Categories Dropdown */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="TasksCategoriesFilSec">
                <label className="fw-500">Tasks Categories</label>
                <select
                  className="form-control"
                  onChange={(e) => setTaskCategories(e.target.value)}
                  value={taskCategories}
                >
                  <option value="">Select Tasks Categories</option>
                  {filters?.taskscategories?.length > 0 &&
                    filters?.taskscategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Dropdown */}
          {/* <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="StatusFilSec">
                <label className="fw-500">Status</label>
                <select
                  className="form-control"
                  onChange={(e) => setStatus(e.target.value)}
                  value={preSelectedFilters.tasksStatus}
                >
                  <option value="">Select Status</option>
                  {filters?.status?.length > 0 &&
                    filters.status.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div> */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="BillableToggleSec">
                <label className="fw-500">Billable</label>
                <div className="form-group">
                  <select
                    id="billableDropdown"
                    className="form-control"
                    // disabled={!isProjectSelected}
                    value={billable === 1 ? "Yes" : billable === 0 ? "No" : ""}
                    onChange={handleBillableToggle}
                  >
                    <option value="">Select Billable</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Apply Filters Button */}
          <div className="col-12 col-sm-2 mb-3">
            <div className="row mb-3">
              <div className="ApplyFilSec">
                <button className="btn btn-primary" onClick={handleApplyFilters}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default TimesheetFilters;
