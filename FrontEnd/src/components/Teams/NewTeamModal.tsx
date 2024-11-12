import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import InfoBox from "../UI/InfoBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUserByEmail } from "../../utils/http-FS_users";
import { createTeam, queryClient } from "../../utils/http";
import {
  createTeamSchema,
  FirebaseAuthUser,
  TCreateTeam,
} from "@shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../store/authContext";
import { useDispatch } from "react-redux";
import { addTeam } from "../../store/teams-slice";
import { XCircleIcon } from "@heroicons/react/outline";
import Table from "../UI/Table1";
import { AnimatePresence, m } from "framer-motion";
import { storeInvitation } from "../../utils/http-firestore";

type NewTeamModalProps = {
  onDone: () => void;
};
const NewTeamModal = ({ onDone }: NewTeamModalProps) => {
  const [invitedMembers, setInvitedMembers] = useState<FirebaseAuthUser[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<TCreateTeam>({
    resolver: zodResolver(createTeamSchema),
  });
  const email: string | null = watch("inviteMember");
  const teamName = watch("teamName");

  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const { mutate: InvitationMutation, isPending: inviteIsLoading } =
    useMutation({
      mutationKey: ["inviteMember"],
      mutationFn: (email: string) => fetchUserByEmail(email),
      onSuccess: async (data) => {
        if (invitedMembers.includes(data.email)) {
          return setError("inviteMember", {
            type: "manual",
            message: "User already invited",
          });
        }
        if (currentUser?.email === data.email) {
          return setError("inviteMember", {
            type: "manual",
            message: "You can't invite yourself",
          });

          // send invitation to the invited user
        }

        setInvitedMembers((prev) => [...prev, data]);

        console.log(data);
      },
      onError: (error) => {
        setError("inviteMember", {
          type: "manual",
          message: error.message,
        });
      },
    });

  const {
    mutate: createTeamMutation,
    isPending: createTeamIsLoading,
    isError: createTeamIsError,
    error: createTeamError,
  } = useMutation({
    mutationKey: ["createTeam"],
    mutationFn: (data: TCreateTeam) =>
      createTeam(
        data.teamName,
        invitedMembers.map((member) => member.uid)
      ),
    onSuccess: (data) => {
      console.log("Team created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["teams"] }); // Invalidate the teams query to refetch the data
      dispatch(addTeam(data));
      onDone();
    },
  });

  async function onSubmit(data: TCreateTeam) {
    createTeamMutation(data);
    console.log(invitedMembers);
    /*    await new Promise(invitedMembers.map((member) => storeInvitation(member)));
     */
  }
  function onInvite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (email) {
      InvitationMutation(email);
    }
  }
  useEffect(() => {
    console.log(email);
  }, [email]);
  function handleDelete(e: React.MouseEvent<HTMLButtonElement>, uid: string) {
    e.preventDefault();
    setInvitedMembers((prev) => prev.filter((member) => member.uid !== uid));
  }
  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Create new team" handleClose={onDone} />
        <p className="text-center">
          Create a new team by typing in the team name and send invitations to
          the future team members
        </p>

        <Modal.Body>
          {createTeamIsError && (
            <>
              {console.log("createTeamError", createTeamError)}
              <InfoBox mode="warning" severity="high">
                {createTeamError.message || "Error creating team"}
              </InfoBox>
            </>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Input
                type="text"
                label="Team name"
                id="teamName"
                {...register("teamName")}
              />
              {errors.teamName && (
                <InfoBox mode="warning" severity="medium">
                  {errors.teamName.message}
                </InfoBox>
              )}
              <Form.Input
                type="email"
                label="Invite member"
                id="inviteMember"
                {...register("inviteMember")}
              />
              {errors.inviteMember && (
                <InfoBox mode="warning" severity="medium">
                  {errors.inviteMember.message}
                </InfoBox>
              )}

              <Table>
                <Table.Header>
                  <Table.Row key="header">
                    <Table.HeaderCell>Members</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <AnimatePresence>
                    {invitedMembers.length > 0 ? (
                      invitedMembers.map((member) => (
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
              <Form.Footer actionsClassName="flex  gap-2">
                <button
                  className="btn-success disabled:opacity-50"
                  onClick={onInvite}
                  disabled={inviteIsLoading || !email}
                >
                  Invite
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={createTeamIsLoading || !teamName}
                >
                  Create Team
                </button>
              </Form.Footer>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default NewTeamModal;
