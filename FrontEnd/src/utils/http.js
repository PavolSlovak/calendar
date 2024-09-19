export const queryClient = new queryClient();

export async function fetchTeams({ userId }) {
  const url = `http://localhost:3000/teams?userId=${userId}`;
  const response = await fetch(url);
  return response.json();
}
