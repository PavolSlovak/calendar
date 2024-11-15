import React, { useState } from "react";
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
  Team,
} from "@shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../store/authContext";
import { useDispatch } from "react-redux";
import { addTeam } from "../../store/teams-slice";
import { XCircleIcon } from "@heroicons/react/outline";
import Table from "../UI/Table1";
import { AnimatePresence } from "framer-motion";
import { sendNotif, storeInvitation } from "../../utils/http-firestore";
import { set } from "date-fns";

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
    clearErrors,
  } = useForm<TCreateTeam>({
    resolver: zodResolver(createTeamSchema),
  });
  const email: string | null = watch("inviteMember");

  const { currentUser } = useAuth();
  const dispatch = useDispatch();

  const { mutate: fetchUserMutation, isPending: fetchUserIsLoading } =
    useMutation({
      mutationKey: ["fetchUser"],
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
        }
        // Add the user to the invited members list state
        setInvitedMembers((prev) => [...prev, data]);
        clearErrors("inviteMember");
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
    mutationFn: ({
      teamName,
      invitedMembersUIDArray,
    }: {
      teamName: string;
      invitedMembersUIDArray: string[];
    }) => createTeam(teamName, invitedMembersUIDArray),
    // TODO, upload invitations to firestore and upload team with invitation id's response array
    onSuccess: (data) => {
      invitedMembers.map((member) => {
        console.log("member", member);
      });
      console.log("Team created successfully", data);
      // Invalidate the teams query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      // update the state with the new team
      dispatch(addTeam(data));
      // If no members were invited, return
      if (invitedMembers.length === 0) return;
      // Send invitations to the invited users
      sendInvitationsMutation({
        teamData: data,
        invitedUsersUIDArray: invitedMembers.map((member) => member.uid),
      });

      // close the modal
      onDone();
    },
  });

  type TSendInvitation = {
    teamData: Team;
    invitedUsersUIDArray: string[];
  };

  const {
    mutate: sendInvitationsMutation,
    isPending: sendInvitationsIsLoading,
    isError: sendInvitationsIsError,
    error: sendInvitationsError,
  } = useMutation({
    mutationKey: ["sendInvitations"],
    mutationFn: ({ teamData, invitedUsersUIDArray }: TSendInvitation) => {
      const response = Promise.all(
        invitedUsersUIDArray.map(async (uid) => {
          const [sendNotifResponse, storeInvitationResponse] =
            await Promise.all([
              sendNotif(
                uid,
                "You have been invited to a team",
                `You have been invited to join the team ${teamData.teamName}`
              ),
              /* storeInvitation(teamId: string, invitedUserId: string) { */
              storeInvitation(teamData._id, uid),
            ]);
          return { sendNotifResponse, storeInvitationResponse }; // Return the responses
        })
      );
      return response;
    },
    onSuccess: async (response) => {
      console.log("Invitations sent successfully", response);
    },
  });

  async function onSubmit(data: TCreateTeam) {
    createTeamMutation({
      teamName: data.teamName,
      invitedMembersUIDArray: invitedMembers.map((member) => member.uid),
    });
    console.log(invitedMembers);
  }
  function onInvite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (email) {
      fetchUserMutation(email);
    }
  }

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
            <InfoBox mode="warning" severity="high">
              {createTeamError.message || "Error creating team"}
            </InfoBox>
          )}
          {sendInvitationsIsError && (
            <InfoBox mode="warning" severity="high">
              {sendInvitationsError.message || "Error sending invitations"}
            </InfoBox>
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
                      invitedMembers.map((member, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{member.email}</Table.Cell>
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
                  disabled={fetchUserIsLoading}
                >
                  Invite
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={createTeamIsLoading || sendInvitationsIsLoading}
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
