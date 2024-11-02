import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import { Shift, shiftSchema } from "@shared/schemas";
import { useDispatch, useSelector } from "react-redux";
import { editRecurrentShifts } from "../../utils/http";
import { RootState as ReduxRootState } from "../../store";
import {
  setDays,
  setFrequency,
  setIsSubmitting,
  setMonthDays,
  setServerError,
  setSelectedShift,
  setShifts,
  DaysOfWeek,
} from "../../store/shifts-slice";
import InfoBox from "../UI/InfoBox";

interface EditRecurrentShiftModalProps {
  onDone: () => void;
  memberID: string;
  teamID: string;
}
const EditRecurrentShiftModal = ({
  onDone,
  memberID,
  teamID,
}: EditRecurrentShiftModalProps) => {
  console.log("Member Id:", memberID);
  console.log("Team Id:", teamID);
  const dispatch = useDispatch();

  const daysOfWeek = Object.values(DaysOfWeek);

  const {
    shifts,
    monthDays,
    days,
    frequency,
    isSubmitting,
    serverError,
    selectedShift,
    startTime,
    endTime,
  } = useSelector((state: ReduxRootState) => state.shifts);
  /* 

export const shiftSchema = z.object({
  memberID: z.string(), // Change to z.string() as ObjectId is a string in TypeScript
  teamID: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  date: z.date(),
  recurrence: recurrenceSchema.nullable(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  comments: z.array(z.string()).optional(), // Use string array for comment IDs
});
*/
  function handleSubmit(data: Shift) {
    console.log(data);
    /* try {
      dispatch(setIsSubmitting(true));
      dispatch(setServerError(null));
      editRecurrentShifts(data), dispatch(setShifts([...shifts, data]));
      dispatch(setIsSubmitting(false));
      onDone();
      return;
    } catch (error: any) {
      dispatch(setIsSubmitting(false));
      setServerError(error?.message);
      console.error(error);
      return;
    } */
  }

  function handleMonthDayToggle(date: number) {
    dispatch(
      monthDays.includes(date)
        ? setMonthDays(monthDays.filter((d) => d !== date))
        : setMonthDays([...monthDays, date])
    );
  }
  function handleDayToggle(day: DaysOfWeek) {
    dispatch(
      days.includes(day)
        ? setDays(days.filter((d) => d !== day))
        : setDays([...days, day])
    );
  }
  function handleFrequencyToggle(frequency: string) {
    dispatch(setMonthDays([])); // Clear monthDays
    dispatch(setDays([])); // Clear days
    dispatch(setFrequency(frequency));
  }
  useEffect(() => {
    console.log(selectedShift);
  }, [selectedShift]);

  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Edit Redurrent Shifts" handleClose={onDone} />
        {serverError && (
          <InfoBox mode="warning" severity="high">
            {serverError}
          </InfoBox>
        )}
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(
                shiftSchema.parse({
                  memberID,
                  teamID,
                  startTime,
                  endTime,
                  date: new Date(),
                  recurrence: {
                    frequency,
                    days,
                    monthDays,
                    startTime,
                    endTime,
                  },
                  status: "pending",
                })
              );
            }}
          >
            <Form.Group>
              {/* Frequency Selector */}
              <div className="space-y-2">
                <label>Frequency</label>
                <select
                  id="frequency"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleFrequencyToggle(e.target.value)
                  }
                  defaultValue={"weekly"}
                >
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
                {frequency === "weekly" && (
                  <p>Day of the week {selectedShift}</p>
                )}
                {frequency === "monthly" && (
                  <p>Day of the month {selectedShift}</p>
                )}

                <div className="flex gap-4">
                  <Form.Input
                    id={`start-time`}
                    type="time"
                    label="Start Time"
                  />
                  <Form.Input id={`end-time`} type="time" label="End Time" />
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
                  disabled={isSubmitting}
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
