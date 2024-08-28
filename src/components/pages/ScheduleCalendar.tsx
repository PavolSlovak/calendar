import { useState } from "react";
import { Team } from "../../store/teams-slice";

import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../dummy_users";
type ScheduleCalendarProps = {
  activeTeam: Team | null;
};

export default function ScheduleCalendar({
  activeTeam,
}: ScheduleCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<string>();
  const [checkedMember, setCheckedMember] = useState<string | null>();
  const days: string[] = ["S", "M", "T", "W", "T", "F", "S"];
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
              {day}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

type MembersAccordionProps = {
  team: Team | null;
  checkedMember: (uid: string | null) => void; // Updated type here
  setcheckedmember: React.Dispatch<React.SetStateAction<string | null>>; // The correct type, but it's not defined
};

function MembersAccordion({
  team,
  setcheckedmember,
  checkedMember,
}: MembersAccordionProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  const accordeonVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };
  function handleCheckMember(uid: string) {
    setcheckedmember((prev) => (prev === uid ? null : uid));
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
                    checked={checkedMember === member.uid}
                    onChange={() => handleCheckMember(member.uid)}
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
