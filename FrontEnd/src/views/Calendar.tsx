// https://chatgpt.com/share/66fca7dd-04d4-800e-87d1-3ccfae48960c - Calendar UI
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { format, parse, parseISO, startOfToday } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { RootState as ReduxRootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { Shift, Team } from "@shared/schemas";

import { calendarSlice } from "../store/calendar-slice";
import { fetchTeams } from "../utils/http";
import { CalendarBody, classNames } from "../components/Calendar/CalendarBody";
import { useQuery } from "@tanstack/react-query";
import ErrorBlock from "../components/UI/ErrorBlock";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { CalendarHeader } from "../components/Calendar/CalendarHeader";
import { setTeams } from "../store/teams-slice";
import { CurrentShiftsOverview } from "./CurrentShiftsOverview";

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

export default function Calendar() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  /* let selectedDayShifts = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  ); */

  // ...................................
  const teams: Team[] = useSelector(
    (state: ReduxRootState) => state.teams.teams
  );

  const dispatch = useDispatch();
  const { setActiveTeam } = calendarSlice.actions;
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeam: Team | undefined = teams.find(
      (team) => team._id === event.target.value
    );
    selectedTeam && dispatch(setActiveTeam(selectedTeam));
  };

  const { status, data, isPending, isError, error } = useQuery({
    queryKey: ["teams"], // query key is an array with the query key and the query key object
    queryFn: () => fetchTeams(),
  });

  useEffect(() => {
    if (status === "success" && data) {
      dispatch(setTeams(data));
      dispatch(setActiveTeam(data[0]));
    }
  }, [status, data]);

  useEffect(() => {
    console.log("activeTeam", activeTeam);
  }, [activeTeam]);
  let content;

  if (isPending)
    content = (
      <div className="flex flex-col w-full justify-center align-middle">
        <LoadingIndicator />
        <p>Loading shifts...</p>
      </div>
    );
  if (isError) content = <ErrorBlock error={error} />;

  if (data) {
    console.log("data", data);
    content = (
      <>
        <CurrentShiftsOverview />
        <div className="flex flex-col items-center">
          <p>
            To view team, please pick a team:
            <select onChange={handleChange}>
              <>
                {data.map((team: Team) => (
                  <option key={team._id} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
              </>
            </select>
          </p>
        </div>

        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-14">
              <CalendarHeader
                firstDayCurrentMonth={firstDayCurrentMonth}
                setCurrentMonth={setCurrentMonth}
              />
              <CalendarBody
                firstDayCurrentMonth={firstDayCurrentMonth}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />
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
      </>
    );
  }
  return <div className="pt-5">{content}</div>;
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
