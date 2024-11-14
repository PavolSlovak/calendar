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
  console.log("updateUserFCM", fcmToken);
  const response = await fetch(VITE_API_URL + "users/update-user-fcm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ fcmToken }),
  });
  if (!response.ok) {
    throw new Error(
      "Error occured while updating user's fcm token.Response not ok."
    );
  }
  return response.json();
}
export async function sendNotif(to: string, title: string, body: string) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    VITE_API_URL + "notifications/send-notification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to, title, body }),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Error occured while sending notification.Response not ok. ${response.text}`
    );
  }
  await storeNotification(to, title, body);
  return response.json();
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
  return response.json();
}
export async function getNotifications() {
  const response = await fetch(
    VITE_API_URL + "notifications/get-notifications",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error occured while getting notifications.Response not ok."
    );
  }
  return response.json();
}
export async function markNotificationAsRead(notificationId: string) {
  console.log("markNotificationAsRead", notificationId);
  const response = await fetch(
    VITE_API_URL + "notifications/mark-notification-as-read",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ notificationId }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error occured while marking notification as read.Response not ok."
    );
  }
}

export async function deleteNotification(notificationId: string) {
  const response = await fetch(
    VITE_API_URL + "notifications/delete-notification",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ notificationId }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error occured while deleting notification.Response not ok."
    );
  }
}

export async function storeInvitation(teamId: string, invitedUserId: string) {
  const response = await fetch(VITE_API_URL + "invitations/store-invitation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ teamId, invitedUserId }),
  });
  if (!response.ok) {
    throw new Error("Error occured while storing invitation.Response not ok.");
  }
}
export async function getInvitations() {
  const response = await fetch(VITE_API_URL + "invitations/get-invitations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error occured while getting invitations.Response not ok.");
  }
  return response.json();
}
export async function acceptInvitation(invitationId: string) {
  const response = await fetch(VITE_API_URL + "invitations/accept-invitation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ invitationId }),
  });
  if (!response.ok) {
    throw new Error(
      "Error occured while accepting invitation.Response not ok."
    );
  }
}
export async function declineInvitation(invitationId: string) {
  const response = await fetch(
    VITE_API_URL + "invitations/decline-invitation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ invitationId }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error occured while declining invitation.Response not ok."
    );
  }
}
