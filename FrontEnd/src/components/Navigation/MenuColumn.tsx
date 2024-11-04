import Button from "../UI/Button";
import { motion } from "framer-motion";
import NavbarLink from "../UI/NavLink";

type MenuColumnProps = {
  handleToggle: () => void;
  path: string | undefined;
};

// Data for the menu animation
const menuVariants = {
  hidden: {
    x: "-100%",
    transition: { type: "tween", duration: 0.3 },
  },
  visible: {
    x: 0,
    transition: { type: "tween", duration: 0.3 },
  },
};

function MenuColumn({ handleToggle, path }: MenuColumnProps) {
  return (
    <motion.div
      className={`flex-col top-0 bg-white w-full z-10 `}
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <span className="flex w-full justify-end">
        <Button onClick={handleToggle}>&#x2717;</Button>
      </span>
      <ul>
        <li className="border-t">
          <NavbarLink location="/" onActive={path} onClickAction={handleToggle}>
            Home
          </NavbarLink>
        </li>
        <li>
          <NavbarLink
            location="/calendar"
            onActive={path}
            onClickAction={handleToggle}
          >
            Calendar
          </NavbarLink>
        </li>
        <li>
          <NavbarLink
            location="/teams"
            onActive={path}
            onClickAction={handleToggle}
          >
            Teams
          </NavbarLink>
        </li>
      </ul>
      <div className="flex flex-col flex-grow bg-green-100 justify-center items-center">
        <span className="flex h-36 w-36  rounded-full bg-slate-500"></span>
        <span>Pavol Slovak</span>
        <span>pavol.slovak1995@gmail.com</span>
      </div>
    </motion.div>
  );
}

export default MenuColumn;
