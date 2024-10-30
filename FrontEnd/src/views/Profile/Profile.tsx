import { useState } from "react";
import { useAuth } from "../../store/authContext";
import Card from "../../components/UI/Card";
import InfoBox from "../../components/UI/InfoBox";
import { Link, useNavigate } from "react-router-dom";

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
      <button onClick={handleLogout}>Log Out</button>
    </Card>
  );
}

export default Profile;
