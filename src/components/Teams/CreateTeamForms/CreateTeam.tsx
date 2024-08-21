import { useEffect, useRef, useState } from "react";
import Modal, { ModalHandle } from "../../UI/Modal";
import Button from "../../UI/Button";
import RadioButtons from "../../UI/RadioButtons";
import { teamSlice } from "../../../store/teams-slice";
import { useDispatch } from "react-redux";
import users from "../../../dummy_users";
import { z } from "zod";
import FormS1 from "./FormS1";
import FormS2 from "./FormS2";

type CreateTeamProps = {
  onDone: () => void;
};

// Define the Zod schema for a User
const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  profilePicture: z.string(),
  role: z.enum(["Admin", "Editor", "Viewer"]),
  hashedPassword: z.string(),
});

// Define the Zod schema for a Team
const TeamSchema = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters!"),
  members: z.array(UserSchema),
  createdBy: UserSchema,
});

type Team = z.infer<typeof TeamSchema>;

function CreateTeam({ onDone }: CreateTeamProps) {
  const modal = useRef<ModalHandle>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();
  /* const { currentUser } = useAuth(); */
  const currentUser = users[1];

  const [newTeam, setNewTeam] = useState<Team>({
    teamName: "",
    members: [],
    createdBy: currentUser,
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

  function handleSubmit() {
    setIsSubmitting(true);
    // TODO - Add the new team to the database
    new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("New team:", newTeam);
    dispatch(teamSlice.actions.addTeam(newTeam));
    setIsSubmitting(false);
    onDone(); // Close the modal
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
          <p>Members:</p>
          <ul>
            {newTeam.members.map((member) => (
              <li key={member.id}>{member.username}</li>
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