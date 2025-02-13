import React from "react";

import TimesheetEntry from "./TimesheetEntry";

const index = () => {
  const projects = ["Project 01", "Project 02", "Project 03"];
  const tasks = ["Task 01", "Task 02", "Task 03"];
  const subtasks = ["Sub Task 01", "Sub Task 02", "Sub Task 03"];

  return (
    <div>
      <section id="content-wrapper" className="content_wrapper">
        <div className="col-sm-12 col-lg-9">
          <TimesheetEntry projects={projects} tasks={tasks} subtasks={subtasks} />
        </div>
      </section>
    </div>
  );
};

export default index;
