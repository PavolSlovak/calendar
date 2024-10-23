import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../store";
import { format, startOfToday } from "date-fns";
import { Shift } from "@shared/schemas";

export function CurrentShiftsOverview() {
  const { activeTeam, selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  const activeTeamMembers = activeTeam?.members;
  console.log("activeTeamMembers", activeTeamMembers);

  let selectedDayShifts: Shift[] = activeTeam?.shifts || [];

  /*   const todaysShifts = activeTeam?.weekSchedule?.find(
      (schedule) => schedule.day === format(today, "eee")
    )?.shifts; */

  let today = format(startOfToday(), "MMM dd, yyyy");
  console.log(
    "activeTeam",
    activeTeam?.members.map((member) => member.firebaseID)
  );
  // TODO - get the user data from the store

  return (
    <div className="flex flex-col items-center">
      <h2>Team Members</h2>
      <ul>
        {activeTeamMembers?.map((member) => (
          <li key={member.memberID}>{member.firebaseID}</li>
        ))}
      </ul>
      <h2 className="font-semibold text-gray-900">Current Shifts {today}</h2>
      {selectedDayShifts.length === 0 ? (
        <p>No shifts for today.</p>
      ) : (
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          {selectedDayShifts.map((shift) => (
            <li
              key={shift.memberID}
              className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100"
            >
              <div>
                <p>{shift.memberID}</p>
                <p>
                  {shift.startTime} - {shift.endTime}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
