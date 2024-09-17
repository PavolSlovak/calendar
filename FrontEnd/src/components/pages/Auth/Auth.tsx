import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Card from "../../UI/Card";
import ForgotPassword from "./ForgotPassword";

function Auth() {
  const [component, setComponent] = useState<JSX.Element>();
  const location = useLocation();

  useEffect(() => {
    switch (location.search) {
      case "?signup":
        setComponent(<Signup />);
        break;
      case "?login":
        setComponent(<Login />);
        break;
      case "?forgot-password":
        setComponent(<ForgotPassword />);
        break;
      default:
        setComponent(<Login />);
    }
  }, [location.search]);

  return <Card>{component}</Card>;
}

export default Auth;
