import { CalendarIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";
import { format } from "date-fns";
import { Team } from "../../store/teams-slice";
import ScheduleHeader from "../ScheduleHeader";
import { AnimatePresence, motion } from "framer-motion";
import ScheduleCalendar from "./ScheduleCalendar";

export default function CreateSchedule() {
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MMM-yyyy")
  );

  const handleTeamSelect = (teamId: string) => {
    setActiveTeam(activeTeam === teamId ? null : teamId);
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
  };

  return (
    <div className="flex h-full">
      <Sidebar
        teams={teams}
        activeTeam={activeTeam}
        onTeamSelect={handleTeamSelect}
      />
      <MainContent
        activeTeam={activeTeam}
        selectedDay={selectedDay}
        currentMonth={currentMonth}
        onDaySelect={handleDaySelect}
        onMonthChange={setCurrentMonth}
      />
    </div>
  );
}
type SidebarProps = {
  teams: Team[];
  activeTeam: string | null;
  onTeamSelect: (teamId: string) => void;
};
// Sidebar component
function Sidebar({ teams, activeTeam, onTeamSelect }: SidebarProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const accordeonVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };
  function onCheckboxChange(memberId: string) {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((member) => member !== memberId)
        : [...prev, memberId]
    );
  }
  return (
    <div className="w-1/4 bg-gray-200">
      <h2 className="text-lg font-semibold mb-4">Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <button
              className="text-left text-sm"
              onClick={() => onTeamSelect(team.id)}
            >
              {team.teamName}
            </button>

            <AnimatePresence>
              {activeTeam === team.id && (
                <motion.div
                  className="bg-gray-100  text-sm "
                  initial={"closed"}
                  animate={"open"}
                  exit={"closed"}
                  variants={accordeonVariants}
                >
                  <p>Members:</p>
                  <ul>
                    {team.members.map((member) => (
                      <li key={member.uid} className="flex justify-between p-2">
                        {member.email}
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.uid)}
                          onChange={() => onCheckboxChange(member.uid)}
                        />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
      <button className="mt-4 btn-primary">Create New Team</button>
    </div>
  );
}
type MainContentProps = {
  activeTeam: string | null;
  selectedDay: Date;
  currentMonth: string;
  onDaySelect: (day: Date) => void;
  onMonthChange: (month: string) => void;
};
// Main Content component
function MainContent({
  activeTeam,
  currentMonth,
  onDaySelect,
  onMonthChange,
}: MainContentProps) {
  return (
    <div className="w-3/4 p-4">
      <h2 className="text-lg font-semibold mb-4">Schedule {activeTeam}</h2>
      <ScheduleHeader
        currentMonth={currentMonth}
        onMonthChange={onMonthChange}
      />

      <ScheduleCalendar />
      <div className="flex justify-between items-center">
        <button className="btn-primary">
          <CalendarIcon className="h-5 w-5" />
          New Event
        </button>
      </div>
      {/*  <ScheduleList selectedDay={selectedDay} /> */}
    </div>
  );
}
