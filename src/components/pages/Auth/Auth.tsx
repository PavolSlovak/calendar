import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import { motion } from "framer-motion";

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

  // Auth form animation
  const authVariants = {
    hidden: { opacity: 0, y: "-10vh" },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <motion.div
      className="flex justify-center py-10"
      initial={"hidden"}
      animate={"visible"}
      variants={authVariants}
      transition={{ type: "spring", stiffness: 120, duration: 0.1 }}
    >
      {component}
    </motion.div>
  );
}

export default Auth;
