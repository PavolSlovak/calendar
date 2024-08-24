import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type NavbarLink = {
  location: string;
  onActive: string | undefined;
  children: ReactNode;
  onClickAction?: () => void;
};
function NavbarLink({
  location,
  onActive,
  children,
  onClickAction,
}: NavbarLink) {
  return (
    <>
      <Link
        className={`${
          onActive === location ? "linkclasses active" : "linkclasses"
        }`}
        to={location}
        onClick={onClickAction}
      >
        {children}
      </Link>
      {onActive === location && (
        <motion.div
          layoutId="underline-object"
          className="bg-black w-full h-1 rounded"
        ></motion.div>
      )}
    </>
  );
}

export default NavbarLink;
