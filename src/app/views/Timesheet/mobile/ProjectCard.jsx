import React, { useState } from 'react';
import "./TimesheetMobileView.css"
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";

const ProjectCard = ({ project }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="accordion-item accordion-proj-task mb-3">
      <h2 className="accordion-header">
        <button
          className={`accordion-button ${isCollapsed ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleCollapse}
        >
          <div className="flex-1 pe-2">
            <div className="d-flex justify-content-between align-items-end">
              <span>{project.name}</span>
              <label className="text-pink fw-500">Actual Hours - {project.actualHours}</label>
            </div>
            <div className="row gx-1">
              <div className="col-4">
                <div className="proj-details-mob">
                  <div>Start Date: </div>
                  <div>{project.startDate}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="proj-details-mob">
                  <div>End Date: </div>
                  <div>{project.endDate}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="proj-details-mob">
                  <div>% Allocation: </div>
                  <div>{project.allocation}</div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </h2>
      <div
        id={`project-${project.name}`}
        className={`accordion-collapse collapse ${isCollapsed ? 'show' : ''}`}
      >
        <div className="accordion-body">
          <ul className="list-unstyled mb-0">
            {project.tasks.map((task, index) => (
              <li key={index} className="mb-2">
                <div className="row">
                  <div className="col-sm-6 col-6 my-auto">
                    <div className="d-flex justify-content-between">
                      <span className="task-txt-mob">{task.name}</span>
                      <span>
                        <i
                          className="fa-solid fa-circle-info blu-txt cursor-icon ps-2"
                          data-bs-toggle="popover"
                          data-bs-trigger="hover focus"
                          data-bs-html="true"
                          data-bs-content={`<div class='task-details'><div class='row'><div class='fnt-12 fw-500 txt-blue mb-2'>Project: ${project.name}</div></div><div class='row'><div class='col-sm-6 col-6 text-end txt-blue fnt-11'>Allocated Work : </div><div class='col-sm-6 col-6 fnt-11'>${task.allocatedWork}</div></div><div class='row'><div class='col-sm-6 col-6 text-end txt-blue fnt-11'>Actual Work : </div><div class='col-sm-6 col-6 fnt-11'>${task.actualWork}</div></div></div>`}
                        ></i>
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4 col-4">
                    <input type="text" value={task.actualWork} className="form-control edt-time-input-mob" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;