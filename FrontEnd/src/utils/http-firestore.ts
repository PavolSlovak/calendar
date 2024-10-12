import { VITE_API_URL } from "./http";

export async function addUser(fcmToken: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(VITE_API_URL + "users/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fcmToken }),
  });
  if (!response.ok) {
    throw new Error("Error occured while adding user.Response not ok.");
  }
}
export async function updateUserFCM(fcmToken: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(VITE_API_URL + "users/update-user-fcm", {
    method: "POST",
    headers: {
      "Content-Type": "application-json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ fcmToken }),
  });
  if (!response.ok) {
    throw new Error(
      "Error occured while updating user's fcm token.Response not ok."
    );
  }
}
