import { z } from "zod";
import ErrorBlock from "../../UI/ErrorBlock";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InvitationTable from "../InvitationTable";
import users from "../../../dummy_users";
import { Team } from "../../../lib/types";

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
    setError,
    reset,
  } = useForm<CreateTeamS2>({
    resolver: zodResolver(createTeamS2),
  });
  async function onSubmit(data: CreateTeamS2) {
    const { email } = data;
    /*    async function checkIfEmailExists(email: string): Promise<boolean> {
      // TODO: Add logic to check if the user exists on backend
      return false;
    } */

    try {
      if (newTeam.invitations.find((invitation) => invitation === email)) {
        setError("email", {
          message: "User is already a member of the team!",
        });
        return;
      }
      /*  await checkIfEmailExists(email) */
      const user = users.find((user: any) => user.email === email);

      if (user) {
        console.log("User exists !");
        // Add user to team members
        setNewTeam((prevTeam: Team) => ({
          ...prevTeam,
          invitations: [...prevTeam.invitations, email],
        }));
      } else {
        setError("email", {
          message: "User not found!",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("email", {
        message: "Error fetching user!",
      });
    }
  }
  function handleDelete(invitation: string) {
    setNewTeam((prevTeam: Team) => ({
      ...prevTeam,
      invitations: prevTeam.invitations.filter(
        (InvitedMail) => InvitedMail !== invitation
      ),
    }));
    reset();

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
          invitations={newTeam.invitations}
          handleDelete={handleDelete}
        />
      </>
    </form>
  );
}

export default FormS2;
