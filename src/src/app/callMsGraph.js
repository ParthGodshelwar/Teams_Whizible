export async function callMsGraph(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  // Replace with your custom API endpoint
  return fetch(
    "https://pms.whizible.com/APIWithJWTToken/api/UserProfile/Get?emailId=saji@whizible.net",
    options
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching user profile:", error);
    });
}
