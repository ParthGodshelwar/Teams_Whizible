import React, { useState } from "react";
import ApprovedTimesheet from "./ApprovedTimesheet";
import RejectedTimesheet from "./RejectedTimesheet";
import SubmittedTimesheet from "./SubmittedTimesheet";
// import "./TimesheetMobileView.css";
// import "../css/style.css";
// import "../css/style_bk.css";
// import "../css/style_Madhuri.css";

import "./TimesheetMobileView.css";
import "../css/style.css";
import "../css/style_bk.css";
import "../css/style_Madhuri.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Tooltip } from "@mui/material";
// import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// const MyTimesheetTab = () => {
//   const [activeSubTab, setActiveSubTab] = useState("Approved");

//   const handleSubTabChange = (tab) => {
//     setActiveSubTab(tab);
//   };

//   return (
//     <>

//     </>
//   );
// };

// export default MyTimesheetTab;

const MyTimesheetTab1 = () => {
  const allEntries = [
    {
      submittedDate: "21-Sep-2024 3:47PM",
      period: "21-Sep-2024 to 25-Oct-2024",
      actualHours: "09:30",
      status: "Submitted",
      approvedBy: "Shree",
      approvedImg: "Teams-New/dist/img/profImg1.jpg",
      date: "22-Sep-2024",
      remark: "Submitted",
      category: "Submitted",
    },
    {
      submittedDate: "21-Nov-2024 3:47PM",
      period: "21-Nov-2024 to 25-Jan-2025",
      actualHours: "06:45",
      status: "Approved",
      approvedBy: "Aditi",
      approvedImg: "Teams-New/dist/img/profImg2.jpg",
      date: "21-Nov-2024",
      remark: "Approved",
      category: "Approved",
    },
    {
      submittedDate: "01-Dec-2024 10:00AM",
      period: "01-Dec-2024 to 31-Dec-2024",
      actualHours: "08:15",
      status: "Rejected",
      approvedBy: "Ravi",
      approvedImg: "Teams-New/dist/img/profImg3.jpg",
      date: "02-Dec-2024",
      remark: "Rejected",
      category: "Rejected",
    },
  ];

  const [selectedTab, setSelectedTab] = useState("Submitted");

  const filterEntries = () => {
    return allEntries.filter((entry) => entry.category === selectedTab);
  };

  return (
    <div className="container">
      {/* Tabs Section */}
      <div className="allWorkflowTabsDiv d-flex justify-content-start ms-4" id="MyApprTabsDivMob">
        <ul className="nav nav-tabs mx-auto gap-3 mb-3" id="AllApprTabsMob" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              href="javascript:;"
              className={selectedTab === "Approved" ? "active" : ""}
              id="ApprovedTS_Tab_Mob"
              onClick={() => setSelectedTab("Approved")}
              role="tab"
              aria-selected={selectedTab === "Approved"}
            >
              <i className="fa-regular fa-thumbs-up text-green"></i> Approved
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              href="javascript:;"
              className={selectedTab === "Rejected" ? "active" : ""}
              id="RejectedTS_Tab_Mob"
              onClick={() => setSelectedTab("Rejected")}
              role="tab"
              aria-selected={selectedTab === "Rejected"}
            >
              <i className="fa-regular fa-thumbs-down text_red"></i> Rejected
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              href="javascript:;"
              className={selectedTab === "Submitted" ? "active" : ""}
              id="SubmittedTS_Tab_Mob"
              onClick={() => setSelectedTab("Submitted")}
              role="tab"
              aria-selected={selectedTab === "Submitted"}
            >
              <i className="fa-regular fa-share-from-square blueTxt"></i> Submitted
            </a>
          </li>
        </ul>
      </div>

      {/* Timesheet Cards */}
      <div className="Appr_Cards">
        {filterEntries().map((entry, index) => (
          <div className="col-12" key={index}>
            <div className={`card shadowBox mb-2 ${
              entry.category === "Approved" ? "greenCardBrdr" :
              entry.category === "Rejected" ? "redCardBrdr" :
              "skyBlueCardBrdr"
            }`}>
              <div className="card-body">
                <div className="card-item text-end">
                  {/* <div></div> Placeholder to push the icon to the right */}
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
                          entry.category === "Approved" ? "statusApproved" :
                          entry.category === "Rejected" ? "statusRejected" :
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
                        <span>{item.value}</span> 
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTimesheetTab1;
