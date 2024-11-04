import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import { Shift, shiftSchema } from "@shared/schemas";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";
import {
  DaysOfWeek,
  setIsEndDateSet,
  setIsSubmitting,
  shiftSlice,
} from "../../store/shifts-slice";
import InfoBox from "../UI/InfoBox";
import { addRecurrentShift } from "../../utils/http";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  const dispatch = useDispatch();
  const daysOfWeek = Object.values(DaysOfWeek);
  const { shift, isSubmitting, serverError, selectedShift, isEndDateSet } =
    useSelector((state: ReduxRootState) => state.shifts);

  /*  const { data, isLoading, isError } = useMutation({
    mutationKey: ["addRecurrentShift"],
    mutationFn: (data: Shift) => addRecurrentShift(data),
    onMutate: () => {
      dispatch(setIsSubmitting(true));
    },
    onSuccess: () => {
      dispatch(setIsSubmitting(false));
      onDone();
    },
    onError: (error: any) => {
      dispatch(setIsSubmitting(false));
      dispatch(setServerError(error?.message));
    },
  }); */

  const {
    setDays,
    setFrequency,
    setMonthDays,
    setUserAndTeam,
    resetForm,
    addShift,
  } = shiftSlice.actions;
  const { frequency, monthDays, days, endDate } = shift.recurrence;

  // Set up useForm with zod schema and resolver
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm<Shift>({
    resolver: zodResolver(shiftSchema),
    defaultValues: shift,
  });

  useEffect(() => {
    console.log("shift", shift);
    console.log("isEndDateSet", isEndDateSet);
    dispatch(setUserAndTeam({ memberID, teamID }));
    dispatch(resetForm());
  }, []);

  async function handleSave(data: Shift) {
    try {
      /* dispatch(setIsSubmitting(true));
      dispatch(setServerError(null));
      // add a new shift to the state
      dispatch(addShift(data));
      // send the data to the server
      await addRecurrentShift(data);
      dispatch(setIsSubmitting(false));
      return onDone(); */
    } catch (error: any) {
      /*  dispatch(setIsSubmitting(false));
      setServerError(error?.message);
      return console.error(error); */
    }
    console.log(data);
  }

  function handleFrequencyToggle(frequency: string) {
    dispatch(setMonthDays([])); // Clear monthDays
    dispatch(setDays([])); // Clear days
    dispatch(setFrequency(frequency));
  }
  useEffect(() => {
    console.log(selectedShift);
  }, [selectedShift]);
  useEffect(() => {
    console.log(isEndDateSet);
    console.log();
  });
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
          <Form onSubmit={handleSubmit(handleSave)}>
            <Form.Group>
              {/* Frequency Selector */}
              <Controller
                name="recurrence.frequency"
                control={control}
                render={({ field }) => (
                  <Form.Select
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
              <div className="space-y-2">
                <p className="text-xl">Shift Timing</p>
                <p>When should shift start recurring?</p>
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
              <div className=" space-y-2">
                <p>When should shift stop recurring? Set end date:</p>
                {/* <input
                  type="checkbox"
                  onChange={() => {
                    dispatch(setIsEndDateSet(!isEndDateSet));
                  }}
                /> */}
                <Form.Input
                  id="is-end-date-set"
                  type="checkbox"
                  className="flex-row"
                  label="Set End Date"
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
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est,
                rem quisquam nisi aut et laborum provident facere, voluptatem
                ipsum fugit rerum! Corporis, ipsa perspiciatis. Ea qui accusamus
                dolores voluptatem quo? Ducimus, ad vel sunt magni id eum
                distinctio cum itaque dicta minus porro quisquam quidem,
                excepturi optio assumenda blanditiis, tenetur perferendis!
                Quisquam sequi aspernatur neque laboriosam aperiam natus
                laudantium veniam. Sunt alias unde accusantium reprehenderit
                pariatur, hic veritatis laboriosam ab? Reprehenderit ea nihil,
                doloribus, aspernatur facere error suscipit quo hic iure quidem
                nam voluptatibus blanditiis, quisquam fugiat perspiciatis
                tenetur. Mollitia? Nihil maiores voluptate magnam sequi laborum,
                esse nisi corporis, expedita alias adipisci veritatis accusamus
                soluta cumque sunt consectetur, officiis cupiditate suscipit.
                Voluptate ipsum magnam maiores et necessitatibus nostrum
                doloribus possimus! Dolor quae iusto voluptas quis qui incidunt,
                culpa numquam ab impedit vitae officiis nisi distinctio in sit
                non quo repellat est asperiores aperiam nemo officia magnam?
                Explicabo dolor quibusdam quo?
              </p>
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
