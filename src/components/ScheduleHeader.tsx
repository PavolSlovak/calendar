type ScheduleHeaderProps = {
  currentMonth: string;
  onMonthChange: (month: string) => void;
};

function ScheduleHeader({ currentMonth, onMonthChange }: ScheduleHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold">{currentMonth}</h1>
      <div>
        <button onClick={() => onMonthChange("prev")}>Prev</button>
        <button onClick={() => onMonthChange("next")}>Next</button>
      </div>
    </div>
  );
}

export default ScheduleHeader;
