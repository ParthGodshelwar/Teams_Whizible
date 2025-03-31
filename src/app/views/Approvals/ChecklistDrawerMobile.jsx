import React from "react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Drawer, Button, CircularProgress } from "@mui/material";
import Tooltip1 from "@mui/material/Tooltip";

const ChecklistDrawerMobile = ({
  openDrawer,
  setopenDrawer,
  projectId,
  handleCloseDrawer,
  refresh,
  setRefresh,
}) => {
  const [checklistData, setChecklistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({}); // State to manage answers and comments

  useEffect(() => {
    if (openDrawer == "ChecklistResponse" && projectId) {
      fetchChecklistData(projectId);
    }
  }, [openDrawer, projectId]);

  // const handleclosechecklistdrawer=() => {
  //   setopenDrawer(null);
  // }

  const fetchChecklistData = async (projectID) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userid = user.data.employeeId;

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/GetProjectApprovalCheckList?ProjectID=${projectID}&userID=${userid}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setChecklistData(data.data.checkListCategoryDetails);
    } catch (error) {
      console.error("Failed to fetch checklist data:", error);
      setError("Failed to load checklist details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (sectionItemID, questionnaireOptionID) => {
    setResponses((prev) => ({
      ...prev,
      [sectionItemID]: {
        ...prev[sectionItemID],
        response: questionnaireOptionID, // Update the response correctly
      },
    }));
  };

  const handleCommentChange = (sectionItemID, comment) => {
    setResponses((prev) => ({
      ...prev,
      [sectionItemID]: {
        ...prev[sectionItemID],
        comments: comment,
      },
    }));
  };

  const handleSave = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userid = user.data.employeeId;
    const ContextId = checklistData[0]?.contextId; // Assuming the context ID is fixed or can be mapped accordingly

    // Prepare the list of checklist details to be sent in the API request
    const listChecklistDeatilsParam = [];

    // Iterate over all checklist categories and sections
    for (const category of checklistData) {
      for (const section of category.listCheckListSectionDetails) {
        const { sectionItemID, sectionItemName, listAnswerDetails } = section;

        // Skip sections where listAnswerDetails is empty
        if (listAnswerDetails.length === 0) {
          continue; // Skip this section and move to the next one
        }

        // Check if there are any responses for the current section
        const response = responses[sectionItemID];

        // If no response for this section, skip or show an error
        if (!response || !response.response) {
          // toast.error(`Please select a response for: ${sectionItemName}`);
          toast.error(`Responses are mandatory for all line items`);
          return;
        }

        // Prepare the checklist item data to send
        const requestBody = {
          ContextId,
          ContextType: "P",
          ProjectCheckListItemId: sectionItemID,
          ResponseId: response.response, // Response ID from responses state
          Comments: response.comments || "", // Comments are now optional
          UniqueId: checklistData[0]?.stageID,
          RespondedBy: userid,
          NegativeResponseId: response?.negativeResponseId || 0, // Optional Negative Response ID
          ClearResponses: 0, // Assuming you always want to clear previous responses after saving
        };

        listChecklistDeatilsParam.push(requestBody);
      }
    }

    // If no valid checklist data to save, exit
    if (listChecklistDeatilsParam.length === 0) {
      toast.error("No valid checklist data to save.");
      return;
    }

    // API Request Body
    const requestBody = {
      projectID: projectId, // Pass the projectID to the API
      listChecklistDeatilsParam,
    };

    try {
      const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/PostProjectApprovalCheckList`;

      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        throw new Error("Error submitting checklist responses");
      }

      const responseData = await apiResponse.json();

      if (responseData.data === "Success") {
        toast.success("Checklist responses saved successfully.");
        setRefresh((prev) => !prev);
      } else {
        toast(responseData.data); // Show whatever is in the data field
      }

      setopenDrawer(null);
      console.log("All checklist responses saved successfully");
    } catch (error) {
      console.error("Failed to save checklist responses:", error);
      toast.error("Failed to save checklist responses");
    }
  };

  const isSaveDisabled = checklistData.some((category) =>
    category.listCheckListSectionDetails.some((section) =>
      section.listAnswerDetails.some(
        (answer) => answer.optionsValues === "True"
      )
    )
  );
  const resetStates = () => {
    setResponses({}); // Clear responses state when drawer is closed
    setChecklistData([]); // Optionally clear checklist data
    setError(null); // Optionally clear errors
    setLoading(false); // Reset loading state
  };

  return (
    <>
      {/* Bootstrap Offcanvas */}
      <div
        className={`offcanvas offcanvas-bottom offcanvasHeight-85 ${
          openDrawer === "ChecklistResponse" ? "show" : ""
        }`}
        tabIndex="-1"
        style={{
          visibility: openDrawer === "ChecklistResponse" ? "visible" : "hidden",
          transition: "0.3s ease-in-out",
        }}
      >
        <div className="container-fluid py-1 mb-2">
          <div className="stickyOffHeader pt-3">
            <div
              className="greyCloseOffcanvas"
              //   onClick={handleCloseDrawer}
              onClick={() => {
                handleCloseDrawer();
                resetStates(); // Call reset states function when drawer is closed
                // toggleDrawer(); // Also toggle drawer state
              }}
            >
              &nbsp;
            </div>
            <div className="p-2 mb-2">
              <div className="row">
                <div className="col-10">
                  <h5 className="offcanvasTitleMob mt-1">Checklist Response</h5>
                </div>
              </div>
            </div>

            {/* Added by Gauri to make header sticky on 05 Mar 2025 */}
            <div className="container-fluid py-2 graybg mb-2">
              <div className="row align-items-center">
                <div className="col-sm-12">
                  <div className="d-flex justify-content-between font-weight-500">
                    <label>
                      CheckList: {checklistData[0]?.checklistName}
                    </label>
                    <label>Stage: {checklistData[0]?.stageName}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* //Added by parth cross button */}
          {/* <div className="col-sm-6 text-end">
            <Tooltip1 title="Close">
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseDrawer}
                aria-label="Close"
              ></button>
            </Tooltip1>
          </div> */}
        </div>

        <div className="offcanvas-body">
          <div className="ChecklistRespSec mx-1">
            <div className="chcklist-main-wrap">
              {/* <div className="container-fluid py-2 graybg mb-2">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="d-flex justify-content-between font-weight-500">
                      <label>
                        CheckList: {checklistData[0]?.checklistName}
                      </label>
                      <label>Stage: {checklistData[0]?.stageName}</label>
                    </div>
                  </div>
                </div>
              </div> */}

              <p className="mb-2 blueTxt">
                <i className="far fa-sticky-note me-2"></i>
                Responses in bold characters represent negative responses.
              </p>

              {loading ? (
                <div className="text-center py-3">
                  <CircularProgress />
                  <p>Loading checklist details...</p>
                </div>
              ) : error ? (
                <div className="text-center text-danger py-3">
                  <p>{error}</p>
                </div>
              ) : checklistData.length > 0 ? (
                <>
                  <div className="table-responsive" style={{ maxHeight: "55vh", overflowY: "auto" }}>
                    <table className="table table-bordered table_sticky">
                      <thead className="TblHeaderSticky">
                        <tr>
                          <th>Sr.No.</th>
                          <th>CheckList Item</th>
                          <th>Responses</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {checklistData.map((category, categoryIndex) => (
                          <>
                            <tr key={`section-${categoryIndex}`}>
                              <td
                                colSpan="4"
                                className="bgLightGrey2 text-start"
                              >
                                {category.categoryName}
                              </td>
                            </tr>

                            {category.listCheckListSectionDetails.map(
                              (section, sectionIndex) => (
                                <React.Fragment key={sectionIndex}>
                                  {/* // {section.} */}
                                  {section.listAnswerDetails?.length > 0 && (
                                    <tr>
                                      <td>{sectionIndex + 1}.</td>
                                      <td>
                                        {section.sectionItemName ||
                                          "Section Name Missing"}
                                      </td>
                                      <td>
                                        <div className="row">
                                          {section.listAnswerDetails.map(
                                            (answer, answerIndex) => (
                                              <>
                                                <div
                                                  key={answerIndex}
                                                  className="d-flex gap-1"
                                                >
                                                  <input
                                                    type="radio"
                                                    id={`radio-${section.sectionItemID}-${answer?.questionnaireOptionID}`}
                                                    name={`response-${section.sectionItemID}`}
                                                    checked={
                                                      responses[
                                                        section.sectionItemID
                                                      ]?.response ===
                                                        answer?.questionnaireOptionID ||
                                                      answer.optionsValues ===
                                                        "True" // Check if response matches or if the value is "True"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange(
                                                        section.sectionItemID,
                                                        answer?.questionnaireOptionID
                                                      )
                                                    }
                                                  />
                                                  <label className="mb-0"
                                                    htmlFor={`radio-${section.sectionItemID}-${answer?.questionnaireOptionID}`}
                                                  >
                                                    <span></span>
                                                  </label>
                                                {/* </div> */}
                                                  <label className="mb-0"
                                                    htmlFor={`radio-${section.sectionItemID}-${answer?.questionnaireOptionID}`}
                                                  >
                                                    {answer?.optionDescription ||
                                                      "No Option Description"}
                                                  </label>
                                                </div>
                                              </>
                                            )
                                          )}
                                        </div>
                                      </td>
                                      <td>
                                        <textarea
                                          className="form-control"
                                          rows="2"
                                          value={responses[section.sectionItemID]?.comments|| ""}
                                          onChange={(e) =>
                                            handleCommentChange(
                                              section.sectionItemID,
                                              e.target.value
                                            )
                                          }
                                        ></textarea>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              )
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p>No checklist details available.</p>
              )}
            </div>
          </div>

          {!isSaveDisabled && (
            <div className="text-center my-2">
              <button
                className="btn btnyellow"
                onClick={handleSave}
                disabled={isSaveDisabled}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChecklistDrawerMobile;
