import React, { useEffect, useState } from "react";
import { Dropdown } from "@fluentui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Jwt.css";
import GetQinbox from "../../hooks/landingpage/GetQinbox";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const QuickInbox = ({ refrsh, setRefresh }) => {
  const [qinbox, setQinbox] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const getCurrentWeek = () => {
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const pastDaysOfYear = (new Date() - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  const [week, setWeek] = useState(getCurrentWeek().toString());

  const monthOptions = [
    { key: "0", text: "Select Month" },
    { key: "1", text: "January" },
    { key: "2", text: "February" },
    { key: "3", text: "March" },
    { key: "4", text: "April" },
    { key: "5", text: "May" },
    { key: "6", text: "June" },
    { key: "7", text: "July" },
    { key: "8", text: "August" },
    { key: "9", text: "September" },
    { key: "10", text: "October" },
    { key: "11", text: "November" },
    { key: "12", text: "December" },
  ];

  const yearOptions = [
    { key: "0", text: "Select Year" },
    { key: "2015", text: "2015" },
    { key: "2016", text: "2016" },
    { key: "2017", text: "2017" },
    { key: "2018", text: "2018" },
    { key: "2019", text: "2019" },
    { key: "2020", text: "2020" },
    { key: "2021", text: "2021" },
    { key: "2022", text: "2022" },
    { key: "2023", text: "2023" },
    { key: "2024", text: "2024" },
    { key: "2025", text: "2025" },
  ];

  const weekOptions = Array.from({ length: 52 }, (_, i) => ({
    key: (i + 1).toString(),
    text: `Week ${String(i + 1).padStart(2, "0")}`,
  }));

  // Adding "Select Week" as the first option
  weekOptions.unshift({ key: "0", text: "Select Week" });

  console.log(weekOptions);

  const fetchQinboxData = async (year, month, week) => {
    try {
      const data = await GetQinbox(year, month, week);
      setQinbox(data);
      console.log("Fetched Quick Inbox Data:", data);
    } catch (error) {
      console.error("Failed to fetch quick inbox data:", error);
    }
  };

  useEffect(() => {
    fetchQinboxData(year, month, week);
  }, [year, month, week, refrsh]);

  const bgColors = ["bgYellow", "bgGreenBlue", "orangeBg", "bgGreen", "bgRed"];

  const getRandomBgColor = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  return (
    <div className="myReportSection flex-1">
      <div className="d-flex justify-content-between px-3">
        <div className="reportTitle">My Utilization</div>
      </div>
      <div className="monthSelectpicker d-flex justify-content-end">
        <Dropdown
          placeholder="Select Week"
          options={weekOptions}
          selectedKey={week}
          onChange={(e, option) => setWeek(option.key)}
        />
      </div>

      <div className="row mt-5">
        <div className="col-12 col-md-5">
          {qinbox &&
            qinbox.map((report, index) =>
              report.typeDec === "Doughnut" ? (
                <div
                  key={index}
                  className="circular_progressbar"
                  aria-valuenow="60"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ "--value": report.actualValue }}
                >
                  {report.headerValue}
                </div>
              ) : null
            )}
        </div>

        <div className="col-12 col-md-6 d-flex flex-column justify-content-center gap-4">
          {qinbox ? (
            qinbox
              .filter((report) => report.typeDec !== "Doughnut")
              .map((report, index) => {
                // Determine the color based on the actual value
                const progressColor =
                  report.actualValue >= 100
                    ? "bg-success" // Green
                    : report.actualValue >= 80
                    ? "bg-warning" // Orange
                    : "bg-danger"; // Light red

                return (
                  <div className="row justify-content-end" key={index}>
                    <div className="col-12 col-sm-3 d-flex align-items-center justify-content-end">
                      <div className={`timeReportDiv ${progressColor}`}>
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                    </div>

                    <div className="col-12 col-sm-8">
                      <div className="row">
                        <div className="timeReportContent ms-2 ps-0 d-flex justify-content-between text-start">
                          <div className="report_txt">
                            {report.header} <br />
                            <span className="fw-500">{report.headerValue}</span>
                          </div>
                          <div className="report_txt">
                            {report.actualValue}%
                          </div>
                        </div>
                        <div
                          className="progress ms-2 ps-0"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow={report.actualValue}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className={`progress-bar ${progressColor}`}
                            style={{ width: `${report.actualValue}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div>Loading data...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickInbox;
