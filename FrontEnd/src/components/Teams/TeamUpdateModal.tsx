import Modal from "../UI/Modal";
import { useMutation } from "@tanstack/react-query";
import { queryClient, updateTeam } from "../../utils/http";
import InfoBox from "../UI/InfoBox";
import { Form } from "../UI/Form";
import { TeamUpdate, teamUpdateSchema, UserCombined } from "@shared/schemas";
import { RootState as ReduxRootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { FormEvent, useEffect, useRef, useState } from "react";
import { XCircleIcon } from "@heroicons/react/outline";
import { setIsUpdateModalOpen } from "../../store/teams-slice";
import Table from "../UI/Table1";
import { AnimatePresence } from "framer-motion";

type TeamUpdateModalProps = {
  teamID: string;
};

function TeamUpdateModal({ teamID }: TeamUpdateModalProps) {
  const teamNameRef = useRef<HTMLInputElement>(null);
  const { activeTeam, activeMembers } = useSelector(
    (state: ReduxRootState) => state.calendar
  );
  const [newMembers, setNewMembers] = useState<UserCombined[]>([
    ...activeMembers,
  ]);

  const dispatch = useDispatch();

  function onDone() {
    dispatch(setIsUpdateModalOpen(false));
  }
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["updateTeam"],
    mutationFn: (data: TeamUpdate) => updateTeam(data), // useMutation uses async functions under the hood
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] }); // Invalidate the teams query to refetch the data

      onDone();
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (activeTeam) {
      mutate({
        teamId: teamID,
        teamName: teamNameRef.current?.value,
        members: activeTeam?.members.filter((member) =>
          newMembers.find((newMember) => newMember.uid === member.firebaseID)
        ),
      });
    }
  }

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    uid: string
  ) => {
    e.preventDefault();
    setNewMembers((prev) => prev.filter((member) => member.uid !== uid));
  };
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Update team" handleClose={onDone} />
        <p>Update the team, delete members or invite new ones.</p>
        <Modal.Body>
          {isError && (
            <>
              {console.log("updateTeamError", error)}
              <InfoBox mode="warning" severity="high">
                {error.message || "Error updating team"}
              </InfoBox>
            </>
          )}
          {/* Form section */}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Input
                ref={teamNameRef}
                type="text"
                label="Team name"
                id="teamName"
                defaultValue={activeTeam?.teamName}
              />

              {/* Table section */}
              <Table>
                <Table.Header>
                  <Table.Row key="header">
                    <Table.HeaderCell>Members</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <AnimatePresence>
                    {newMembers.length > 0 ? (
                      newMembers.map((member) => (
                        <Table.Row key={member.uid}>
                          <Table.Cell>{member.displayName}</Table.Cell>
                          <Table.Cell>
                            <button
                              onClick={(e) => handleDelete(e, member.uid)}
                              className="text-red-500"
                            >
                              <XCircleIcon className="h-5" />
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row key="no-members">
                        <Table.Cell colSpan={2}>No members</Table.Cell>
                      </Table.Row>
                    )}
                  </AnimatePresence>
                </Table.Body>
              </Table>
              <Form.Footer actionsClassName="flex gap-2">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isPending}
                >
                  Update team
                </button>
              </Form.Footer>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TeamUpdateModal;
