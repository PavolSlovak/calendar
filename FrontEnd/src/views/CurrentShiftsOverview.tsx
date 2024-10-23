import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../store";
import { format, startOfToday } from "date-fns";
import { Shift } from "@shared/schemas";

export function CurrentShiftsOverview() {
  const { activeTeam, selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );

  let selectedDayShifts: Shift | undefined = activeTeam?.shifts?.find(
    (shift) => shift.date === selectedDay
  );

  /*   const todaysShifts = activeTeam?.weekSchedule?.find(
      (schedule) => schedule.day === format(today, "eee")
    )?.shifts; */

  let scheduledUsersIds;
  console;

  let today = format(startOfToday(), "MMM dd, yyyy");
  console.log(
    "activeTeam",
    activeTeam?.members.map((member) => member.firebaseID)
  );
  // TODO - get the user data from the store

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-semibold text-gray-900">Current Shifts {today}</h2>
      {/*     {todaysShifts.map((shift) => (
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          <li
            key={shift.memberId}
            className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100"
          >
            <>
              {todaysShifts.map((shift) => (
                <div key={shift.memberId}>
                  <p>{shift.memberId}</p>
                  <p>
                    {shift.startTime} - {shift.endTime}
                  </p>
                </div>
              ))}
            </>
          </li>
        </ol>
      ))}
      {todaysShifts.length === 0 && <p>No shifts for today.</p>} */}
    </div>
  );
}
