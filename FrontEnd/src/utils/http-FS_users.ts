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
    throw new Error("Error occured while fetching user by email.");
  }
  return response.json();
};
