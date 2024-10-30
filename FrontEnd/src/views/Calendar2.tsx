import { Shift, Team } from "@shared/schemas";
import { format, parse, parseISO, startOfToday } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../store";
import { calendarSlice, setActiveMembers } from "../store/calendar-slice";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../utils/http";
import { setTeams } from "../store/teams-slice";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { CalendarHeader } from "../components/Calendar/CalendarHeader";
import { CalendarBody, classNames } from "../components/Calendar/CalendarBody";
import ErrorBlock from "../components/UI/ErrorBlock";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowCircleRightIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";
import { fetchUserData } from "../utils/http-FS_users";
import { useAuth } from "../store/authContext";
import { AnimatePresence } from "framer-motion";
import EditRecurrentShiftModal from "../components/Calendar/EditRecurrentShiftModal";

export default function Calendar2() {
  let today = startOfToday();
  let [currentMonth, setCurrentMonth] = useState<string>(
    format(today, "MMM-yyyy")
  );
  let [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  let [memberUIDToEdit, setMemberUIDToEdit] = useState<string>("");
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const { selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );

  const teams: Team[] = useSelector(
    (state: ReduxRootState) => state.teams.teams
  );
  const { setSelectedDay } = calendarSlice.actions;
  const { setActiveTeam } = calendarSlice.actions;
  const dispatch = useDispatch();

  function onHandleAddRecurrentShift() {
    console.log("onHandleAddRecurrentShift");
  }

  function openModal(): void {
    setIsEditModalOpen(!isEditModalOpen);
  }

  function closeModal(): void {
    setIsEditModalOpen(false);
  }
  const { status, data, isPending, isError, error } = useQuery({
    queryKey: ["teams", teams], // query key is an array with the query key and the query key object
    queryFn: () => fetchTeams(),
  });

  useEffect(() => {
    if (status === "success" && data) {
      dispatch(setTeams(data));
      dispatch(setActiveTeam(data[0]));
    }
  }, [status, data]);

  let content;

  if (isPending)
    content = (
      <>
        <LoadingIndicator />
        <p>Loading shifts...</p>
      </>
    );
  if (isError) content = <ErrorBlock error={error} />;

  if (data && status === "success") {
    console.log("data", data);
    content = (
      <>
        <TeamPicker />
        <AnimatePresence>
          {isEditModalOpen && (
            <EditRecurrentShiftModal
              onDone={closeModal}
              memberData={memberUIDToEdit}
            />
          )}
        </AnimatePresence>
        <CurrentShiftsOverview
          onModalOpen={openModal}
          onMemberSelect={setMemberUIDToEdit}
        />
        <div className="flex  items-center">
          <button className="btn-submit" onClick={onHandleAddRecurrentShift}>
            Add Recurrent shift
          </button>
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
                setSelectedDay={() => dispatch(setSelectedDay(selectedDay))}
              />
            </div>
            <CommentList />
          </div>
        </div>
      </>
    );
  }
  return <div>{content}</div>;
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
type CurrentShiftsOverviewProps = {
  onModalOpen: () => void;
  onMemberSelect: (uid: string) => void;
};
function CurrentShiftsOverview({
  onModalOpen,
  onMemberSelect,
}: CurrentShiftsOverviewProps) {
  let today = format(startOfToday(), "MMM dd, yyyy");
  const { activeTeam, selectedDay } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  const dispatch = useDispatch();
  const { activeMembers } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  const { currentUser } = useAuth();
  let selectedDayShifts: Shift[] =
    activeTeam?.shifts?.filter(
      (shift) => shift.date === selectedDay,
      "yyyy-MM-dd"
    ) || [];

  /* Fetch team members for active team*/
  const {
    status: membersStatus,
    data: membersData,
    isPending: membersIsPending,
    isError: membersIsError,
    error: membersError,
  } = useQuery({
    queryKey: ["activeTeamMembers", activeTeam],
    queryFn: () =>
      activeTeam?.members && activeTeam?.members.length > 0
        ? Promise.all(
            activeTeam?.members.map((member) =>
              fetchUserData(member.firebaseID)
            )
          )
        : [],
  });
  /* If team members are fetched successfully, update state in Redux  */
  useEffect(() => {
    if (membersStatus === "success" && membersData) {
      const membersWithColorStamp = membersData.map((fsMember) => {
        const colorStamp = activeTeam?.members.find(
          (m) => m.firebaseID === fsMember.uid
        )?.color;
        return {
          fcmToken: fsMember.fcmToken,
          role: fsMember.role,
          timeStamp: fsMember.timeStamp,

          uid: fsMember.uid,
          email: fsMember.email,
          displayName: fsMember.username,
          photoURL: fsMember.photoURL,
          color: colorStamp || "",
        };
      });
      dispatch(setActiveMembers(membersWithColorStamp));
    }
  }, [membersStatus, membersData, dispatch]);

  function handleEditRecurrence(uid: string) {
    onMemberSelect(uid);
    onModalOpen();
  }

  /* Set content */
  let content;

  /* If is pending */
  if (membersIsPending)
    content = (
      <div className="flex flex-col w-full justifye-center align-middle">
        <LoadingIndicator />
        <p>Loading team members...</p>
      </div>
    );
  /* If there is an error */
  if (membersIsError) content = <ErrorBlock error={membersError} />;

  /* If data is fetched successfully:*/
  if (activeMembers) {
    content = (
      <>
        {console.log("activeMembers", activeMembers)}
        {activeMembers.length > 0 ? (
          <ul className="w-1/2">
            {activeMembers.map((m) => (
              <li
                key={m.uid}
                className="flex items-center justify-between text-sm w-full "
              >
                <span
                  style={{ backgroundColor: m.color }}
                  className={`w-3 h-3 rounded-full`}
                />
                <p>{m.displayName}</p>
                {currentUser?.uid === activeTeam?.createdBy && (
                  <button
                    className="btn-submit"
                    onClick={() => handleEditRecurrence(m.uid)}
                  >
                    Edit Recurrence
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No team members</p>
        )}
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
      </>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <h1>{activeTeam?.teamName}</h1>
      <h2>Team Members</h2>
      {content}
    </div>
  );
}

function TeamPicker() {
  /* Redux variables and function */
  const { teams } = useSelector((state: ReduxRootState) => state.teams);
  const { setActiveTeam } = calendarSlice.actions;
  const dispatch = useDispatch();

  const [isTeamsListOpen, setIsTeamListOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsTeamListOpen(!isTeamsListOpen)}
        className={`absolute flex items-center top-[10vh] text-xs z-40 bg-slate-300 p-2 hover:bg-slate-100 ${
          isTeamsListOpen ? "left-1/2" : "left-0"
        }`}
      >
        <ArrowCircleRightIcon className="w-5 h-5" /> Teams
      </button>
      <div
        className={`flex flex-col absolute top-[10vh]  w-1/2 h-[80vh] bg-slate-300 ${
          isTeamsListOpen ? "left-0" : "-left-full"
        }`}
      >
        <ul>
          {teams.map((team: Team) => (
            <li key={team._id}>
              <button
                onClick={() => dispatch(setActiveTeam(team))}
                className="text-left text-sm text-slate-500 w-full  p-5 hover:bg-slate-100"
              >
                {team.teamName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
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
