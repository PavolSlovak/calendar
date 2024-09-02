import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberSchema, User } from "../../lib/types";
import { useDispatch, useSelector } from "react-redux";
import { teamSlice } from "../../store/teams-slice";
import { RootState as ReduxRootState } from "../../store";
import { ChevronLeftIcon } from "@heroicons/react/outline";
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

  useEffect(() => {
    if (activeTeam) {
      console.log("activeTeam", activeTeam);
    }
  }, [activeTeam]);
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
  return (
    <>
      <MembersAccordion />
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className={"py-1.5"}>
            <button
              type="button"
              onClick={() => handleAddShift(day)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-100 p-8`}
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
            <span>
              {activeTeam?.members.map(
                (member) =>
                  activeTeam?.weekSchedule
                    .find((weekDay) => weekDay.day === day)
                    ?.shifts.includes(member.uid) && (
                    <span
                      key={member.uid}
                      className="block"
                      style={{ color: member.color }}
                    >
                      {member.email}
                    </span>
                  )
              )}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
/* type ColorPickerProps = {
  color: string | number | readonly string[] | undefined;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};
function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <div className="flex items-center">
      <label className="mr-2">Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
} */

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
  function handleCheckMember(member: MemberSchema) {
    checkedMember?.uid === member.uid
      ? dispatch(setCheckedMember(null))
      : dispatch(setCheckedMember(member));
  }
  function handleChangeColor(color: string) {
    dispatch(updateMemberColor(color));
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
                      onChange={() => handleCheckMember(member)}
                    />
                    {member.email}
                  </div>

                  {checkedMember && (
                    <input
                      className="w-8"
                      type="color"
                      value={member.color}
                      onChange={(e) => handleChangeColor(e.target.value)}
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
