import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { RootState as ReduxRootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Shifts, Team, User } from "../../lib/types";
import { calendarSlice } from "../../store/calendar-slice";
import { fetchTeams } from "../../utils/http";
import { useAuth } from "../../store/authContext";

const comments = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2024-09-16T13:00",
    endDatetime: "2024-08-17T14:30",
  },
  {
    id: 2,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2024-08-17T09:00",
    endDatetime: "2024-08-17T11:30",
  },
  {
    id: 3,
    name: "Dries Vincent",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-20T17:00",
    endDatetime: "2022-05-20T18:30",
  },
  {
    id: 4,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-06-09T13:00",
    endDatetime: "2022-06-09T14:30",
  },
  {
    id: 5,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-13T14:00",
    endDatetime: "2022-05-13T14:30",
  },
];

type ClassNamesProps = (string | undefined)[];

export function classNames(...classes: ClassNamesProps) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  /* let selectedDayShifts = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  ); */

  // ...................................
  const teams: Team[] = useSelector(
    (state: ReduxRootState) => state.teams.teams
  );
  const dispatch = useDispatch();
  const { setActiveTeam } = calendarSlice.actions;
  const activeTeam = useSelector(
    (state: ReduxRootState) => state.calendar.activeTeam
  );

  const wSchedule = activeTeam?.weekSchedule;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeam: Team | undefined = teams.find(
      (team) => team.id === event.target.value
    );
    selectedTeam && dispatch(setActiveTeam(selectedTeam));
  };
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser) fetchTeams({ teamId: currentUser.uid });
  }, []);

  return (
    <div className="pt-5">
      <CurrentShiftsOverview selectedDay={selectedDay} />

      <div className="flex flex-col items-center">
        <p>
          To view team, please pick a team:
          <select onChange={handleChange}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </p>
      </div>

      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-5 text-xs leading-6 text-center text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
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
                        isEqual(day, selectedDay) && isToday(day)
                          ? "bg-red-500"
                          : "",
                        isEqual(day, selectedDay) && !isToday(day)
                          ? "bg-gray-900"
                          : "",
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
                      {/*   {meetings.some((meeting) =>
                        isSameDay(parseISO(meeting.startDatetime), day)
                      ) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )} */}

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
          </div>
          <section className="mt-12 md:mt-0 md:pl-14">
            <h2 className="font-semibold text-gray-900">
              Schedule for
              <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                {format(selectedDay, "MMM dd, yyy")}
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {comments.length > 0 ? (
                comments.map(
                  (comment) =>
                    format(parseISO(comment.startDatetime), "yyyy-MM-dd") ===
                      format(selectedDay, "yyyy-MM-dd") && (
                      <>
                        <Meeting key={comment.id} meeting={comment} />
                      </>
                    )
                )
              ) : (
                <p>No meetings for today.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
type MeetingProps = {
  meeting: {
    id: number;
    name: string;
    imageUrl: string;
    startDatetime: string;
    endDatetime: string;
  };
};
function Meeting({ meeting }: MeetingProps) {
  let startDateTime = parseISO(meeting.startDatetime);
  let endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, "h:mm a")}
          </time>
          -
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, "h:mm a")}
          </time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

function CurrentShiftsOverview({ selectedDay }: { selectedDay: Date }) {
  const activeTeam = useSelector(
    (state: ReduxRootState) => state.calendar.activeTeam
  );
  let selectedDayShifts: Shifts | undefined = activeTeam?.weekSchedule?.find(
    (schedule) => schedule.day === format(selectedDay, "eee")
  )?.shifts;
  const [users, setUsers] = useState<User[]>([]);

  /*   const todaysShifts = activeTeam?.weekSchedule?.find(
    (schedule) => schedule.day === format(today, "eee")
  )?.shifts; */
  const todaysShifts =
    activeTeam?.weekSchedule?.find(
      (schedule) => schedule.day === format(startOfToday(), "eee")
    )?.shifts || [];
  const scheduledUsersIds = todaysShifts?.map((shift) => shift.memberId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (scheduledUsersIds.length === 0) return console.log("No users");
        /*  const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "in", scheduledUsersIds));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map((doc) => doc.data()); */
        console.log("Jebe", scheduledUsersIds);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, [scheduledUsersIds]);
  let today = format(startOfToday(), "MMM dd, yyyy");

  // TODO - get the user data from the store

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-semibold text-gray-900">Current Shifts {today}</h2>
      {todaysShifts.map((shift) => (
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
      {todaysShifts.length === 0 && <p>No shifts for today.</p>}
    </div>
  );
}
