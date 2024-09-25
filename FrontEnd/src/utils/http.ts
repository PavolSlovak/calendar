import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

type FetchError = {
  code?: number;
  info?: string;
};
export async function fetchTeams({ teamId }: { teamId: string }) {
  try {
    const response = await fetch("http://localhost:8080/teams/" + teamId);
    if (!response.ok) {
      const error = new Error("An error occurred while fetching the events");
      (error as FetchError).code = response.status;
      (error as FetchError).info = await response.text();
      throw error;
    }
    const teams = await response.json();
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}
