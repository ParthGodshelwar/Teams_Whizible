import axios from "axios";

const GetMTimeline = async (year, month) => {
  const accessToken = sessionStorage.getItem("token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;

  // Get today's date
  const today = new Date();
  const years = today.getFullYear();
  const months = today.getMonth() + 1; // Months are zero-based

  try {
    const userProfileResponse = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetCalendarView?empID=${employeeId}&year=${year}&monthNo=${month}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const userProfileData = userProfileResponse.data.data;

    return userProfileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile data");
  }
};

export default GetMTimeline;
