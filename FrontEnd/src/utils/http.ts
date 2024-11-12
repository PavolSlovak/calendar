import { Shift, TeamUpdate } from "@shared/schemas";
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

type FetchError = {
  code?: number;
  info?: string;
};
export const VITE_API_URL: string = import.meta.env.VITE_API_URL;

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
  /* await new Promise((resolve) => setTimeout(resolve, 1000)); */
  return teams;
}
export async function createTeam(name: string, invitations: string[]) {
  const token = localStorage.getItem("token");
  const response = await fetch(VITE_API_URL + "teams/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, invitations }),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the team");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  console.log(
    `Team created successfully: ${name} with invitations:${invitations}`
  );
  /* await storeInvitation(teamId, userId); */

  return response.json();
}
export async function addRecurrentShift(data: Shift) {
  console.log("data", data);
  const token = localStorage.getItem("token");
  const response = await fetch(VITE_API_URL + "teams/create-shift", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while editing the team");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  console.log(`Shifts edited successfully: ${data}`);
  return response.json();
}

export async function deleteTeam(teamId: string | undefined) {
  const token = localStorage.getItem("token");
  const response = await fetch(VITE_API_URL + `teams/${teamId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the team");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  console.log(`Team deleted successfully: ${teamId}`);
  return response.json();
}
export async function updateTeam(data: TeamUpdate) {
  const { teamId, teamName, members } = data;

  const token = localStorage.getItem("token");
  const response = await fetch(VITE_API_URL + `teams/${teamId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ teamName, members }),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while updating the team");
    (error as FetchError).code = response.status;
    (error as FetchError).info = await response.text();
    throw error;
  }
  console.log(`Team updated successfully: ${teamId}`);
  return response.json();
}
