import React from "react";

function ApprTabs() {
  return (
    <div>
      {" "}
      <div className="tab-pane ApprTabs fade" id="MyTS_ApprTab" role="tabpanel">
        {/* Entity tabs Desktop View start */}
        <div
          className="allWorkflowTabsDiv allTabsDivStructure  d-none d-lg-flex justify-content-end ms-4 mt-4"
          id="DeskWF_TabsDiv"
        >
          <ul className="nav nav-tabs pe-3" id="AllEntityTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className="nav-link active position-relative"
                id="ApprovedTab"
                data-bs-toggle="tab"
                data-bs-target="#Approved_DetailsTab"
                role="tab"
              >
                Approved
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className="nav-link position-relative"
                id="RejectedTab"
                data-bs-toggle="tab"
                data-bs-target="#Rejected_DetailsTab"
                role="tab"
              >
                Rejected
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className="nav-link position-relative"
                id="SubmittedTab"
                data-bs-toggle="tab"
                data-bs-target="#Submitted_DetailsTab"
                role="tab"
              >
                Submitted
              </button>
            </li>
          </ul>
        </div>
        {/* Entity tabs Desktop View end */}
        <div className="tab-content  mt-3" id="TS_entryTabContent">
          {/* Added/Commented By Madhuri.K On 26-Aug-2024 For Approved Details Section start Here */}
          <div
            className="tab-pane ApprTabs fade show active mx-4"
            id="Approved_DetailsTab"
            role="tabpanel"
          >
            <div className="form-group mb-2">
              <div className="row">
                <div className="col-sm-2">&nbsp;</div>
                <div className="col-sm-7" />
                <div className="col-sm-3 text-end">
                  <div className="input-group">
                    <input
                      id="searchApprInput"
                      type="text"
                      placeholder="Search.."
                      onkeyup="searchApproved()"
                      className="form-control input-sm"
                    />
                    <div className="input-group-btn">
                      <button className="btn btn-default srchBtn" type="submit">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="allEntity col-sm-12" id="ResTSEntity">
              {/* Desktop View Starts here */}
              <div className="projListViewDiv d-lg-block" id="Approved_TSListViewSec">
                <div className="table-responsive">
                  <table
                    id="MyTS_ApprovalTbl"
                    className="table table-hover myApprovalTbl"
                    style={{ width: "100%" }}
                  >
                    <thead className="stickyTblHeader">
                      <tr>
                        <th className="col-sm-2">Submitted Date</th>
                        <th className="col-sm-3">Period </th>
                        <th className="col-sm-1">Actual Hours</th>
                        <th className="col-sm-1">Status</th>
                        <th className="col-sm-1">History</th>
                        <th className="col-sm-1">By</th>
                        <th className="col-sm-1">Date</th>
                        <th className="col-sm-2">Approve/Reject Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>21-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Approved "
                          >
                            <span className="statusBox statusApproved mx-2">&nbsp;</span>
                            <label className="crsrLink">Approved </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>ADMIN</td>
                        <td>22-Sep-2023</td>
                        <td>Approved</td>
                      </tr>
                      <tr>
                        <td>25-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Approved "
                          >
                            <span className="statusBox statusApproved mx-2">&nbsp;</span>
                            <label className="crsrLink">Approved </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Nikita.D</td>
                        <td>25-Sep-2023</td>
                        <td>Ok</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Approved "
                          >
                            <span className="statusBox statusApproved mx-2">&nbsp;</span>
                            <label className="crsrLink">Approved </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Max.K</td>
                        <td>25-Sep-2023</td>
                        <td>Ok</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Approved "
                          >
                            <span className="statusBox statusApproved mx-2">&nbsp;</span>
                            <label className="crsrLink">Approved </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Sunita</td>
                        <td>25-Sep-2023</td>
                        <td>Approved</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Desktop View Ends here */}
            </div>
          </div>
          {/* Added/Commented By Madhuri.K On 26-Aug-2024 For Approved Details Section End Here */}
          {/* Added/Commented By Madhuri.K On 26-Aug-2024 For Rejected Details Section start Here */}
          <div className="tab-pane ApprTabs fade mx-4" id="Rejected_DetailsTab" role="tabpanel">
            <div className="form-group mb-2">
              <div className="row">
                <div className="col-sm-2">&nbsp;</div>
                <div className="col-sm-7" />
                <div className="col-sm-3 text-end">
                  <div className="input-group">
                    <input
                      id="searchRejectInput"
                      type="text"
                      placeholder="Search.."
                      onkeyup="searchRejected()"
                      className="form-control input-sm"
                    />
                    <div className="input-group-btn">
                      <button className="btn btn-default srchBtn" type="submit">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="allEntity col-sm-12" id="ResTSEntity">
              {/* Desktop View Starts here */}
              <div className="projListViewDiv d-lg-block" id="ResTSListViewSec">
                <div className="table-responsive">
                  <table
                    id="MyTS_RejectTbl"
                    className="table table-hover myApprovalTbl"
                    style={{ width: "100%" }}
                  >
                    <thead className="stickyTblHeader">
                      <tr>
                        <th className="col-sm-2">Submitted Date</th>
                        <th className="col-sm-3">Period </th>
                        <th className="col-sm-1">Actual Hours</th>
                        <th className="col-sm-1">Status</th>
                        <th className="col-sm-1">History</th>
                        <th className="col-sm-1">By</th>
                        <th className="col-sm-1">Date</th>
                        <th className="col-sm-2">Approve/Reject Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTSReject_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Rejected "
                          >
                            <span className="statusBox statusRejected mx-2">&nbsp;</span>
                            <label className="crsrLink">Rejected </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Shree</td>
                        <td>21-Sep-2023</td>
                        <td>Ok</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTSReject_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Rejected "
                          >
                            <span className="statusBox statusRejected mx-2">&nbsp;</span>
                            <label className="crsrLink">Rejected </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Subir</td>
                        <td>21-Sep-2023</td>
                        <td>NA</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTSReject_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Rejected "
                          >
                            <span className="statusBox statusRejected mx-2">&nbsp;</span>
                            <label className="crsrLink">Rejected </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Mohit.K</td>
                        <td>21-Sep-2023</td>
                        <td>Ok</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTSReject_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              19-Sep-2023 to 25-Sep-2023
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Rejected "
                          >
                            <span className="statusBox statusRejected mx-2">&nbsp;</span>
                            <label className="crsrLink">Rejected </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Max.L</td>
                        <td>21-Sep-2023</td>
                        <td>Rejected</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Desktop View Ends here */}
            </div>
          </div>
          {/* Added/Commented By Madhuri.K On 26-Aug-2024 For Rejected Details Section End Here */}
          {/* Added/Commented By Madhuri.K On 26-Aug-2024 For Submitted Details Section start Here */}
          <div className="tab-pane ApprTabs fade mx-4" id="Submitted_DetailsTab" role="tabpanel">
            <div className="form-group mb-2">
              <div className="row">
                <div className="col-sm-2">&nbsp;</div>
                <div className="col-sm-7" />
                <div className="col-sm-3 text-end">
                  <div className="input-group">
                    <input
                      id="searchSubmitInput"
                      type="text"
                      placeholder="Search.."
                      onkeyup="searchSubmitted()"
                      className="form-control input-sm"
                    />
                    <div className="input-group-btn">
                      <button className="btn btn-default srchBtn" type="submit">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="allEntity col-sm-12" id="ResTSEntity">
              {/* Desktop View Starts here */}
              <div className="projListViewDiv d-lg-block" id="ResTSListViewSec">
                <div className="table-responsive">
                  <table
                    id="MyTS_SubmitTbl"
                    className="table table-hover myApprovalTbl"
                    style={{ width: "100%" }}
                  >
                    <thead className="stickyTblHeader">
                      <tr>
                        <th className="col-sm-2">Submitted Date</th>
                        <th className="col-sm-3">Period </th>
                        <th className="col-sm-1">Actual Hours</th>
                        <th className="col-sm-1">Status</th>
                        <th className="col-sm-1">History</th>
                        <th className="col-sm-1">By</th>
                        <th className="col-sm-1">Date</th>
                        <th className="col-sm-2">Approve/Reject Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_submit_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              {" "}
                              19-Sep-2023 to 25-Sep-2023{" "}
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Submitted "
                          >
                            <span className="statusBox statusSubmitted mx-2">&nbsp;</span>
                            <label className="crsrLink">Submitted </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Shree</td>
                        <td>21-Sep-2023</td>
                        <td>Ok</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_submit_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              {" "}
                              19-Sep-2023 to 25-Sep-2023{" "}
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Submitted "
                          >
                            <span className="statusBox statusSubmitted mx-2">&nbsp;</span>
                            <label className="crsrLink">Submitted </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Max</td>
                        <td>21-Sep-2023</td>
                        <td>NA</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_submit_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              {" "}
                              19-Sep-2023 to 25-Sep-2023{" "}
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Submitted "
                          >
                            <span className="statusBox statusSubmitted mx-2">&nbsp;</span>
                            <label className="crsrLink">Submitted </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Maddy</td>
                        <td>21-Sep-2023</td>
                        <td>Ok</td>
                      </tr>
                      <tr>
                        <td>15-Sep-2023 3:47PM</td>
                        <td>
                          <a
                            href="javascript:;"
                            id="LeaveDetailsBtn1"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#EditMyTS_submit_offcanvas"
                          >
                            <span data-bs-toggle="tooltip" title="Details">
                              {" "}
                              19-Sep-2023 to 25-Sep-2023{" "}
                            </span>
                          </a>
                        </td>
                        <td>01:00</td>
                        <td>
                          <div
                            className="statusDiv d-flex justify-content-start"
                            data-bs-toggle="tooltip"
                            title="Submitted "
                          >
                            <span className="statusBox statusSubmitted mx-2">&nbsp;</span>
                            <label className="crsrLink">Submitted </label>
                          </div>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="tooltip"
                            className="btn px-2"
                            type="button"
                            title="History"
                          >
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#showMyTSHistory_offcanvas"
                            >
                              <i className="fa-solid fa-clock-rotate-left hist_icon" />
                            </span>
                          </button>
                        </td>
                        <td>Santosh.I</td>
                        <td>21-Sep-2023</td>
                        <td>Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Desktop View Ends here */}
            </div>
          </div>
          {/* Added/Commented By Madhuri.K On 26-Aug-2024 For Submitted Details Section End Here */}
        </div>
      </div>
    </div>
  );
}

export default ApprTabs;
