import { Member } from "@shared/schemas";
import { VITE_API_URL } from "./http";

export const fetchUserByEmail = async (email: string) => {
  const response = await fetch(
    VITE_API_URL + `users/get-user-by-email/${email}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export async function fetchUserData(member: Member) {
  const [authUserData, additionalUserData] = await Promise.all([
    fetchUserByUID(member.firebaseID),
    fetchAdditionalUserData(member.firebaseID),
  ]);
  return { ...authUserData, ...additionalUserData, color: member.color };
}
// Fetch Multiple Users Data
export async function fetchUsersData(members: Member[] | undefined) {
  if (!members) return [];
  const userData = await Promise.all(members.map((m) => fetchUserData(m)));

  return userData;
}
export const fetchUserByUID = async (uid: string) => {
  const response = await fetch(VITE_API_URL + `users/get-user-by-uid/${uid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return response.json();
};
export const fetchAdditionalUserData = async (uid: string) => {
  const response = await fetch(VITE_API_URL + `users/get-fs-data/${uid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};
