import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import InfoBox from "../UI/InfoBox";
import { deleteTeam, queryClient } from "../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../store";

type NewTeamModalProps = {
  onDone: () => void;
};
const TeamDeleteModal = ({ onDone }: NewTeamModalProps) => {
  const { activeTeam } = useSelector((state: ReduxRootState) => state.calendar);

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["createTeam"],
    mutationFn: (teamID: string) => deleteTeam(teamID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] }); // Invalidate the teams query to refetch the data
    },
  });

  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Are you sure you sure? " handleClose={onDone} />

        <Modal.Body>
          {activeTeam?._id && (
            <Form onSubmit={() => mutate(activeTeam?._id)}>
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
