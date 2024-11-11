import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import InfoBox from "../UI/InfoBox";
import { deleteTeam, queryClient } from "../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";
import { teamSlice } from "../../store/teams-slice";

const TeamDeleteModal = () => {
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);
  const { teams } = useSelector((state: ReduxRootState) => state.teams);
  const dispatch = useDispatch();
  const { setIsDeleteModalOpen } = teamSlice.actions;

  function onDone() {
    dispatch(setIsDeleteModalOpen(false));
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["deleteTeam"],
    mutationFn: (teamID: string) => deleteTeam(teamID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] }); // Invalidate the teams query to refetch the data
      console.log("Team deleted successfully");

      onDone();
    },
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (activeTeam?._id) {
      mutate(activeTeam?._id);
    }
  }
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Are you sure you sure? " handleClose={onDone} />

        <Modal.Body>
          {activeTeam?._id && (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                {isError && (
                  <InfoBox mode="warning" severity="high">
                    {error?.message}
                  </InfoBox>
                )}
                <Form.Footer actionsClassName="flex  gap-2">
                  <button
                    type="submit"
                    className="btn-delete"
                    disabled={isPending}
                  >
                    Delete team
                  </button>
                </Form.Footer>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default TeamDeleteModal;
