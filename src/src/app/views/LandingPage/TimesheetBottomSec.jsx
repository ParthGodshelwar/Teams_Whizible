import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const TimesheetBottomSec = ({ timesheetData }) => {
  const [overallEffort, setOverallEffort] = useState("");

  useEffect(() => {
    if (timesheetData?.listTimesheetEntryHeader?.length > 0) {
      setOverallEffort(timesheetData.listTimesheetEntryHeader[0].weekActualHours);
    } else {
      setOverallEffort(null); // Optional: Handle cases where the value doesn't exist
    }
  }, [timesheetData]);

  return (
    <div className="TimesheetBottomSec p-3">
      <div className="row">
        <div className="col-sm-3">
          <div className="IconCardTxt mb-2">This Week Project Efforts - </div>
          <div className="row">
            <ul className="list-group taskDetls">
              {timesheetData.listProjectDetailsEntity?.map(
                (project, index) =>
                  // Check if project.projectWeekEfforts is not '00:00'
                  project.projectWeekEfforts !== "00:00" && (
                    <li className="list-group-item d-flex align-items-center" key={index}>
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-dark me-2"
                        style={{ fontSize: "8px" }}
                      />
                      <span className="li_PS0">{project.projectName} :</span>
                      <span className="ms-2">{project.projectWeekEfforts}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>

        <div className="col-sm-6">
          <ul className="list-unstyled statusList">
            <div>
              <span className="statusBox text_orange pe-2">
                <FontAwesomeIcon icon={faCircle} />
              </span>
              <label className="crsrLink" data-bs-toggle="tooltip" title="Holiday">
                Working
              </label>
            </div>
            <div>
              <span className="statusBox txt_SkyBlue pe-2">
                <FontAwesomeIcon icon={faCircle} />
              </span>
              <label className="crsrLink" data-bs-toggle="tooltip" title="Holiday">
                Holiday
              </label>
            </div>
            <div>
              <span className="statusBox txt_Blue pe-2">
                <FontAwesomeIcon icon={faCircle} />
              </span>
              <label className="crsrLink" data-bs-toggle="tooltip" title="Leave">
                Leave
              </label>
            </div>
            <div>
              <span className="statusBox txt_Grey pe-2">
                <FontAwesomeIcon icon={faCircle} />
              </span>
              <label className="crsrLink" data-bs-toggle="tooltip" title="Weekly Off">
                Weekly Off
              </label>
            </div>
          </ul>
        </div>
        <div className="col-sm-3">
          <div className="text-end">
            <span className="txt_Blue fw-500">Overall Efforts - {overallEffort}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetBottomSec;
