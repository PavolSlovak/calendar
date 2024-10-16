import Modal from "../../UI/Modal";

export const newTeamModal = () => {
  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a new team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createTeam}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
