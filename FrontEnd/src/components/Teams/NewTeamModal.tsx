import Modal from "../UI/Modal";
type NewTeamModalProps = {
  onDone: () => void;
};
const NewTeamModal = ({ onDone }: NewTeamModalProps) => {
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Create new team" />
        <Modal.Body>
          <p>Jebe</p>
        </Modal.Body>
        <Modal.Footer
          handleClose={onDone}
          actions={<button className="btn-submit">Create team</button>}
        />
      </Modal>
    </>
  );
};
export default NewTeamModal;
{
  /*  <Form>
            <Form.Group className="mb-3" controlId="formBasicTeamName">
              <Form.Label>Team name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTeamDescription">
              <Form.Label>Team description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </Form.Group>
          </Form> */
}
