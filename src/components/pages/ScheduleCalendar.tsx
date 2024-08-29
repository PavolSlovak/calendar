import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Team } from "../../lib/types";
import { User } from "../../lib/types";
type ScheduleCalendarProps = {
  activeTeam: Team;
};

export default function ScheduleCalendar({
  activeTeam,
}: ScheduleCalendarProps) {
  const [checkedMember, setCheckedMember] = useState<User | null>(null);
  const [updatedTeam, setUpdateTeam] = useState<Team>(activeTeam);
  const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  useEffect(() => {
    console.log("updatedTeam", updatedTeam);
  });

  function handleAddShift(day: string) {
    if (!checkedMember) return;

    setUpdateTeam((prev) => {
      const updatedMembers = prev.members.map((member) => {
        if (member.uid === checkedMember.uid) {
          return {
            ...member,
            schedule: [...member.schedule, day],
          };
        }
        return member;
      });
      return {
        ...prev,
        members: updatedMembers,
      };
    });
  }
  return (
    <>
      <MembersAccordion
        team={activeTeam}
        setCheckedMember={setCheckedMember}
        checkedMember={checkedMember}
      />
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className={"py-1.5"}>
            <button
              type="button"
              onClick={() => handleAddShift(day)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200`}
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

type MembersAccordionProps = {
  team: Team | null;
  checkedMember: User | null; // The correct type, but it's not defined
  setCheckedMember: React.Dispatch<React.SetStateAction<User | null>>; // The correct type, but it's not defined
};

function MembersAccordion({
  team,
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
