import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type NavbarLink = {
  styles: string;
  location: string;
  onActive: string | undefined;
  children: ReactNode;
  onClickAction?: () => void;
};
function NavbarLink({
  styles,
  location,
  onActive,
  children,
  onClickAction,
}: NavbarLink) {
  return (
    <>
      <Link
        className={`${onActive === location ? styles + "active" : styles}`}
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
