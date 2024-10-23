import { Shift, Team } from "@shared/schemas";
import { format, parse, parseISO, startOfToday } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../store";
import { calendarSlice } from "../store/calendar-slice";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../utils/http";
import { setTeams } from "../store/teams-slice";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { CalendarHeader } from "../components/Calendar/CalendarHeader";
import { CalendarBody, classNames } from "../components/Calendar/CalendarBody";
import ErrorBlock from "../components/UI/ErrorBlock";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";

export default function Calendar2() {
  let today = startOfToday();
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const { selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);

  const teams: Team[] = useSelector(
    (state: ReduxRootState) => state.teams.teams
  );
  const { setSelectedDay } = calendarSlice.actions;
  const { setActiveTeam } = calendarSlice.actions;
  const dispatch = useDispatch();

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
        <TeamPicker data={data} />
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
                setSelectedDay={() => dispatch(setSelectedDay(selectedDay))}
              />
            </div>
            <CommentList />
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
function CurrentShiftsOverview() {
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
        {activeTeamMembers?.map((member, index) => (
          <li key={index}>{member.firebaseID}</li>
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
function TeamPicker({ data }: { data: Team[] }) {
  const { teams } = useSelector((state: ReduxRootState) => state.teams);
  const { setActiveTeam } = calendarSlice.actions;
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeam: Team | undefined = teams.find(
      (team) => team._id === event.target.value
    );
    selectedTeam && dispatch(setActiveTeam(selectedTeam));
  };
  return (
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
  );
}
function CommentList() {
  const { selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  return (
    <section className="mt-12 md:mt-0 md:pl-14">
      <h2 className="font-semibold text-gray-900">
        Schedule for
        <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
          {format(selectedDay, "MMM dd, yyy")}
        </time>
      </h2>
      {/* <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
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
              </ol> */}
    </section>
  );
}
