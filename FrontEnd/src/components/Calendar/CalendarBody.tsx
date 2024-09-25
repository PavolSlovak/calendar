import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
} from "date-fns";
import { Team } from "../../lib/types";
import { RootState as ReduxRootState } from "../../store";
import { useSelector } from "react-redux";
type CalendarBodyProps = {
  firstDayCurrentMonth: Date;
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
};

export const colStartClasses = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
export function CalendarBody({
  firstDayCurrentMonth,
  selectedDay,
  setSelectedDay,
}: CalendarBodyProps) {
  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);
  const wSchedule = activeTeam?.weekSchedule;
  return (
    <div className="grid grid-cols-7 mt-2 text-sm">
      {days.map((day, dayIdx) => {
        const dayString = format(day, "eee");
        const dayObject = wSchedule?.find(
          (schedule) => schedule.day === dayString
        );
        const shiftsForDay = dayObject?.shifts;
        const colorStamps = shiftsForDay?.map((shift) => {
          const member = activeTeam?.members.find(
            (member) => member.uid === shift.memberId
          );
          return member?.color;
        });
        return (
          <div
            key={day.toString()}
            className={classNames(
              dayIdx === 0 ? colStartClasses[getDay(day)] : "", // add shft based on day index
              "py-1.5"
            )}
          >
            <button
              type="button"
              onClick={() => setSelectedDay(day)}
              className={classNames(
                isEqual(day, selectedDay) ? "text-white" : "",
                !isEqual(day, selectedDay) && isToday(day)
                  ? "text-red-500"
                  : "",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth)
                  ? "text-gray-900"
                  : "",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth)
                  ? "text-gray-400"
                  : "",
                isEqual(day, selectedDay) && isToday(day) ? "bg-red-500" : "",
                isEqual(day, selectedDay) && !isToday(day) ? "bg-gray-900" : "",
                !isEqual(day, selectedDay) ? "hover:bg-gray-200" : "",
                isEqual(day, selectedDay) || isToday(day)
                  ? "font-semibold"
                  : "",
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
              )}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </button>

            <div className="flex justify-center">
              {colorStamps?.map((color, idx) => (
                <div
                  key={idx}
                  className="w-1 h-1 ml-[1px] rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
type ClassNamesProps = (string | undefined)[];

export function classNames(...classes: ClassNamesProps) {
  return classes.filter(Boolean).join(" ");
}
