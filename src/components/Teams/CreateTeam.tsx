import { useEffect, useRef, useState } from "react";
import Modal, { ModalHandle } from "../UI/Modal";
import Button from "../UI/Button";
import InvitationTable from "./InvitationTable";
import RadioButtons from "../UI/RadioButtons";
import ErrorBlock from "../UI/ErrorBlock";
import { teamSlice } from "../../store/teams-slice";
import { useDispatch, useSelector } from "react-redux";
import users from "../../dummy_users";
import { RootState as ReduxRootState } from "../../store"; // Assuming your store is defined in `store.ts`
import { useAuth } from "../../store/authContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../dummy_users";
type CreateTeamProps = {
  onDone: () => void;
};

function CreateTeam({ onDone }: CreateTeamProps) {
  const modal = useRef<ModalHandle>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const createTeamS1 = z.object({
    teamName: z.string().min(3, "Team name must be at least 3 characters!"),
  });
  const createTeamS2 = z.object({
    email: z.string().email(),
  });
  const createTeamS3 = z.object({
    teamName: z.string().min(3, "Team name must be at least 3 characters!"),
    members: z.array(userSchema),
    createdBy: userSchema,
  });
  type CreateTeamS1 = z.infer<typeof createTeamS1>;
  type CreateTeamS2 = z.infer<typeof createTeamS2>;
  type CreateTeamS3 = z.infer<typeof createTeamS3>;

  const [newTeam, setNewTeam] = useState<CreateTeamS3>({
    teamName: "",
    members: [],
    createdBy: currentUser!,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTeamS1 | CreateTeamS2 | CreateTeamS3>({
    resolver: zodResolver(currentSlide === 1 ? createTeamS1 : createTeamS2),
  });

  const [error, setError] = useState<{ info: { message: string } } | null>(
    null
  );
  const teams = useSelector((state: ReduxRootState) => state.teams.teams);
  useEffect(() => {
    if (modal.current) {
      modal.current.open();
    }
  }, []);

  function onSubmit(data: CreateTeamS1 | CreateTeamS2 | CreateTeamS3) {
    setError(null);
    switch (currentSlide) {
      case 1:
        const { teamName } = data as CreateTeamS1;
        if (teams.find((team) => team.teamName === teamName)) {
          return setError({ info: { message: "Team name already exists!" } });
        }
        setNewTeam((prevState) => ({ ...prevState, teamName: teamName }));
        break;

      case 2:
        const { email } = data as CreateTeamS2;
        const foundUser = users.find((user) => user.email === email);
        if (foundUser) {
          if (newTeam.members.find((member) => member.email === email)) {
            return setError({
              info: {
                message:
                  "User already added to the team. Choose a different user!",
              },
            });
          }

          // Add the found user to the team members
          setNewTeam((prevState) => ({
            ...prevState,
            members: [...prevState.members, foundUser],
          }));

          // Clear the input field after inviting
        }
        break;
      case 3:
        dispatch(teamSlice.actions.addTeam(newTeam));
        console.log("Jebe");
        reset();
        onDone(); // Close the modal after creating the team

        break;
    }
  }

  function handleDelete(id: number) {
    setNewTeam((prevState) => ({
      ...prevState,
      members: prevState.members.filter((member) => member.id !== id),
    }));
    console.log("Invitation deleted:", id);
  }
  function handleNext() {
    setCurrentSlide((prev) => Math.min(prev + 1, 3));
    setError(null);
  }
  function handlePrev() {
    setCurrentSlide((prev) => Math.max(prev - 1, 1));
    setError(null);
  }

  let heading;
  let formInputs;
  let infobox;

  if (error) {
    infobox = (
      <ErrorBlock mode="warning" severity="high">
        {error.info.message}
      </ErrorBlock>
    );
  }

  if (currentSlide === 1) {
    heading = "Create Team";
    formInputs = (
      <>
        <input
          type="text"
          className="border border-black rounded p-2"
          placeholder="Team's name..."
          {...register("teamName")}
        />
        <button className={`btn-invite`}>Create</button>
      </>
    );
    if (errors && "teamName" in errors) {
      infobox = (
        <ErrorBlock mode="warning" severity="medium">
          {errors.teamName?.message}
        </ErrorBlock>
      );
    } else {
      infobox = (
        <ErrorBlock mode="hint">
          Please enter the team name and click on the "Create" button.
        </ErrorBlock>
      );
    }
  }

  if (currentSlide === 2) {
    heading = "Create Team";
    formInputs = (
      <>
        <input
          type="email"
          className="border border-black rounded p-2"
          placeholder="Email..."
          {...register("email")}
        />

        <Button className={`btn-invite`}>Add</Button>

        <InvitationTable
          TeamMembers={newTeam.members}
          handleDelete={handleDelete}
        />
      </>
    );
  }

  if (currentSlide === 3) {
    heading = "Summary";
    formInputs = (
      <>
        {console.log(errors)}
        <h2>Team Name:</h2>
        <p>{newTeam.teamName} </p>

        <h2>Invited members:</h2>
        <ul>
          {newTeam.members.length === 0 && <li>No members invited</li>}
          {newTeam.members.map((member) => (
            <li key={member.id}>{member.email}</li>
          ))}
        </ul>
        <br />
        <Button className="btn-submit">Create Team</Button>
      </>
    );
  }
  return (
    <Modal ref={modal} onClose={onDone}>
      <div
        className={`flex flex-col items-center justify-center w-full h-20 blue-gradient`}
      >
        <h2 className="text-white">{heading}</h2>
        <RadioButtons currentSlide={currentSlide} />
        <Button className="absolute right-3 top-2 text-white " onClick={onDone}>
          &#x2717;
        </Button>
      </div>
      <Button
        type="button"
        className={` btn-arrow-L ${currentSlide === 1 && "text-gray-300"}`}
        onClick={handlePrev}
        disabled={currentSlide === 1}
      >
        {"<"}
      </Button>

      <form
        className="flex flex-col w-full p-10 pt-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        {infobox}
        {formInputs}
      </form>

      {newTeam.teamName !== "" && (
        <Button
          type="button"
          className={`btn-arrow-R ${currentSlide === 3 && "text-gray-300"}`}
          onClick={handleNext}
          disabled={currentSlide === 3}
        >
          {">"}
        </Button>
      )}
    </Modal>
  );
}

export default CreateTeam;
