import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";
import { Team } from "../../store/teams-slice";
import ScheduleHeader from "../ScheduleHeader";
import ScheduleCalendar from "./ScheduleCalendar";
import { SidebarProps } from "../../lib/types";

export default function CreateSchedule() {
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  const [activeTeam, setActiveTeam] = useState<Team>(teams[0]);

  const handleTeamSelect = (team: Team) => {
    setActiveTeam((prev) => (prev?.id === team.id ? teams[0] : team));
  };

  return (
    <div className="flex h-full">
      <Sidebar
        teams={teams}
        activeTeam={activeTeam}
        onTeamSelect={handleTeamSelect}
      />
      <MainContent activeTeam={activeTeam} />
    </div>
  );
}
// Sidebar component
function Sidebar({ teams, onTeamSelect }: SidebarProps) {
  return (
    <div className="w-1/4 bg-gray-200">
      <h2 className="text-lg font-semibold mb-4">Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <button
              className="text-left text-sm"
              onClick={() => onTeamSelect(team)}
            >
              {team.teamName}
            </button>
          </li>
        ))}
      </ul>
      <button className="mt-4 btn-primary">Create New Team</button>
    </div>
  );
}

// Main Content component
function MainContent({ activeTeam }: { activeTeam: Team }) {
  return (
    <div className="w-3/4 p-4">
      <ScheduleHeader teamName={activeTeam?.teamName} />

      <ScheduleCalendar activeTeam={activeTeam} />
      <div className="flex justify-between items-center">
        <button className="btn-primary">New Event</button>
      </div>
    </div>
  );
}
