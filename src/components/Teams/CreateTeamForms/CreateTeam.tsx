import { useEffect, useRef, useState } from "react";
import Modal, { ModalHandle } from "../../UI/Modal";
import Button from "../../UI/Button";
import RadioButtons from "../../UI/RadioButtons";
import { teamSlice } from "../../../store/teams-slice";
import { useDispatch } from "react-redux";
import FormS1 from "./FormS1";
import FormS2 from "./FormS2";
import { useAuth } from "../../../store/authContext";
import { Team, User } from "../../../lib/types";

type CreateTeamProps = {
  onDone: () => void;
};

function CreateTeam({ onDone }: CreateTeamProps) {
  const modal = useRef<ModalHandle>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const [newTeam, setNewTeam] = useState<Team>({
    id: Math.random().toString(36).substring(7),
    teamName: "",
    invitations: [],
    members: [],
    createdBy: currentUser!,
    weekSchedule: [],
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

    // Extract necessary fields from the currentUser object
    const userToAdd: User = {
      uid: currentUser?.uid || "",
      email: currentUser?.email || "",
      displayName: currentUser?.displayName || "",
      photoURL: currentUser?.photoURL || "",
    };
    // Add the serialized user to the members array
    newTeam.members.push(userToAdd);
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
