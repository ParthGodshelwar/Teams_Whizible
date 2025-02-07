import React from "react";

function SelectProjectDetlsModal() {
  return (
    <div>
      {" "}
      <div className="modal fade" id="SelectProjectDetlsModal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id>
                Select Project / Task
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body mx-3">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <div className="row">
                    <label className="col-sm-5 mt-2 text-end">Select Project</label>
                    <div className="col-sm-7">
                      <select
                        className="selectpicker"
                        data-live-search="true"
                        id="SelectProjectInput"
                      >
                        <option>Select Project</option>
                        <option>Project 01</option>
                        <option>Project 02</option>
                        <option>Project 03</option>
                        <option>Project 04</option>
                        <option>Project 05</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-sm-5 text-end">
                      <label className="text_orange">Project Code :</label>
                    </div>
                    <div className="col-sm-7">
                      <label>KOL-0101</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5 text-end">
                      <label className="text_orange">Start Date :</label>
                    </div>
                    <div className="col-sm-7">
                      <label>01 Jan 2023</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5 text-end">
                      <label className="text_orange">End Date :</label>
                    </div>
                    <div className="col-sm-7">
                      <label>30 Jan 2023</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header greenBg p-2">Tasks</div>
                <div className="card-body">
                  <div className="timesheetFields p-3">
                    <div className="row gy-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="selectTask1"
                        />
                        <label className="form-check-label" htmlFor="selectTask1">
                          Task 1
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="selectTask2"
                        />
                        <label className="form-check-label" htmlFor="selectTask2">
                          Task 2
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="selectTask3"
                        />
                        <label className="form-check-label" htmlFor="selectTask3">
                          Task 3
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="selectTask4"
                        />
                        <label className="form-check-label" htmlFor="selectTask4">
                          Task 4
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="selectTask5"
                        />
                        <label className="form-check-label" htmlFor="selectTask5">
                          Task 5
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
              <div className="text-center my-3">
                <a
                  href="javascript:;"
                  className="btn btnyellow me-2"
                  id="projModalSelectBtn"
                  data-bs-toggle="tooltip"
                  title="Select"
                >
                  Select
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectProjectDetlsModal;
