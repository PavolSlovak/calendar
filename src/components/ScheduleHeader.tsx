import { CalendarIcon } from "@heroicons/react/outline";
type ScheduleHeaderProps = {
  teamName: string | undefined;
};
function ScheduleHeader({ teamName }: ScheduleHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="flex text-lg font-semibold mb-4 justify-center items-center">
        <CalendarIcon className="h-6 w-6" /> {teamName}
      </h2>
    </div>
  );
}

export default ScheduleHeader;
