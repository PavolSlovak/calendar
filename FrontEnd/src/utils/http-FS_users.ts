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
  return response.json();
};
