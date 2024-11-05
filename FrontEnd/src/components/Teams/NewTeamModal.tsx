import React, { useEffect, useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import InfoBox from "../UI/InfoBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUserByEmail } from "../../utils/http-FS_users";
import { createTeam, queryClient } from "../../utils/http";
import { createTeamSchema, TCreateTeam } from "@shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../store/authContext";
import { InvitationsTable } from "../UI/InvitationsTable";
import { useDispatch } from "react-redux";
import { addTeam } from "../../store/teams-slice";

type NewTeamModalProps = {
  onDone: () => void;
};
const NewTeamModal = ({ onDone }: NewTeamModalProps) => {
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
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
      onSuccess: (data) => {
        if (data) {
          if (invitedMembers.includes(data.email)) {
            setError("inviteMember", {
              type: "manual",
              message: "User already invited",
            });

            return;
          }
          if (currentUser?.email === data.email) {
            setError("inviteMember", {
              type: "manual",
              message: "You can't invite yourself",
            });
            return;
          }
          setInvitedMembers((prev) => [...prev, data.email]);
          console.log(data);
        }
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
      createTeam(data.teamName, invitedMembers),
    onSuccess: (data) => {
      console.log("Team created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["teams"] }); // Invalidate the teams query to refetch the data
      dispatch(addTeam(data));
      onDone();
    },
  });

  function onSubmit(data: TCreateTeam) {
    createTeamMutation(data);
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
              <div className="flex justify-end"></div>
              <InvitationsTable
                invitations={invitedMembers}
                handleDelete={(email) =>
                  setInvitedMembers((prev) =>
                    prev.filter((member) => member !== email)
                  )
                }
              />
              <Form.Footer actionsClassName="flex  gap-2">
                <button
                  className="btn-invite disabled:opacity-50"
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
