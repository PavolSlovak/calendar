import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";
import ScheduleCalendar from "./ScheduleCalendar";
import { teamSlice } from "../../store/teams-slice";
import { CalendarIcon } from "@heroicons/react/outline";

export default function CreateSchedule() {
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  /* const [activeTeam, setActiveTeam] = useState<Team>(teams[0]); */
  const dispatch = useDispatch();
  const { setActiveTeam } = teamSlice.actions;
  useEffect(() => {
    if (teams.length > 0) {
      dispatch(setActiveTeam(teams[0]));
    }
  }, [teams]);

  return (
    <div className="flex h-full">
      <Sidebar />
      <MainContent />
    </div>
  );
}
// Sidebar component
function Sidebar() {
  const dispatch = useDispatch();
  const { setActiveTeam } = teamSlice.actions;
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  return (
    <div className="w-1/4 bg-gray-200">
      <h2 className="text-lg font-semibold mb-4">Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <button
              className="text-left text-sm"
              onClick={() => dispatch(setActiveTeam(team))}
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
function MainContent() {
  const activeTeam = useSelector(
    (state: ReduxRootState) => state.teams.activeTeam
  );
  return (
    <div className="w-3/4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="flex text-lg font-semibold mb-4 justify-center items-center">
          <CalendarIcon className="h-6 w-6" /> {activeTeam?.teamName}
        </h2>
      </div>
      <ScheduleCalendar />
      <div className="flex justify-between items-center">
        <button className="btn-primary">New Event</button>
      </div>
    </div>
  );
}
