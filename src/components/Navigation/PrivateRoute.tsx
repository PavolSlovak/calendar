import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/authContext";

function PrivateRoute({ element }: any) {
  const { currentUser } = useAuth();

  return currentUser ? element : <Navigate to="/auth?login" />;
}

export default PrivateRoute;
