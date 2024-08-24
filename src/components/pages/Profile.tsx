import { useAuth } from "../../store/authContext";
import Card from "../UI/Card";

function Profile() {
  const { currentUser } = useAuth();
  return (
    <Card>
      <h1>Profile</h1>
      {currentUser?.email}
    </Card>
  );
}

export default Profile;
