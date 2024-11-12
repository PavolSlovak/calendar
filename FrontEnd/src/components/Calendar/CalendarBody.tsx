import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
} from "date-fns";
import { RootState as ReduxRootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { calendarSlice } from "../../store/calendar-slice";
type CalendarBodyProps = {
  firstDayCurrentMonth: Date;
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
export function CalendarBody({ firstDayCurrentMonth }: CalendarBodyProps) {
  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);
  /* const wSchedule = activeTeam?.weekSchedule; */

  const { selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  const dispatch = useDispatch();

  const { setSelectedDay } = calendarSlice.actions;
  /*  useEffect(() => {
    console.log(selectedDay);
  }); */
  return (
    <div className="grid grid-cols-7 mt-2 text-sm">
      {days.map((day, dayIdx) => {
        const dayString = format(day, "eee");

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
              onClick={() => dispatch(setSelectedDay(day.toISOString()))}
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
              {/* {colorStamps?.map((color, idx) => (
                <div
                  key={idx}
                  className="w-1 h-1 ml-[1px] rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
              ))} */}
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
