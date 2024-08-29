import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Team } from "../../lib/types";
import { User } from "../../lib/types";
import { useDispatch } from "react-redux";
import { teamSlice } from "../../store/teams-slice";
type ScheduleCalendarProps = {
  activeTeam: Team;
};

export default function ScheduleCalendar({
  activeTeam,
}: ScheduleCalendarProps) {
  const [checkedMember, setCheckedMember] = useState<User | null>(null);
  /*   const [updatedTeam, setUpdateTeam] = useState<Team>(activeTeam); */
  const dispatch = useDispatch();
  const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function handleAddShift(day: string) {
    if (!checkedMember) return;
    dispatch(
      teamSlice.actions.updateMemberSchedule({
        teamId: currentTeam.id,
        memberId: checkedMember.uid,
        day,
      })
    );
  }
  return (
    <>
      <MembersAccordion
        team={activeTeam}
        activeTeam={activeTeam}
        setCheckedMember={setCheckedMember}
        checkedMember={checkedMember}
      />
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className={"py-1.5"}>
            <button
              type="button"
              onClick={() => handleAddShift(day)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-100`}
              disabled={!checkedMember}
            >
              <span>
                {day}
                {updatedTeam &&
                  updatedTeam.members.map(
                    (member) =>
                      member.schedule.includes(day) && (
                        <div
                          key={updatedTeam.id}
                          className="w-1 h-1 rounded-full bg-sky-500"
                        ></div>
                      )
                  )}
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
type ColorPickerProps = {
  color: string | null;
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
}
type MembersAccordionProps = {
  team: Team | null;
  activeTeam: Team;
  checkedMember: User | null; // The correct type, but it's not defined
  setCheckedMember: React.Dispatch<React.SetStateAction<User | null>>; // The correct type, but it's not defined
};

function MembersAccordion({
  team,
  activeTeam,
  setCheckedMember, // This is causing the TypeScript issue
  checkedMember,
}: MembersAccordionProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  const accordeonVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };
  function handleCheckMember(member: User) {
    checkedMember?.uid === member.uid
      ? setCheckedMember(null)
      : setCheckedMember(member);
  }
  function handleChangeColor(member: User) {}

  return (
    <>
      <button onClick={() => setAccordionOpen(!accordionOpen)}>Members </button>
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
                <li key={member.uid} className="flex justify-between p-2">
                  {member.email}
                  <ColorPicker
                    color={member.colorStamp}
                    setColor={() => {
                      handleChangeColor(member);
                    }}
                  />
                  <input
                    type="checkbox"
                    checked={checkedMember?.uid === member.uid}
                    onChange={() => handleCheckMember(member)}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
