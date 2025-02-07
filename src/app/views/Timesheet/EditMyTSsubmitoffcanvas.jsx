import React from "react";

function EditMyTSsubmitoffcanvas() {
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-85"
      data-bs-scroll="false"
      tabIndex={-1}
      id="EditMyTS_submit_offcanvas"
    >
      <div className="offcanvas-body">
        <div id="ProjInfo_Sec" className="ProjInfoDetails">
          <div className="graybg container-fluid py-1 mb-2">
            <div className="row">
              <div className="col-sm-6">
                <h5 className="pgtitle">Timesheet Details</h5>
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
          <div className="row d-flex justify-content-between">
            <div className="col-sm-5 ps-3 my-3">
              <span className="fw-500">Week Period -</span> 12 August to 16 August
            </div>
            <div className="col-sm-7 ps-3 my-3 text-end">
              <span className=" text-end mx-3">
                Week Total / Expected Hours -
                <span className="fw-500 txt_Blue">
                  {" "}
                  <i className="fa-regular fa-clock" /> 60:00 / 40:00
                </span>
              </span>
              <span className="text-end mx-3">
                Timesheet Status - <span className="txt_Blue   fw-500"> Submitted</span>
              </span>
            </div>
          </div>
          <div className="form-group mb-2">
            <div className="row">
              <div className="col-sm-2">&nbsp;</div>
              <div className="col-sm-7" />
              <div className="col-sm-3 text-end">
                <div className="input-group">
                  <input
                    id="search_Edit_SubmittedInput"
                    type="text"
                    placeholder="Search Task.."
                    onkeyup="searchEdit_Submitted()"
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
          <div className="projListViewDiv d-lg-block mx-4 mt-3" id>
            <div className="table-responsive">
              <table
                id="MyTS_Edit_SubmitTbl"
                className="table table-hover table-striped myApprovalTbl"
                style={{ width: "100%" }}
              >
                <thead className="stickyTblHeader">
                  <tr>
                    <th className="col-sm-3">Projects / Tasks / Sub-Task</th>
                    <th className>
                      MON <br /> 19 Aug 2024
                    </th>
                    <th className>
                      TUE <br /> 20 Aug 2024
                    </th>
                    <th className>
                      WED <br /> 21 Aug 2024
                    </th>
                    <th className>
                      THU <br /> 22 Aug 2024
                    </th>
                    <th className>
                      FRI <br /> 23 Aug 2024
                    </th>
                    <th className>
                      SAT <br /> 24 Aug 2024
                    </th>
                    <th className>
                      SUN <br /> 25 Aug 2024
                    </th>
                    <th className>
                      Planned <br /> Effort
                    </th>
                    <th className>
                      Actual <br /> Effort
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td_txt_bg">
                      <span className="pro_text">Total work for a Day</span>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">08:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">08:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">08:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">08:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">08:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">00:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">
                      <div className="text-center">
                        <label className="input_blu">00:00</label>
                      </div>
                    </td>
                    <td className="td_txt_bg">--</td>
                    <td className="td_txt_bg">--</td>
                  </tr>
                  <tr>
                    <td colSpan={11} className="text-start">
                      <div>
                        <img
                          src="Teams-New/dist/img/Project_blu_icon.svg"
                          alt=""
                          className="ApprIcns"
                        />
                        <span className="pro_text"> Small Customization 23-2024</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>QUICK ENTRY PAGE FOR 2 TASK</div>
                      <div className="d-flex justify-content-between">
                        <div className>
                          <span className="projTitle txt-small">Start Date</span>
                          <span className="txt-small">:19-Aug-2024</span>
                        </div>
                        <div className>
                          <span className="projTitle txt-small">End Date</span>
                          <span className="txt-small">:23-Aug-2024</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>04:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>04:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>04:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>03:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>05:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>00:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>00:00</label>
                      </div>
                    </td>
                    <td>16:00</td>
                    <td className="textRed fw-500">20:00</td>
                  </tr>
                  <tr>
                    <td colSpan={11} className="text-start">
                      <div>
                        <img
                          src="Teams-New/dist/img/Project_blu_icon.svg"
                          alt=""
                          className="ApprIcns"
                        />
                        <span className="pro_text">Sonata-2024</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Version Upgrade TASK</div>
                      <div className="d-flex justify-content-between">
                        <div className>
                          <span className="projTitle txt-small">Start Date</span>
                          <span className="txt-small">:19-Aug-2024</span>
                        </div>
                        <div className>
                          <span className="projTitle txt-small">End Date</span>
                          <span className="txt-small">:23-Aug-2024</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>04:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>04:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>04:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>05:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>03:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>00:00</label>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <label className>00:00</label>
                      </div>
                    </td>
                    <td>16:00</td>
                    <td className="textRed fw-500">20:00</td>
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

export default EditMyTSsubmitoffcanvas;
