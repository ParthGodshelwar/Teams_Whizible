import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const statusMap = {
  Approved: "v", // 'R' for Approved
  Rejected: "j", // 'J' for Rejected
  Submitted: "r" // 'S' for Submitted
};

const Timesheet = ({ employeeId, accessToken }) => {
  const [selectedTab, setSelectedTab] = useState("Submitted");
  const [timesheetData, setTimesheetData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimesheetData = async (status, page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyTimesheet/GetMyTimesheetList?UserID=${employeeId}&Status=${status}&PageNo=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json, text/plain, */*"
          }
        }
      );
      const data = await response.json();
      setTimesheetData(data || []); // Ensure data is an array
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTimesheetData(statusMap[selectedTab], currentPage);
  }, [selectedTab, currentPage]);

  return (
    <div className="container">
      {/* Tabs Section */}
      <div className="allWorkflowTabsDiv d-flex justify-content-start ms-4">
        <ul className="nav nav-tabs mx-auto gap-3 mb-3">
          {["Approved", "Rejected", "Submitted"].map((tab) => (
            <li className="nav-item" key={tab}>
              <a
                href="javascript:;"
                className={selectedTab === tab ? "active" : ""}
                onClick={() => {
                  setSelectedTab(tab);
                  setCurrentPage(1); // Reset to page 1 when switching tabs
                }}
              >
                {tab === "Approved" && <i className="fa-regular fa-thumbs-up text-green"></i>}
                {tab === "Rejected" && <i className="fa-regular fa-thumbs-down text_red"></i>}
                {tab === "Submitted" && <i className="fa-regular fa-share-from-square blueTxt"></i>} {tab}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Timesheet Cards */}
      {isLoading ? (
        <div className="text-center mt-3">
          <i className="fa fa-spinner fa-spin fa-2x"></i>
        </div>
      ) : (
        <div className="row">
          {timesheetData.length === 0 ? (
            <div className="text-center">No records found</div>
          ) : (
            timesheetData.map((entry, index) => (
              <div className="col-12" key={index}>
                <div className={`card shadowBox mb-2 ${
                  selectedTab === "Approved" ? "greenCardBrdr" :
                  selectedTab === "Rejected" ? "redCardBrdr" :
                  "skyBlueCardBrdr"
                }`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div></div>
                      <Tooltip title="More Details">
                        <a href="javascript:;" data-bs-toggle="offcanvas" data-bs-target="#MyTS_SubmittedDetlsOffcanvas">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </a>
                      </Tooltip>
                    </div>

                    {/* Card Details */}
                    {[
                      { label: "Submitted Date", value: entry.submittedDate },
                      { label: "Period", value: entry.period },
                      { label: "Actual Hours", value: entry.actualHours },
                      { 
                        label: "Status",
                        value: (
                          <div className="statusDiv1 d-flex align-items-center">
                            <span className={`statusBox mx-2 ${
                              selectedTab === "Approved" ? "statusApproved" :
                              selectedTab === "Rejected" ? "statusRejected" :
                              "statusSubmitted"
                            }`}>&nbsp;</span>
                            <label className="pe-2">{entry.status}</label>
                          </div>
                        )
                      },
                      {
                        label: "Approved By",
                        value: (
                          <>
                            <img src={entry.approvedImg} alt="" className="img-fluid resImg mx-2" />
                            {entry.approvedBy}
                          </>
                        )
                      },
                      { label: "Date", value: entry.date },
                      { label: "Approve/Reject Remark", value: entry.remark }
                    ].map((item, idx) => (
                      <div className="card-item mb-1" key={idx}>
                        <div className="cardContent">
                          <div className="row">
                            <div className="col-5 col-sm-5 text-end">
                              <span className="CardsTitle">{item.label} :</span>
                            </div>
                            <div className="col-7 col-sm-7">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {timesheetData.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <i className="fa fa-arrow-left"></i> Prev
          </button>
          <span className="mt-1">Page {currentPage}</span>
          <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next <i className="fa fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
