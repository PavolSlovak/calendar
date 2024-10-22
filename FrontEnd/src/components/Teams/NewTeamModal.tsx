import React, { FormEvent, useState } from "react";
import { Form } from "../UI/Form";
import Modal from "../UI/Modal";
import InfoBox from "../UI/InfoBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUserByEmail } from "../../utils/http-FS_users";
import { createTeam } from "../../utils/http";
import { createTeamSchema, TCreateTeam } from "@shared/schemas";
import { useMutation } from "@tanstack/react-query";

type NewTeamModalProps = {
  onDone: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
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
  const email = watch("inviteMember");

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
      onDone();
    },
  });

  function onSubmit(data: TCreateTeam) {
    createTeamMutation(data);
  }
  function onInvite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    InvitationMutation(email);
  }

  return (
    <>
      <Modal onClose={onDone}>
        <Modal.Header title="Create new team" />
        <p className="text-center">
          Create a new team by typing in the team name and send invitations to
          the future team members
        </p>
        <Modal.Body>
          {/*  {inviteIsError && (
            <>
              {console.log("inviteError", inviteError)}
              <InfoBox mode="warning" severity="high">
                {inviteError.message || "Error inviting user"}
              </InfoBox>
            </>
          )} */}
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
              <div className="flex justify-end">
                <button
                  className="btn-invite mt-2 disabled:opacity-50"
                  onClick={onInvite}
                  disabled={inviteIsLoading}
                >
                  Invite
                </button>
              </div>
              <button
                className="btn-submit ml-4 "
                disabled={createTeamIsLoading}
              >
                Create team
              </button>
            </Form.Group>
          </Form>
          <div className="flex">
            <h3 className="text-lg font-bold">Invited members</h3>
            <ul className="list-disc ml-4">
              {invitedMembers.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer handleClose={onDone} />
      </Modal>
    </>
  );
};
export default NewTeamModal;
