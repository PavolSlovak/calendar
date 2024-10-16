import { useEffect, useRef, useState } from "react";
import Modal, { ModalHandle } from "./src/components/UI/Modal";
import Button from "./src/components/UI/Button";
import RadioButtons from "./src/components/UI/RadioButtons";
import { teamSlice } from "./src/store/teams-slice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./src/store/authContext";
import { MemberSchema, Team } from "./src/lib/types";
import users from "./src/dummy_users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState as ReduxRootState } from "./src/store";
import { z } from "zod";
import InfoBox from "./src/components/UI/InfoBox";
import InvitationTable from "./src/components/Teams/InvitationTable";
import { createTeam } from "./src/utils/http";

type CreateTeamProps = {
  onDone: () => void;
};

function CreateTeam({ onDone }: CreateTeamProps) {
  const modal = useRef<ModalHandle>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  type TNewTeam = {
    teamName: string;
    invitations: string[];
  };
  const [newTeam, setNewTeam] = useState<TNewTeam>({
    teamName: "",
    invitations: [],
  });

  useEffect(() => {
    if (modal.current) {
      modal.current.open();
    }
  }, []);

  function handleNext() {
    setCurrentSlide((prev) => Math.min(prev + 1, 3));
  }

  function handlePrev() {
    setCurrentSlide((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit() {
    const { teamName, invitations } = newTeam;
    try {
      setIsSubmitting(true);
      // TODO - Add the new team to the database

      await createTeam(teamName, invitations);

      setIsSubmitting(false);
      onDone(); // Close the modal
    } catch (error) {
      console.error("Error creating team:", error);
      setIsSubmitting(false);
    }
  }
  let slideContent;
  let slideHeader;
  switch (currentSlide) {
    case 1:
      slideContent = <FormS1 setNewTeam={setNewTeam} newTeam={newTeam} />;
      slideHeader = "Create Team";
      break;
    case 2:
      slideContent = <FormS2 setNewTeam={setNewTeam} newTeam={newTeam} />;
      slideHeader = "Invite Team Members";
      break;
    case 3:
      slideContent = (
        <div className="flex flex-col justify-center w-full p-10 pt-0">
          <h2>Review your team</h2>
          <p>Team name: {newTeam.teamName}</p>
          <p>Invitations:</p>
          <ul>
            {newTeam.invitations.map((invitedEmail) => (
              <li key={invitedEmail}>{invitedEmail}</li>
            ))}
          </ul>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Create Team
          </button>
        </div>
      );
      slideHeader = "Summary";
      break;
    default:
      slideContent = <div>Invalid slide</div>;
  }

  return (
    <Modal ref={modal} onClose={onDone}>
      <div
        className={`flex flex-col items-center justify-center w-full h-20 blue-gradient`}
      >
        <h2 className="text-white">{slideHeader}</h2>
        <RadioButtons currentSlide={currentSlide} />
        <Button className="absolute right-3 top-2 text-white" onClick={onDone}>
          &#x2717;
        </Button>
      </div>
      <Button
        type="button"
        className={`btn-arrow-L ${currentSlide === 1 && "text-gray-300"}`}
        onClick={handlePrev}
        disabled={currentSlide === 1}
      >
        {"<"}
      </Button>
      {slideContent}
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

// CreateTeam slice 1

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
      <InfoBox mode="hint" severity="medium">
        Team name must be at least 3 characters long.
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
        autoComplete="off"
        {...register("teamName")}
      />
      <button className={`btn-invite`}>Create</button>
    </form>
  );
}

// CreateTeam slice 2

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
      <InfoBox mode="warning" severity="medium">
        {errors.email?.message}
      </InfoBox>
    );
  } else {
    infobox = (
      <InfoBox mode="hint" severity="medium">
        Add team members by entering their email addresses.
      </InfoBox>
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
