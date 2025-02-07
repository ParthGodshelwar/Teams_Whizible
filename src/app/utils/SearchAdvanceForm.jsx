import React, { useState, useEffect } from "react";
import { Label, Dropdown, TextField, Stack, DefaultButton, DatePicker } from "@fluentui/react";

const SearchAdvanceForm = ({ onClose, searchFilters, onSearch }) => {
  const initialState = {
    initiativeCode: "",
    initiativeFrom: null,
    initiativeTo: null,
    lastAction: "",
    submittedBy: "",
    natureOfInitiative: "",
    selectStage: "",
    vendor: "",
    priority: "",
    initiativeCategory: "",
    businessGroup: "",
    organizationUnit: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [filteredLocations, setFilteredLocations] = useState(
    searchFilters?.initiativeLocationFilter || []
  );

  useEffect(() => {
    if (formValues.businessGroup) {
      const selectedGroup = searchFilters?.initiativeBusinessGroupFilter.find(
        (group) => group.businessGroupID === formValues.businessGroup
      );
      setFilteredLocations(selectedGroup ? selectedGroup?.initiativeLocationFilter : []);
    } else {
      setFilteredLocations(searchFilters?.initiativeLocationFilter);
    }
  }, [
    formValues?.businessGroup,
    searchFilters?.initiativeLocationFilter,
    searchFilters?.initiativeBusinessGroupFilter
  ]);

  const handleInputChange = (e, option) => {
    const { id } = e.target;
    const value = option ? option.key : e.target.value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };

  const handleDateChange = (date, id) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: date
    }));
  };

  const handleClearSearch = () => {
    setFormValues(initialState);
    setFilteredLocations(searchFilters?.initiativeLocationFilter);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(formValues);
    }
  };

  const fieldStyle = {
    width: "100%",
    minHeight: "36px"
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px"
    }
  };

  const alignRight = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px",
      alignSelf: "flex-end"
    }
  };

  const alignCenter = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px",
      alignSelf: "center"
    }
  };

  return (
    <div className="above-form-container">
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="initiativeCode">Initiative Code</Label>
            <TextField
              id="initiativeCode"
              placeholder="Enter Initiative Code"
              value={formValues.initiativeCode}
              onChange={handleInputChange}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="initiativeFrom">Initiative From</Label>
            <DatePicker
              id="initiativeFrom"
              placeholder="Select Start Date"
              ariaLabel="Select Start Date"
              value={formValues.initiativeFrom}
              onSelectDate={(date) => handleDateChange(date, "initiativeFrom")}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="initiativeTo">Initiative To</Label>
            <DatePicker
              id="initiativeTo"
              placeholder="Select End Date"
              ariaLabel="Select End Date"
              value={formValues.initiativeTo}
              onSelectDate={(date) => handleDateChange(date, "initiativeTo")}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="lastAction">Last Action</Label>
            <Dropdown
              id="lastAction"
              placeholder="Select Last Action"
              options={
                searchFilters?.initiativeActionFilter?.map((action) => ({
                  key: action.actioID,
                  text: action.actionName
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.lastAction}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="submittedBy">Submitted By</Label>
            <Dropdown
              id="submittedBy"
              placeholder="Select Submitted By"
              options={
                searchFilters?.initiativeSubmittedFilter?.map((submitter) => ({
                  key: submitter.employeeID,
                  text: submitter.submittedBy
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.submittedBy}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="natureOfInitiative">Nature of Initiative</Label>
            <Dropdown
              id="natureOfInitiative"
              placeholder="Select Nature of Initiative"
              options={
                searchFilters?.initiativeNOIFilter?.map((nature) => ({
                  key: nature.natureofDemandID,
                  text: nature.natureofDemand
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.natureOfInitiative}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="selectStage">Select Stage</Label>
            <Dropdown
              id="selectStage"
              placeholder="Select Stage"
              options={
                searchFilters?.initiativeRequestStageFilter?.map((stage) => ({
                  key: stage.requestStageID,
                  text: stage.requestStage
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.selectStage}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="vendor">Vendor</Label>
            <Dropdown
              id="vendor"
              placeholder="Select Vendor"
              options={
                searchFilters?.initiativeVendorFilter?.map((vendor) => ({
                  key: vendor.vendorID,
                  text: vendor.vendorNameAbbr
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.vendor}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="priority">Priority</Label>
            <Dropdown
              id="priority"
              placeholder="Select Priority"
              options={
                searchFilters?.initiativePriorityFilter?.map((priority) => ({
                  key: priority.priorityID,
                  text: priority.priority
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.priority}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="initiativeCategory">Initiative Category</Label>
            <Dropdown
              id="initiativeCategory"
              placeholder="Select Initiative Category"
              options={
                searchFilters?.initiativeRequestTypeFilter?.map((category) => ({
                  key: category.requestTypeID,
                  text: category.requestType
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.initiativeCategory}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="businessGroup">Business Group</Label>
            <Dropdown
              id="businessGroup"
              placeholder="Select Business Group"
              options={
                searchFilters?.initiativeBusinessGroupFilter?.map((group) => ({
                  key: group.businessGroupID,
                  text: group.businessGroup
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.businessGroup}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="organizationUnit">Organization Unit</Label>
            <Dropdown
              id="organizationUnit"
              placeholder="Select Organization Unit"
              options={
                filteredLocations?.map((unit) => ({
                  key: unit.locationID,
                  text: unit.location
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.organizationUnit}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="end">
          <DefaultButton text="Clear Search" onClick={handleClearSearch} />
          <DefaultButton text="Save and Search" onClick={handleSearchClick} />
        </Stack>
      </Stack>
    </div>
  );
};

export default SearchAdvanceForm;
