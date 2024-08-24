import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Card from "../../UI/Card";

function Auth() {
  const [component, setComponent] = useState<JSX.Element>();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes("signup")) {
      setComponent(<Signup />);
    } else if (location.search.includes("login")) {
      setComponent(<Login />);
    }
  }, [location.search]);

  return <Card>{component}</Card>;
}

export default Auth;
