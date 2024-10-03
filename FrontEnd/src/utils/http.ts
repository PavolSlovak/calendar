import { QueryClient } from "@tanstack/react-query";
import { MessagePayload } from "firebase/messaging";
export const queryClient = new QueryClient();

type FetchError = {
  code?: number;
  info?: string;
};
const VITE_API_URL: string = import.meta.env.VITE_API_URL;

export async function fetchTeams() {
  const token = localStorage.getItem("token");
  console.log("url", VITE_API_URL + "teams");
  const response = await fetch(VITE_API_URL + "teams", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the teams ");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  const teams = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 4000));

  return teams;
}
type TAdditionaUserData = {
  firebaseUID: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
};

export async function signupUser(additionalUserData: TAdditionaUserData) {
  // Save additional user data to MongoDB
  const response = await fetch(VITE_API_URL + "users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(additionalUserData),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while signing up the user");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  console.log("Additional user data saved successfully", additionalUserData);
  const user = await response.json();
  return user;
}
export async function sendFcmTokenToBackend(fcmToken: string) {
  // Send the FCM token to the backend
  const response = await fetch(VITE_API_URL + "store-fcm-token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fcmToken }),
  });
  if (!response.ok) {
    const error = new Error("An error occurred while sending the FCM token");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  console.log("FCM token sent successfully", fcmToken);
  return fcmToken;
}
