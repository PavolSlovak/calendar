import { useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { MemberSchema } from "../../lib/types";
import { useDispatch, useSelector } from "react-redux";
import { teamSlice } from "../../store/teams-slice";
import { RootState as ReduxRootState } from "../../store";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { de } from "date-fns/locale";
export default function ScheduleCalendar() {
  const activeTeam = useSelector(
    (state: ReduxRootState) => state.teams.activeTeam
  );
  const dispatch = useDispatch();
  const { updateTeamSchedule } = teamSlice.actions;
  const checkedMember = useSelector(
    (state: ReduxRootState) => state.teams.checkedMember
  );
  const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function handleAddShift(day: string) {
    if (!checkedMember || !activeTeam) return;
    console.log("add shift", day);
    dispatch(
      updateTeamSchedule({
        teamId: activeTeam.id,
        memberId: checkedMember.uid,
        day,
      })
    );
  }
  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        type: "spring",
        stiffness: 200, // Higher value = stiffer spring, more bounce      damping: 10, // Lower value = less damping, more bounce
      },
    }),
  };

  return (
    <>
      <MembersAccordion />
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <motion.div
            key={dayIdx}
            className={"py-1.5"}
            initial={"initial"}
            animate={"animate"}
            variants={fadeInAnimationVariants}
            whileInView={"animate"}
            viewport={{ once: true }}
            custom={dayIdx}
          >
            <button
              type="button"
              onClick={() => handleAddShift(day)}
              className={`mx-auto flex h-8 w-8 sm:p-8 p-4 items-center justify-center rounded-full bg-slate-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-100`}
              style={
                (checkedMember &&
                  activeTeam?.weekSchedule
                    .find((weekDay) => weekDay.day === day)
                    ?.shifts.includes(checkedMember?.uid) && {
                    border: `2px solid ${checkedMember?.color}`,
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
                ?.shifts.map((shift) => (
                  <span
                    key={shift}
                    className="flex w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: activeTeam?.members.find(
                        (member) => member.uid === shift
                      )?.color,
                    }}
                  ></span>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function MembersAccordion() {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const team = useSelector((state: ReduxRootState) => state.teams.activeTeam);

  const checkedMember = useSelector(
    (state: ReduxRootState) => state.teams.checkedMember
  );
  const dispatch = useDispatch();
  const { updateMemberColor, setCheckedMember } = teamSlice.actions;

  const accordeonVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  function handleColorChange(
    e: React.ChangeEvent<HTMLInputElement>,
    member: MemberSchema
  ) {
    dispatch(
      updateMemberColor({ memberId: member.uid, color: e.target.value })
    );

    checkedMember &&
      dispatch(setCheckedMember({ ...checkedMember, color: e.target.value }));
  }
  function handleCheckedMember(member: MemberSchema) {
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
                  <div className="flex justify-center p-4">
                    <input
                      className="mr-2"
                      type="checkbox"
                      checked={checkedMember?.uid === member.uid}
                      onChange={() => handleCheckedMember(member)}
                    />
                    {member.email}
                  </div>

                  {checkedMember?.uid === member.uid && (
                    <input
                      className="w-8"
                      type="color"
                      value={member.color}
                      onChange={(e) => handleColorChange(e, member)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
