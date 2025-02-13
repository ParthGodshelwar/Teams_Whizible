import React from "react";

function showMyTSHistoryoffcanvas() {
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-85"
      data-bs-scroll="false"
      tabIndex={-1}
      id="showMyTSHistory_offcanvas"
    >
      <div className="offcanvas-body">
        <div id="ProjInfo_Sec" className="ProjInfoDetails">
          <div className="graybg container-fluid py-1 mb-4">
            <div className="row">
              <div className="col-sm-6">
                <h5 className="pgtitle">My Timesheet History</h5>
              </div>
              <div className="col-sm-6 text-end">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div>
            </div>
          </div>
          <div className="projListViewDiv d-lg-block mt-4 mx-2" id>
            <div className="table-responsive">
              <table
                id="MyTS_historyTbl"
                className="table table-hover table-striped myApprovalTbl"
                style={{ width: "100%" }}
              >
                <thead className="stickyTblHeader">
                  <tr>
                    <th className="col-sm-2">Status</th>
                    <th className="col-sm-2">Generation Date</th>
                    <th className="col-sm-2">Updated Date</th>
                    <th className="col-sm-2">Action Taken By</th>
                    <th className="col-sm-2">Action Taken</th>
                    <th className="col-sm-2">Approver Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Approved</td>
                    <td />
                    <td>19-Sep-2023 3:47:59 PM</td>
                    <td>ADMIN</td>
                    <td>Timesheet Approved</td>
                    <td>ADMIN</td>
                  </tr>
                  <tr>
                    <td>Approved</td>
                    <td />
                    <td>19-Sep-2023 3:47:59 PM</td>
                    <td>ADMIN</td>
                    <td>Timesheet Sent For Approval</td>
                    <td>ADMIN</td>
                  </tr>
                  <tr>
                    <td>Submitted</td>
                    <td>19-Sep-2023 3:47:59 PM</td>
                    <td>19-Sep-2023 3:47:59 PM</td>
                    <td>ADMIN</td>
                    <td>Timesheet Generated</td>
                    <td>ADMIN</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default showMyTSHistoryoffcanvas;
