import { useState } from "react";
import { useAuth } from "../../store/authContext";
import Card from "../../components/UI/Card";
import InfoBox from "../../components/UI/InfoBox";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "../../utils/http-FS_users";
import { auth } from "../../firebase/firebase";
import { getErrorMessage } from "../../store/hooks/getErrorMessage";

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  async function handleLogout() {
    setError(null);
    try {
      await logout();
      navigate("/auth?login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to log out");
    }
  }
  async function handleDelete(uid: string) {
    setError(null);
    try {
      await deleteUser(uid);
      navigate("/auth?login");
      console.log("User deleted");
    } catch (error) {
      const message = getErrorMessage;
      console.error("Delete error:", message);
      setError(`Failed to delete user: ${message}`);
    }
  }
  return (
    <Card>
      <h1>Profile</h1>
      {error && (
        <InfoBox mode="warning" severity="medium">
          {error}
        </InfoBox>
      )}
      <p>Username: {currentUser?.displayName}</p>
      <p>Email: {currentUser?.email}</p>
      <Link to="/update-profile" className="btn-blue">
        Update Profile
      </Link>
      <button
        className="btn-delete"
        onClick={() => {
          if (currentUser) {
            handleDelete(currentUser.uid);
          }
        }}
      >
        Delete
      </button>
      <button className="btn-submit" onClick={handleLogout}>
        Log Out
      </button>
    </Card>
  );
}

export default Profile;
