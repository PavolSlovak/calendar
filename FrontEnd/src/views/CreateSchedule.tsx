import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../store";
import { teamSlice } from "../store/teams-slice";
import { CalendarIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { AnimatePresence, motion } from "framer-motion";
import { scheduleSlice } from "../store/shifts-slice";
import { Member } from "@shared/schemas.js";

export default function CreateSchedule() {
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  /* const [activeTeam, setActiveTeam] = useState<Team>(teams[0]); */
  const dispatch = useDispatch();
  const { setActiveTeam } = scheduleSlice.actions;
  useEffect(() => {
    if (teams.length > 0) {
      dispatch(setActiveTeam(teams[0]));
    } else {
      dispatch(setActiveTeam(null));
    }
  }, [teams]);

  const activeTeam = useSelector(
    (state: ReduxRootState) => state.schedule.activeTeam
  );
  useEffect(() => {
    console.log("activeTeam", activeTeam);
  }, [activeTeam]);
  return (
    <>
      <Sidebar />
      <div className="w-3/4 p-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="flex text-lg font-semibold mb-4 justify-center items-center">
            <CalendarIcon className="h-6 w-6" /> {activeTeam?.teamName}
          </h2>
        </div>
        <Schedule />
      </div>
    </>
  );
}
// Sidebar component
function Sidebar() {
  const dispatch = useDispatch();
  const { setActiveTeam } = scheduleSlice.actions;
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  return (
    <div className="w-1/4 bg-gray-200 ">
      <h2 className="text-lg font-semibold mb-4">Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team._id}>
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

function Schedule() {
  const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <p>
        Expand "Members" dropdown menu, choose the team's member to edit his
        schedule:
      </p>
      <MembersAccordion />
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <Day key={day} day={day} dayIdx={dayIdx} />
        ))}
      </div>
    </>
  );
}

function Day({ day, dayIdx }: { day: string; dayIdx: number }) {
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");

  const activeTeam = useSelector(
    (state: ReduxRootState) => state.schedule.activeTeam
  );
  const checkedMember = useSelector(
    (state: ReduxRootState) => state.schedule.checkedMember
  );
  const dispatch = useDispatch();
  const { addToSchedule, updateSchedule } = teamSlice.actions;

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 200, // Higher value = stiffer spring, more bounce
        damping: 10, // Lower value = less damping, more bounce
      },
    }),
  };

  function handleAddShift(day: string) {
    if (!checkedMember || !activeTeam) return;
    dispatch(
      addToSchedule({
        teamId: activeTeam._id,
        memberId: checkedMember.uid,
        day,
        startTime: startTime,
        endTime: endTime,
      })
    );
  }
  useEffect(() => {
    if (!checkedMember || !activeTeam) return;
    dispatch(
      updateSchedule({
        teamId: activeTeam._id,
        memberId: checkedMember.uid,
        day,
        startTime: startTime,
        endTime: endTime,
      })
    );
  }, [startTime, endTime]);
  return (
    <motion.div
      key={dayIdx}
      className="py-1.5"
      initial="initial"
      animate="animate"
      variants={fadeInAnimationVariants}
      whileInView="animate"
      viewport={{ once: true }}
      custom={dayIdx}
    >
      <button
        type="button"
        onClick={() => handleAddShift(day)}
        className="mx-auto flex h-8 w-8 sm:p-8 p-4 items-center justify-center rounded-full bg-slate-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-100"
        style={
          (checkedMember &&
            activeTeam?.weekSchedule
              .find((weekDay) => weekDay.day === day)
              ?.shifts.some(
                (shift) => shift.memberId === checkedMember.uid
              ) && {
              border: `2px solid ${checkedMember.color}`,
            }) ||
          {}
        }
        disabled={!checkedMember}
      >
        <span>{day}</span>
      </button>
      <div className="flex justify-center">
        {activeTeam?.weekSchedule
          .find((weekDay) => weekDay.day === day)
          ?.shifts.map((shift) => {
            const member = activeTeam?.members.find(
              (member) => member.uid === shift.memberId
            );
            return (
              <span
                key={shift.memberId}
                className="flex w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{
                  backgroundColor: member?.color, // Correctly apply the member's color
                }}
              ></span>
            );
          })}
      </div>
      <div>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
    </motion.div>
  );
}

function MembersAccordion() {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const team = useSelector(
    (state: ReduxRootState) => state.schedule.activeTeam
  );

  const checkedMember = useSelector(
    (state: ReduxRootState) => state.schedule.checkedMember
  );
  const dispatch = useDispatch();
  const { setCheckedMember } = scheduleSlice.actions;

  const accordeonVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  function handleCheckedMember(member: Member) {
    if (checkedMember?.uid === member.uid) {
      dispatch(setCheckedMember(null));
    } else {
      dispatch(setCheckedMember(member));
    }
  }

  return (
    <>
      <button
        className="flex items-center"
        onClick={() => setAccordionOpen(!accordionOpen)}
      >
        Members
        <span>
          <ChevronLeftIcon className="w-4 h-4 " />
        </span>
      </button>

      <AnimatePresence>
        {accordionOpen && (
          <motion.div
            className="bg-gray-100  text-sm "
            initial={"closed"}
            animate={"open"}
            exit={"closed"}
            variants={accordeonVariants}
          >
            <ul>
              {team?.members.map((member) => (
                <li
                  key={member.uid}
                  className="flex justify-between items-center mx-4"
                >
                  <div className="flex items-center p-4">
                    <input
                      className="mr-2"
                      type="checkbox"
                      checked={checkedMember?.uid === member.uid}
                      onChange={() => handleCheckedMember(member)}
                    />
                    {member.email}
                    <span
                      className="w-3 h-3 rounded-full ml-2"
                      style={{ backgroundColor: member.color }}
                    ></span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
