import React from "react";

function scheduleTaskModal() {
  return (
    <div>
      {" "}
      <div className="modal fade" id="scheduleTaskModal" aria-hidden="true">
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id>
                DA Type Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="allWorkflowTabsDiv d-block" id="DeskWF_TabsDiv">
                <ul className="nav nav-tabs pe-3" id="AllEntityTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      className="nav-link active"
                      id="ScheduleTimeEntryTab"
                      data-bs-toggle="tab"
                      data-bs-target="#ScheduleTasksTab"
                      role="tab"
                    >
                      Schedule Time Entry
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      className="nav-link"
                      id="RequestAddTimeTab"
                      data-bs-toggle="tab"
                      data-bs-target="#RequestTimeTab"
                      role="tab"
                    >
                      Request Additional Time
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="ApprTabContent">
                  {/* Project Entity Start here */}
                  <div
                    className="tab-pane ApprTabs fade show active"
                    id="ScheduleTasksTab"
                    role="tabpanel"
                  >
                    <div className="ScheduleEntryFields py-3">
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Start Date :</label>
                        <div className="col-sm-6">
                          <div className="input-group">
                            <input id="ScheduleStartDate" className="form-control" />
                            <span className="input-group-btn">
                              <button className="btn btncalendar" type="button">
                                <i className="fas fa-calendar-alt" />
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Post till Date :</label>
                        <div className="col-sm-6">
                          <div className="input-group">
                            <input id="SchedulePostTillDate" className="form-control" />
                            <span className="input-group-btn">
                              <button className="btn btncalendar" type="button">
                                <i className="fas fa-calendar-alt" />
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Project :</label>
                        <div className="col-sm-6">
                          <label>Expleo understanding Development and Deployment</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Task :</label>
                        <div className="col-sm-6">
                          <label>D001 - To Create HTML for Customer Group</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Sub Task :</label>
                        <div className="col-sm-6">
                          <label>Sub Task 01</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Hours to Post :</label>
                        <div className="col-sm-6">
                          <input type="text" className="form-control" id="SchdHoursToPost" />
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label htmlFor="SchedCloseTask" className="col-sm-4 text-end">
                          Close task after end date
                        </label>
                        <div className="col-sm-6">
                          <input
                            type="checkbox"
                            className="form-check checkAll"
                            id="SchedCloseTask"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center my-3">
                      <a
                        href="javascript:;"
                        className="btn btnyellow me-2"
                        id="ScheduleTaskBtn"
                        data-bs-toggle="tooltip"
                        title="Schedule"
                      >
                        Schedule
                      </a>
                      <a
                        href="javascript:;"
                        className="btn borderbtn"
                        data-bs-dismiss="modal"
                        data-bs-toggle="tooltip"
                        title="Cancel"
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="clearfix" />
                  </div>
                  <div className="tab-pane ApprTabs fade show" id="RequestTimeTab" role="tabpanel">
                    <div className="ScheduleEntryFields py-3">
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Select Start Date :</label>
                        <div className="col-sm-6">
                          <div className="input-group">
                            <input id="SelectStartDate" className="form-control" />
                            <span className="input-group-btn">
                              <button className="btn btncalendar" type="button">
                                <i className="fas fa-calendar-alt" />
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Project :</label>
                        <div className="col-sm-6">
                          <label>Expleo understanding Development and Deployment</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Task :</label>
                        <div className="col-sm-6">
                          <label>D001 - To Create HTML for Customer Group</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Sub Task :</label>
                        <div className="col-sm-6">
                          <label>Sub Task 01</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end">Allocated Time :</label>
                        <div className="col-sm-6">
                          <label>160:00</label>
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label className="col-sm-4 text-end required">Request Time :</label>
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control"
                            id="SchdRequest_time"
                            placeholder="Request Efforts"
                          />
                        </div>
                      </div>
                      <div className="form-group row pt-1 mb-2">
                        <label htmlFor="SchedCloseTask" className="col-sm-4 text-end">
                          Reason :
                        </label>
                        <div className="col-sm-6">
                          <textarea
                            type="text"
                            className="form-control"
                            id="Task_Reason"
                            placeholder="Enter Reason"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-center my-3">
                      <a
                        href="javascript:;"
                        className="btn btnyellow me-2"
                        id="RequestTaskBtn"
                        data-bs-toggle="tooltip"
                        title="Request"
                      >
                        Request
                      </a>
                      <a
                        href="javascript:;"
                        className="btn borderbtn"
                        data-bs-dismiss="modal"
                        data-bs-toggle="tooltip"
                        title="Cancel"
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="clearfix" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default scheduleTaskModal;
