import React, { useState, useEffect } from "react";
import { Drawer, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
const ChecklistDrawer = ({ showDrawer, toggleDrawer, projectID }) => {
  const [checklistData, setChecklistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({}); // State to manage answers and comments

  useEffect(() => {
    if (showDrawer && projectID) {
      fetchChecklistData(projectID);
    }
  }, [showDrawer, projectID]);

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
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
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
        response: questionnaireOptionID // Update the response correctly
      }
    }));
  };

  const handleCommentChange = (sectionItemID, comment) => {
    setResponses((prev) => ({
      ...prev,
      [sectionItemID]: {
        ...prev[sectionItemID],
        comments: comment
      }
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
          ClearResponses: 0 // Assuming you always want to clear previous responses after saving
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
      projectID: projectID, // Pass the projectID to the API
      listChecklistDeatilsParam
    };

    try {
      const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/MyApprovals/PostProjectApprovalCheckList`;

      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!apiResponse.ok) {
        throw new Error("Error submitting checklist responses");
      }

      const responseData = await apiResponse.json();

      if (responseData.data === "Success") {
        toast.success("Checklist responses saved successfully.");
      } else {
        toast(responseData.data); // Show whatever is in the data field
      }

      toggleDrawer();
      console.log("All checklist responses saved successfully");
    } catch (error) {
      console.error("Failed to save checklist responses:", error);
      toast.error("Failed to save checklist responses");
    }
  };
  const isSaveDisabled = checklistData.some((category) =>
    category.listCheckListSectionDetails.some((section) =>
      section.listAnswerDetails.some((answer) => answer.optionsValues === "True")
    )
  );
  const resetStates = () => {
    setResponses({}); // Clear responses state when drawer is closed
    setChecklistData([]); // Optionally clear checklist data
    setError(null); // Optionally clear errors
    setLoading(false); // Reset loading state
  };
  return (
    <Drawer
      anchor="right"
      open={showDrawer}
      onClose={() => {
        resetStates(); // Call reset states function when drawer is closed
        toggleDrawer(); // Also toggle drawer state
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80vw",
          height: "100%",
          overflow: "hidden" // Prevent scrolling on the drawer itself
        }
      }}
    >
      <div className="offcanvas-body">
        <div className="graybg container-fluid py-1 mb-2 ml-1">
          <div className="row">
            <div className="col-sm-6">
              <h5 className="pgtitle">Checklist Responses</h5>
            </div>

            <div className="col-sm-6 text-end">
              <Tooltip title="Close">
                <Button
                  type="button"
                  className="btn-close"
                  onClick={toggleDrawer}
                  aria-label="Close"
                ></Button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {!isSaveDisabled && (
          <div className="text-end mb-3 mr-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaveDisabled}
            >
              Save
            </Button>
          </div>
        )}
        <div className="container-fluid py-2 graybg mb-2">
          <div className="row align-items-center">
            <div className="col-sm-12">
              <div className="d-flex justify-content-between font-weight-500">
                <label className="">CheckList : {checklistData[0]?.checklistName}</label>
                <label className="">Stage : {checklistData[0]?.stageName}</label>
              </div>
            </div>
          </div>
        </div>
        <div className="content ml-2">
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
              <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #ddd" }}>
                <table className="table table-bordered" style={{ width: "100%" }}>
                  <thead
                    style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}
                  >
                    <tr>
                      <th style={{ width: "5%" }}>Sr.No.</th>
                      <th style={{ width: "15%" }}>CheckList Item</th>
                      <th>Responses</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklistData.map((category, categoryIndex) => (
                      <React.Fragment key={categoryIndex}>
                        <tr>
                          <td className="bgLightGrey2 text-start" colSpan="4">
                            {category.categoryName}
                          </td>
                        </tr>

                        {/* Checklist Items */}
                        {category.listCheckListSectionDetails.map((section, sectionIndex) => (
                          <React.Fragment key={sectionIndex}>
                            {/* Conditionally render only if listAnswerDetails exists */}
                            {section.listAnswerDetails?.length > 0 && (
                              <tr>
                                <td style={{ width: "5%" }}>{sectionIndex + 1}.</td>
                                <td style={{ width: "15%", textAlign: "center" }}>
                                  {section.sectionItemName || "Section Name Missing"}
                                </td>
                                <td>
                                  <div className="row">
                                    {section.listAnswerDetails.map((answer, answerIndex) => (
                                      <div key={answerIndex} className="col-sm-4">
                                        <div className="custom_radio d-inline-block">
                                          <input
                                            id={`radio-${section.sectionItemID}-${answer?.questionnaireOptionID}`}
                                            name={`response-${section.sectionItemID}`}
                                            type="radio"
                                            checked={
                                              responses[section.sectionItemID]?.response ===
                                                answer?.questionnaireOptionID ||
                                              answer.optionsValues === "True" // Check if response matches or if the value is "True"
                                            }
                                            onChange={() =>
                                              handleRadioChange(
                                                section.sectionItemID,
                                                answer?.questionnaireOptionID
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor={`radio-${section.sectionItemID}-${answer?.questionnaireOptionID}`}
                                          >
                                            <span></span>
                                          </label>
                                        </div>
                                        <label
                                          htmlFor={`radio-${section.sectionItemID}-${answer?.questionnaireOptionID}`}
                                        >
                                          {answer?.optionDescription || "No Option Description"}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td>
                                  <textarea
                                    className="form-control"
                                    rows="2"
                                    value={responses[section.sectionItemID]?.comments || ""}
                                    onChange={(e) =>
                                      handleCommentChange(section.sectionItemID, e.target.value)
                                    }
                                  ></textarea>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
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
    </Drawer>
  );
};

export default ChecklistDrawer;
