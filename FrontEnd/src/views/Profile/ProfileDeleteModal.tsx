import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../utils/http-FS_users";
import { useMutation } from "@tanstack/react-query";
import Modal from "../../components/UI/Modal";
import { Form } from "../../components/UI/Form";
import InfoBox from "../../components/UI/InfoBox";
import LoadingIndicator from "../../components/UI/LoadingIndicator";

type ProfileDeleteModalProps = {
  setModalOpen: (isOpen: boolean) => void;
  userUIDtoDelete: string;
};

export const ProfileDeleteModal = ({
  setModalOpen,
  userUIDtoDelete,
}: ProfileDeleteModalProps) => {
  const navigate = useNavigate();
  function onDone() {
    setModalOpen(false);
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (uid: string) => deleteUser(uid),
    onSuccess: () => {
      navigate("/auth?login");
      console.log("User deleted successfully");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (userUIDtoDelete) {
      mutate(userUIDtoDelete);
    }
  }
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Are you sure you sure? " handleClose={onDone} />
        {isPending && <LoadingIndicator label="Deleting profile ..." />}
        <Modal.Body>
          {userUIDtoDelete && (
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
                    Delete profile
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
