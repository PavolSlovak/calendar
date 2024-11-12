import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import { Shift, shiftSchema } from "@shared/schemas";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";
import {
  DaysOfWeek,
  resetShiftSlaceState,
  setDays,
  setFrequency,
  setIsEndDateSet,
  setMonthDays,
  shiftSlice,
} from "../../store/shifts-slice";
import InfoBox from "../UI/InfoBox";
import { addRecurrentShift, queryClient } from "../../utils/http";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "../../store/hooks/getErrorMessage";

interface EditRecurrentShiftModalProps {
  onDone: () => void;
  memberID: string;
  teamID: string;
}
const EditRecurrentShiftModal = ({
  onDone,
  memberID,
}: EditRecurrentShiftModalProps) => {
  const dispatch = useDispatch();
  const daysOfWeek = Object.values(DaysOfWeek);
  const { shift, isEndDateSet, isExceptionSet, frequency } = useSelector(
    (state: ReduxRootState) => state.shifts
  );
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);

  console.log("team id", activeTeam?._id);
  const { mutate, isPending } = useMutation({
    mutationKey: ["addRecurrentShift"],
    mutationFn: (data: Shift) => addRecurrentShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shifts", activeTeam?._id, memberID],
      });
      onDone();
    },
    onError: (error) => {
      console.log(error);
      setError("root", {
        type: "manual",
        message: error.message || "Server Error Occurred",
      });
    },
  });

  // Set up useForm with zod schema and resolver
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    setError,
    reset,
  } = useForm<Shift>({
    resolver: zodResolver(shiftSchema),
    defaultValues: shift,
  });

  async function handleSave(data: Shift) {
    try {
      await mutate({
        ...data,
        memberID,
        teamID: activeTeam?._id || "", // Default team ID
      });
      console.log("Submitted", data);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setError("root", { type: "manual", message: message });
    }
    console.log(data);
  }

  function handleFrequencyToggle(frequency: string) {
    dispatch(setMonthDays([])); // Clear monthDays
    dispatch(setDays([])); // Clear days
    dispatch(setFrequency(frequency));
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recurrence.exceptions",
  });
  useEffect(() => {
    dispatch(resetShiftSlaceState());
    console.log("isExceptionSet", isExceptionSet);
  }, []);
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Edit Redurrent Shifts" handleClose={onDone} />
        {errors.root && (
          <InfoBox mode="warning" severity="medium">
            {errors.root.message}
          </InfoBox>
        )}
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleSave)}>
            <Form.Group>
              {/* Frequency Selector */}
              <Controller
                name="recurrence.frequency"
                control={control}
                render={({ field }) => (
                  <Form.Select
                    key={field.name}
                    label="Frequency"
                    id="frequency"
                    options={[
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                    ]}
                    value={field.value}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      field.onChange(e.target.value);
                      handleFrequencyToggle(e.target.value);
                    }}
                  />
                )}
              />
              {errors.recurrence?.frequency && (
                <InfoBox mode="warning" severity="medium">
                  {errors.recurrence.frequency.message}
                </InfoBox>
              )}

              {/* Days Selection for Weekly */}
              {frequency === "weekly" && (
                <div className="space-y-2">
                  <p>Select Days of the Week:</p>
                  <div className="flex gap-2">
                    {daysOfWeek.map((day) => (
                      <Controller
                        key={day}
                        name="recurrence.days"
                        control={control}
                        render={({ field }) => (
                          <Form.Input
                            id={`day-${day}`}
                            type="checkbox"
                            key={day}
                            label={day}
                            checked={field.value.includes(day)}
                            onChange={() => {
                              const newDays = field.value.includes(day)
                                ? field.value.filter((d) => d !== day)
                                : [...field.value, day];
                              field.onChange(newDays);
                            }}
                          />
                        )}
                      />
                    ))}
                    {errors.recurrence?.days && (
                      <InfoBox mode="warning" severity="medium">
                        {errors.recurrence.days.message}
                      </InfoBox>
                    )}
                  </div>
                </div>
              )}

              {/* Dates Selection for Monthly */}
              {frequency === "monthly" && (
                <div className="space-y-2">
                  <label>Select Days of the Month</label>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                      <Controller
                        name="recurrence.monthDays"
                        control={control}
                        key={date}
                        render={({ field }) => (
                          <Form.Input
                            id={`month-day-${date}`}
                            type="checkbox"
                            key={date}
                            label={date.toString()}
                            checked={field.value.includes(date)}
                            onChange={() => {
                              const newMonthDays = field.value.includes(date)
                                ? field.value.filter((d) => d !== date)
                                : [...field.value, date];
                              field.onChange(newMonthDays);
                            }}
                          />
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
              {errors.recurrence?.monthDays && (
                <InfoBox mode="warning" severity="medium">
                  {errors.recurrence.monthDays.message}
                </InfoBox>
              )}

              {/* Shift Timing */}
              <p className="text-xl">Shift Timing</p>
              <p>When should shift start recurring?</p>
              <div className="flex gap-2">
                <Form.Input
                  id={`start-time`}
                  type="time"
                  label="Start Time"
                  {...register("startTime")}
                />
                {errors.startTime && (
                  <InfoBox mode="warning" severity="medium">
                    {errors.startTime.message}
                  </InfoBox>
                )}
                <Form.Input
                  id={`end-time`}
                  type="time"
                  label="End Time"
                  {...register("endTime")}
                />
                {errors.endTime && (
                  <InfoBox mode="warning" severity="medium">
                    {errors.endTime.message}
                  </InfoBox>
                )}
              </div>
              <Form.Input
                id="is-end-date-set"
                type="checkbox"
                className="flex-row"
                labelClassName="pb-0 pr-2"
                label="Set final date of recurrence"
                defaultChecked={isEndDateSet}
                onChange={() => {
                  dispatch(setIsEndDateSet(!isEndDateSet));
                }}
              />

              {isEndDateSet && (
                <Form.Input
                  id="end-date"
                  type="date"
                  label="End Date"
                  {...register("recurrence.endDate")}
                />
              )}
              {errors.recurrence?.endDate && (
                <InfoBox mode="warning" severity="medium">
                  {errors.recurrence.endDate.message}
                </InfoBox>
              )}
              {/* Exceptions */}

              {fields.map((field, index) => (
                <div
                  key={field.id || index}
                  className="flex flex-col gap-2 border border-slate-300 p-2 rounded-md"
                >
                  <Form.Input
                    id={`exception-date-${index}`}
                    type="date"
                    label="Exception Date"
                    {...register(
                      `recurrence.exceptions.${index}.date` as const
                    )}
                  />

                  <div className="flex gap-2">
                    <Form.Input
                      id={`start-time`}
                      type="time"
                      label="Start Time"
                      {...register("startTime")}
                    />
                    {errors.startTime && (
                      <InfoBox mode="warning" severity="medium">
                        {errors.startTime.message}
                      </InfoBox>
                    )}
                    <Form.Input
                      id={`end-time`}
                      type="time"
                      label="End Time"
                      {...register("endTime")}
                    />
                    {errors.endTime && (
                      <InfoBox mode="warning" severity="medium">
                        {errors.endTime.message}
                      </InfoBox>
                    )}
                  </div>
                  <Form.Input
                    id={`exception-skip-${index}`}
                    type="checkbox"
                    className="flex-row"
                    labelClassName="pb-0 pr-2"
                    label="Skip"
                    {...register(
                      `recurrence.exceptions.${index}.skip` as const
                    )}
                  />
                  {
                    <button
                      className="btn-submit"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      Remove
                    </button>
                  }
                </div>
              ))}

              {/* {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-2 border border-slate-300 p-2 rounded-md"
                >
                  <Form.Input
                    id={`exception-date-${index}`}
                    type="date"
                    label="Exception Date"
                    {...register(
                      `recurrence.exceptions.${index}.date` as const
                    )}
                  />
                  {index > 0 && (
                    <button
                      className="btn-submit"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))} */}
              <button
                className="btn-submit"
                onClick={(e) => {
                  e.preventDefault();
                  append({ date: "", skip: true });
                }}
              >
                Add Exception
              </button>
              {/* <ShiftsTable shifts={shifts} /> */}
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
