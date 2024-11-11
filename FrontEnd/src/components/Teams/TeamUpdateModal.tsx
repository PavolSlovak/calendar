import Modal from "../UI/Modal";
import { useMutation } from "@tanstack/react-query";
import { queryClient, updateTeam } from "../../utils/http";
import InfoBox from "../UI/InfoBox";
import { Form } from "../UI/Form";
import { Controller, useForm } from "react-hook-form";
import { TeamUpdate, teamUpdateSchema, UserCombined } from "@shared/schemas";
import { RootState as ReduxRootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { FormEvent, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircleIcon } from "@heroicons/react/outline";
import { setIsUpdateModalOpen } from "../../store/teams-slice";
import Table from "../UI/Table1";

type TeamUpdateModalProps = {
  teamID: string;
};

function TeamUpdateModal({ teamID }: TeamUpdateModalProps) {
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
      console.log("Team updated successfully");
      onDone();
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const teamName = e.currentTarget.teamName.value;
    /*    teamId: z.string(),
       teamName: z.string().min(1).max(100).optional(),
         members: z.array(z.string()).optional().default([]), */
    mutate({
      teamId: teamID,
      teamName: teamName,
      members: newMembers.map((member) => member.uid),
    });
  }

  const handleDelete = (uid: string) => {
    setNewMembers((prev) => prev.filter((member) => member.uid !== uid));
  };
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Update team" handleClose={onDone} />
        <p className="text-center">Update the team name</p>
        <Modal.Body>
          {isError && (
            <>
              {console.log("updateTeamError", error)}
              <InfoBox mode="warning" severity="high">
                {error.message || "Error updating team"}
              </InfoBox>
            </>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Input type="text" label="Team name" id="teamName" />

              {/*  <table>
                <thead>
                  <tr>
                    <th>Members</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {newMembers.map((member, index) => (
                    <tr key={index}>
                      <td>{member.email}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(member.uid)}
                          className="btn-secondary"
                        >
                          <XCircleIcon className="h-5 w-5 bg-red-600 text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
              <Table>
                <Table.Header>
                  <Table.Row key="header">
                    <Table.HeaderCell>Members</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {newMembers.map((member, index) => (
                    <Table.Row key={index.toString()}>
                      <Table.Cell>{member.email}</Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => handleDelete(member.uid)}
                          className="btn-secondary"
                        >
                          <XCircleIcon className="h-6 w-6 bg-red-500 text-white rounded-full" />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <Form.Footer actionsClassName="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary"
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
