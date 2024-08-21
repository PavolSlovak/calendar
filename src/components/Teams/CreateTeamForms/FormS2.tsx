import { z } from "zod";
import ErrorBlock from "../../UI/ErrorBlock";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import users, { User } from "../../../dummy_users";
import InvitationTable from "../InvitationTable";
import { Team } from "../../../store/teams-slice";
import { useEffect } from "react";

const createTeamS2 = z.object({
  email: z.string().email(),
});
type CreateTeamS2 = z.infer<typeof createTeamS2>;

type FormS2Props = {
  setNewTeam: React.Dispatch<React.SetStateAction<Team>>;
  newTeam: Team;
};

function FormS2({ setNewTeam, newTeam }: FormS2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateTeamS2>({
    resolver: zodResolver(createTeamS2),
  });

  function onSubmit(data: CreateTeamS2) {
    const { email } = data;
    const foundUser: User | undefined = users.find(
      (user) => user.email === email
    );
    if (foundUser) {
      if (newTeam.members.find((member) => member.email === email)) {
        setError("email", {
          message: "User is already a member of the team!",
        });

        return;
      }
      // Add user to team members
      setNewTeam((prevTeam: Team) => ({
        ...prevTeam,
        members: [...prevTeam.members, foundUser],
      }));
    } else {
      console.log("User not found!");
      setError("email", {
        message: "User not found!",
      });
    }
  }

  function handleDelete(id: number) {
    setNewTeam((prevTeam: Team) => ({
      ...prevTeam,
      members: prevTeam.members.filter((member) => member.id !== id),
    }));
    // TODO: Add logic to remove the user from the team
  }

  let infobox;
  if (errors.email) {
    console.log(errors.email?.message);
    infobox = (
      <ErrorBlock mode="warning" severity="medium">
        {errors.email?.message}
      </ErrorBlock>
    );
  } else {
    infobox = (
      <ErrorBlock mode="hint">
        Please enter the email of the user you want to invite.
      </ErrorBlock>
    );
  }

  return (
    <form
      className="flex flex-col w-full p-10 pt-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <>
        {infobox}
        <input
          type="email"
          className="border border-black rounded p-2 my-4"
          placeholder="Email..."
          {...register("email")}
        />

        <button className={`btn-invite`}>Add</button>

        <InvitationTable
          TeamMembers={newTeam.members}
          handleDelete={handleDelete}
        />
      </>
    </form>
  );
}

export default FormS2;
