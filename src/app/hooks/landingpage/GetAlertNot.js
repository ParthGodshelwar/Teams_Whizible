import axios from "axios";

const GetAlertNot = async () => {
  const accessToken = sessionStorage.getItem("token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.data?.employeeId;
  try {
    const userProfileResponse = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/LandingDB/GetAttention?empID=${employeeId}`,
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

export default GetAlertNot;
