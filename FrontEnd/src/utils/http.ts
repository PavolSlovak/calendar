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

export async function sendNotif(uid: string, title: string, body: string) {
  console.log("sendNotif", uid, title, body);

  const NotificationPayload = {
    notification: {
      title: title,
      body: body,
    },
    to: uid, // Add the recipient's UID here
  };
  const response = await fetch(
    VITE_API_URL + "notifications/send-notification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(NotificationPayload),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error occured while sending notification.Response not ok."
    );
  }
}
