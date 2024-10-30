import { useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shift, shiftSchema } from "@shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../store/authContext";
import { useDispatch } from "react-redux";
import { addTeam } from "../../store/teams-slice";
import { editRecurrentShifts } from "../../utils/http";

interface EditRecurrentShiftModalProps {
  onDone: () => void;
  memberData: any;
}
const EditRecurrentShiftModal = ({
  onDone,
  memberData,
}: EditRecurrentShiftModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<Shift>({
    resolver: zodResolver(shiftSchema),
  });

  /* 
export const editRecurrentShiftsSchema = z.object({
  teamId: z.string().nonempty(),
  memberId: z.string().nonempty(),
  shifts: z.array(shiftSchema),
  exceptions: z.array(exceptionSchema),
});

const shiftSchema = z.object({
  memberID: z.string(), // Change to z.string() as ObjectId is a string in TypeScript
  startTime: z.string(),
  endTime: z.string(),
  date: z.date(),
  recurrence: recurrenceSchema.nullable(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  comments: z.array(z.string()).optional(), // Use string array for comment IDs
});
const exceptionSchema = z.object({
  date: z.date(),
  newStartTime: z.string().optional(),
  newEndTime: z.string().optional(),
  skip: z.boolean().optional(),
});

const recurrenceSchema = z.object({
  frequency: z.enum(["weekly", "monthly"]),
  days: z
    .array(z.enum(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]))
    .default([]),
  monthDays: z.array(z.number()).default([]),
  exceptions: z.array(exceptionSchema).default([]),
});
*/

  console.log("memberData", memberData);
  const { currentUser } = useAuth();
  const dispatch = useDispatch();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [days, setDays] = useState<string[]>([]);
  const [monthDays, setMonthDays] = useState<number[]>([]);
  const frequency = watch("recurrence.frequency");
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["createTeam"],
    mutationFn: (data: Shift) => editRecurrentShifts(data),
    onSuccess: (data) => {
      dispatch(addTeam(data));
      onDone();
    },
  });

  function onSubmit(data: Shift) {
    mutate(data);
  }

  function handleMonthDayToggle(date: number) {
    setMonthDays((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  }
  function handleDayToggle(day: string) {
    days.includes(day) ? 
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Edit Redurrent Shifts" handleClose={onDone} />
        <p className="text-center"></p>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              {/* Frequency Selector */}
              <div className="space-y-2">
                <label>Recurrence Frequency</label>
                <label>Frequency</label>
                <select id="frequency" {...register("recurrence.frequency")}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Days Selection for Weekly */}
              {frequency === "weekly" && (
                <div className="space-y-2">
                  <label>Select Days of the Week</label>
                  <div className="flex gap-2">
                    {daysOfWeek.map((day) => (
                      <Form.Input
                        id={`day-${day}`}
                        type="checkbox"
                        key={day}
                        label={day}
                        checked={days.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Dates Selection for Monthly */}
              {frequency === "monthly" && (
                <div className="space-y-2">
                  <label>Select Days of the Month</label>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                      <Form.Input
                        id={`month-day-${date}`}
                        type="checkbox"
                        key={date}
                        label={date.toString()}
                        checked={monthDays.includes(date)}
                        onChange={() => handleMonthDayToggle(date)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Shift Timing */}
              <div className="space-y-2">
                <p className="text-xl">Shift Timing</p>
                <div className="flex gap-4">
                  <Form.Input
                    id={`start-time`}
                    type="time"
                    label="Start Time"
                    {...register("startTime")}
                  />
                  <Form.Input
                    id={`end-time`}
                    type="time"
                    label="End Time"
                    {...register("endTime")}
                  />
                </div>
              </div>

              {/* Exceptions */}
              {/*       <div className="space-y-2">
                <label>Exceptions</label>
                <Button onClick={addException}>Add Exception</Button>
                {exceptions.map((exception, index) => (
                  <div key={index} className="flex gap-4 mt-2">
                    <Form.Input
                      id={`exception-date`}
                      type="date"
                      label="Date"
                      value={format(new Date(exception.date), "yyyy-MM-dd")}
                      {...register(`exceptions.${index}.date`)}
                    />
                    <Form.Input
                      id={`exception-start-time`}
                      type="time"
                      label="Start Time"
                      value={exception.newStartTime || startTime}
                      {...register(`exceptions.${index}.newStartTime`)}
                    />
                    <Form.Input
                      id={`exception-end-time`}
                      type="time"
                      label="End Time"
                      value={exception.newEndTime || endTime}
                      {...register(`exceptions.${index}.newEndTime`)}
                    />
                    <Form.Input
                      id={`exception-skip`}
                      label="Skip"
                      type="checkbox"
                      checked={exception.skip || false}
                      {...register(`exceptions.${index}.skip`)}
                    />
                  </div>
                ))}
              </div> */}

              <Form.Footer actionsClassName="flex  gap-2">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isPending}
                >
                  Save
                </button>
              </Form.Footer>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EditRecurrentShiftModal;
