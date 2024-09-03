import { z } from "zod";
import InfoBox from "../../UI/InfoBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState as ReduxRootState } from "../../../store";
import { Team } from "../../../lib/types";

const createTeamS1 = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters!"),
});
type CreateTeamS1 = z.infer<typeof createTeamS1>;

type FormS1Props = {
  setNewTeam: React.Dispatch<React.SetStateAction<Team>>;
  newTeam: Team;
};

function FormS1({ setNewTeam }: FormS1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateTeamS1>({
    resolver: zodResolver(createTeamS1),
  });
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);

  function onSubmit(data: CreateTeamS1) {
    if (teams.find((team) => team.teamName === data.teamName)) {
      setError("teamName", {
        message: "Team with this name already exists!",
      });
      return;
    }
    console.log(data);
    setNewTeam((prevTeam: Team) => ({
      ...prevTeam,
      teamName: data.teamName,
    }));

    reset();
  }
  let infobox;

  if (errors.teamName) {
    infobox = (
      <InfoBox mode="warning" severity="medium">
        {errors.teamName?.message}
      </InfoBox>
    );
  } else {
    infobox = (
      <InfoBox mode="hint">
        Please enter the team name and click on the "Create" button.
      </InfoBox>
    );
  }
  return (
    <form
      className="flex flex-col w-full p-10 pt-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      {infobox}
      <input
        type="text"
        className="border border-black rounded p-2 my-4"
        placeholder="Team's name..."
        {...register("teamName")}
      />
      <button className={`btn-invite`}>Create</button>
    </form>
  );
}

export default FormS1;
