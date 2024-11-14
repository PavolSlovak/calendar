import { useState } from "react";
import { useAuth } from "../../store/authContext";
import Card from "../../components/UI/Card";
import InfoBox from "../../components/UI/InfoBox";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "../../utils/http-FS_users";
import { auth } from "../../firebase/firebase";
import { getErrorMessage } from "../../store/hooks/getErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProfileDeleteModal } from "./ProfileDeleteModal";
import { set } from "date-fns";

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleLogout() {
    setError(null);

    try {
      await logout();
      navigate("/auth?login");
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Logout error:", message);
      setError(`Failed to log out: ${message}`);
    }
  }
  function handleDeleteProfile() {
    setIsDeleteModalOpen(true);
  }
  return (
    <>
      <Card>
        <h1>Profile</h1>
        {error && (
          <InfoBox mode="warning" severity="medium">
            {error}
          </InfoBox>
        )}
        <p>Username: {currentUser?.displayName}</p>
        <p>Email: {currentUser?.email}</p>

        <div className=" flex flex-col w-full items-center gap-2">
          <Link to="/update-profile" className="btn-blue">
            Update Profile
          </Link>

          <button className="btn-submit" onClick={handleLogout}>
            Log Out
          </button>
          <button className="btn-delete" onClick={handleDeleteProfile}>
            Delete
          </button>
        </div>
      </Card>
      {isDeleteModalOpen && currentUser && (
        <ProfileDeleteModal
          setModalOpen={setIsDeleteModalOpen}
          userUIDtoDelete={currentUser.uid}
        />
      )}
    </>
  );
}

export default Profile;
