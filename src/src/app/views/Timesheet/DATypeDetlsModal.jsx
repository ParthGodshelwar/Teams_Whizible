import React from "react";

function DATypeDetlsModal() {
  return (
    <div className="modal fade" id="DA_TypeDetlsModal" aria-hidden="true">
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
            <div className="timesheetFields py-3">
              <div className="form-group row pt-1 mb-2">
                <label className="col-sm-4 text-end">DA Type</label>
                <div className="col-sm-6">
                  <div className="DA_TypeDetls">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="DA_TypeSelect"
                            id="NormalDAcheck"
                          />
                          <label className="form-check-label" htmlFor="NormalDAcheck">
                            Normal
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="DA_TypeSelect"
                            id="OvertimeDAcheck"
                          />
                          <label className="form-check-label" htmlFor="OvertimeDAcheck">
                            Overtime
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="DA_TypeSelect"
                            id="OnCallSupportDAcheck"
                          />
                          <label className="form-check-label" htmlFor="OnCallSupportDAcheck">
                            On Call Support
                          </label>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="DA_TypeSelect"
                            id="CallBackDAcheck"
                          />
                          <label className="form-check-label" htmlFor="CallBackDAcheck">
                            Call Back
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group row pt-1 mb-2">
                <label className="col-sm-4 text-end">Description</label>
                <div className="col-sm-6">
                  <textarea className="form-control" id="DescriptionEfforts" defaultValue={""} />
                </div>
              </div>
            </div>
            <div className="clearfix" />
            <div className="text-center my-3">
              <a
                href="javascript:;"
                className="btn btnyellow me-2"
                id="caleModalSaveBtn"
                data-bs-toggle="tooltip"
                title="Save"
              >
                Save
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
  );
}

export default DATypeDetlsModal;
