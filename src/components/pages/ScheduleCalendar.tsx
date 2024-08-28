import { useState } from "react";

export default function ScheduleCalendar() {
  const [selectedDay, setSelectedDay] = useState<string>();
  const days: string[] = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <>
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className={"py-1.5"}>
            <button
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200`}
              /*    isEqual(day, selectedDay) ? "text-white" : "",
                
                
              
                !isEqual(day, selectedDay) ? "hover:bg-gray-200" : "",
                isEqual(day, selectedDay) || isToday(day)
                  ? "font-semibold"
                  : "",
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
              } */
            >
              {day}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
