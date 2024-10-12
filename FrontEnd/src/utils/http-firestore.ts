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
  await storeNotification(uid, title, body);
}
export async function storeNotification(
  to: string,
  title: string,
  body: string
) {
  const response = await fetch(
    VITE_API_URL + "notifications/store-notification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ to, title, body }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error occured while storing notification.Response not ok."
    );
  }
}
